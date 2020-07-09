const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const passport = require('passport');
const axios = require('axios');
const User = mongoose.model('User');
const Investment = mongoose.model('Investment');
const Project = mongoose.model('Project');

const {
  create_project,
  fetch_projects,
  featuredProjects,
  getUserProjects,
  getProjectInvestors,
  getMyInvestments,
} = require('../controller/projectControler');
const {
  fundNow,
  createProjectInvestment,
  getPaymentIntent,
} = require('../controller/paymentController');

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (user) =>
  jwt.encode({ sub: user._id, iat: Date.now() }, jwtSecret);
// const decodeToken = token => jwt.decode(token, jwtSecret);
const requireAuth = passport.authenticate('jwt', { session: false });

async function PARAM_projectId(req, res, next, id) {
  console.log('id', id);
  const project = await Project.findById(id);
  req.project = project;

  return next();
}

async function create_user_account(req, res) {
  const {
    fullName,
    email,
    phoneNumber,
    idType,
    idNumber,
    password,
    confirmPassword,
  } = req.body;

  if (
    !(
      fullName &&
      fullName.trim() &&
      email &&
      email.trim() &&
      idType &&
      idType.trim() &&
      idNumber &&
      idNumber.trim() &&
      phoneNumber &&
      phoneNumber.trim() &&
      password &&
      password.trim() &&
      confirmPassword &&
      confirmPassword.trim()
    )
  ) {
    return res
      .status(401)
      .json({ errorMessage: 'Please fill all required fields' });
  }

  const errors = {
    fullName: [],
    email: [],
    password: [],
    idNumber: [],
    confirm_password: [],
    photo: [],
  };

  let existing_user = await User.findOne({ email });
  if (existing_user) {
    errors.email.push('this email is associated with an existing account');
  }

  if (password !== confirmPassword) {
    errors.password.push('passwords do not match');
  }

  if (!req.files || !req.files.photo || !req.files.photo.name) {
    errors.photo.push('Please upload a profile photo');
  }

  const error_count = Object.keys(errors).reduce(
    (total, key) => errors[key].length + total,
    0
  );

  if (error_count) {
    return res.status(401).json({ errors });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    if (req.files && req.files.photo) {
      const store = path.resolve(__dirname, '..', 'store');
      const image_path = path.join(store, req.files.photo.name);

      if (!fs.existsSync(store)) {
        fs.mkdirSync(store);
      }
      req.files.photo.mv(image_path, async (error) => {
        if (error) return res.status(500).send(error.message);

        /**
            in cases where req.file is not available, variable uploadedImage is never 
            created causing an error here 
          */
        User.create({
          ...req.body,
          password: hash,
          userType: req.query.userType,
          photo: image_path,
        })
          .then((user) => {
            const token = generateToken(user);

            return res.status(200).json({ token, user });
          })
          .catch((error) => {
            return res.status(500).send({ errorMessage: error.message });
          });
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('something went bad while processing your request');
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!(email && email.trim() && password && password.trim())) {
    return res.status(401).json({ errorMessage: 'all fields required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ errorMessage: 'invalid email' });
  }

  const password_correct = await bcrypt.compare(password, user.password);
  if (!password_correct) {
    return res.status(401).json({ errorMessage: 'invalid password' });
  }

  const token = generateToken(user);

  res.status(200).json({ token, user });
}

async function edit_profile(req, res) {
  const { fullName, email, phoneNumber, bio } = req.body;
  if (
    !(
      fullName &&
      fullName.trim() &&
      email &&
      email.trim() &&
      phoneNumber &&
      phoneNumber.trim() &&
      bio &&
      bio.trim()
    )
  ) {
    return res
      .status(401)
      .json({ errorMessage: 'Please provide all relevant information' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, select: { password: false } }
  );

  return res.status(200).json({ success: true, user });
}

async function set_profile_photo(req, res) {
  try {
    if (req.files && req.files.photo) {
      const store = path.resolve(__dirname, '..', 'store');
      const image_path = path.join(store, req.files.photo.name);

      if (!fs.existsSync(store)) {
        fs.mkdirSync(store);
      }

      req.files.photo.mv(image_path, async (error) => {
        if (error) return res.status(500).send(error.message);
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        photo: image_path,
      },
      { new: true, select: { password: false } }
    );

    console.log(user.photo);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log('Error:', error);
    return next(error);
  }
}

async function fetch_project(req, res) {
  return res.status(200).json({ project: req.project });
}

module.exports = (app) => {
  app.post('/api/register', create_user_account);
  app.post('/api/login', login);
  app.post('/api/edit-profile/', requireAuth, edit_profile);
  app.post('/api/set-profile-photo/', requireAuth, set_profile_photo);
  app.post('/api/create-project', requireAuth, create_project);

  app.get('/api/projects', fetch_projects);
  app.get('/api/projects/:projectId/investors', getProjectInvestors);
  app.get('/api/featured-projects', featuredProjects);
  app.get('/api/projects/:projectId', PARAM_projectId, fetch_project);
  app.get('/api/me/investments', requireAuth, getMyInvestments);
  app.get('/api/projects/:projectId/invest', createProjectInvestment);
  app.get('/api/user/:userId/projects', requireAuth, getUserProjects);

  // payment routes
  app.post('/api/projects/:projectId/fund-now', requireAuth, fundNow);
  app.post('/api/payment-intent', requireAuth, getPaymentIntent);
};
