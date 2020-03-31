const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const passport = require('passport');
const User = mongoose.model('User');
const Investment = mongoose.model('Investment');
const Project = mongoose.model('Project');
const cloudinary = require('cloudinary');
const jwtSecret = process.env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PERIODS = ['Weekly', 'Monthly', 'Quarterly', 'Annually'];
const CATEGORIES = [
  'Engineering & Manufacturing',
  'Science & Research',
  'Social Development',
  'Fashion & Design'
];

const generateToken = user =>
  jwt.encode({ sub: user._id, iat: Date.now() }, jwtSecret);
// const decodeToken = token => jwt.decode(token, jwtSecret);
const requireAuth = passport.authenticate('jwt', { session: false });

async function PARAM_projectId(req, res, next, id) {
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
    confirmPassword
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
    photo: []
  };

  let existing_user = await User.findOne({ email });
  if (existing_user) {
    errors.email.push('this email is associated with an existing account');
  }

  if (idNumber.length < 14) {
    errors.idNumber.push('ID number must not be less than 14 characters long');
  }

  if (password.length < 8) {
    errors.password.push('password must be 8 characters or more');
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
    // const uploadedImage = await cloudinary.uploader.upload(
    //   req.files.photo.tempFilePath
    // );

    if (req.files && req.files.photo) {
      const store = path.resolve(__dirname, '..', 'store');
      const image_path = path.join(store, req.files.photo.name);

      if (!fs.existsSync(store)) {
        fs.mkdirSync(store);
      }
      req.files.photo.mv(image_path, async error => {
        if (error) return res.status(500).send(error.message);

        /**
            in cases where req.file is not available, variable uploadedImage is never 
            created causing an error here 
          */
        User.create({
          ...req.body,
          password: hash,
          userType: req.query.userType,
          photo: image_path
        })
          .then(user => {
            const token = generateToken(user);

            return res.status(200).json({ token, user });
          })
          .catch(error => {
            return res.status(500).send({ errorMessage: error.message });
          });
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('');
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!(email && email.trim() && password && password.trim())) {
    return res.status(401).json({ errorMessage: 'all fields required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ errorMessage: 'wrong email or password' });
  }

  const password_correct = await bcrypt.compare(password, user.password);
  if (!password_correct) {
    return res.status(401).json({ errorMessage: 'wrong email or password' });
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
    const result = await cloudinary.uploader.upload(req.file.path);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        photo: result.url
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

async function create_project(req, res) {
  const {
    title,
    description,
    category,
    BIN,
    returnRate,
    returnPeriod,
    fundTarget
  } = req.body;

  const errors = {
    title: [],
    description: [],
    fundTarget: [],
    category: [],
    returnPeriod: [],
    returnRate: [],
    BIN: [],
    photo: []
  };

  if (!(BIN && BIN.trim())) {
    errors.BIN.push('please provide a valid BIN');
  }

  if (!returnPeriod || PERIODS.indexOf(returnPeriod) == -1) {
    errors.returnPeriod.push('please select a valid returns period');
  }

  if (!category || CATEGORIES.indexOf(category) == -1) {
    errors.category.push('please select a valid returns period');
  }

  if (!(title && title.trim())) {
    errors.title.push('title is required');
  } else {
    if (title.trim().length > 32) {
      errors.title.push('title cannot be longer than 32 characters');
    }
  }

  if (description && description.trim()) {
    if (description.trim().length > 256) {
      errors.description.push(
        'description cannot be longer than 256 characters'
      );
    }
  }

  if (!(fundTarget && fundTarget.trim())) {
    errors.fundTarget.push('fund target field required');
  } else {
    if (isNaN(fundTarget.trim())) {
      errors.fundTarget.push('invalid value for fund target');
    }
  }

  if (returnRate && returnRate.trim()) {
    if (isNaN(returnRate)) {
      errors.returnRate.push('invalid value for discount');
    }
  } else errors.returnRate.push('please enter the return rate');

  if (!req.file) {
    errors.photo.push('please add a project photo');
  }

  const error_count = Object.keys(errors).reduce(
    (total, key) => errors[key].length + total,
    0
  );

  if (error_count) {
    return res.status(401).json({ errors });
  }

  // const uploadedImage = await cloudinary.uploader.upload(req.file.path);

  await Project.create({
    ...req.body,
    _owner: req.user._id
    // photo: uploadedImage.url
  });
  let user = req.user;
  delete user.password;

  const projects = await Project.find({ _owner: req.user._id });
  return res.status(200).json({ success: true, projects, user });
}

async function fetch_projects(req, res) {
  let projects;
  if (req.query.category) {
    projects = await Project.find({ category: req.query.category });
  } else if (req.query.search) {
    projects = await Project.find({ $text: { $search: req.query.search } });
  } else {
    projects = await Project.find();
  }

  return res.status(200).json({ projects });
}

async function fetch_project(req, res) {
  return res.status(200).json({ project: req.project });
}

async function invest(req, res) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res
      .status(401)
      .json({ errorMessage: 'please enter a valid amount to invest' });
  }
  const investment = await Investment.create({
    _investor: req.user._id,
    _project: req.project,
    amount
  });
}

function test_payment(req, res) {
  return res.send('test');
}

module.exports = app => {
  app.post('/api/register', create_user_account);
  app.post('/api/login', login);
  app.post('/api/edit-profile/', requireAuth, edit_profile);
  app.post('/api/set-profile-photo/', requireAuth, set_profile_photo);
  app.get('/api/projects', fetch_projects);
  app.get('/api/projects/:projectId', PARAM_projectId, fetch_project);
  app.post('/api/create-project', requireAuth, create_project);

  //Testing the Rave API
  app.post('/api/payment-success', (req, res) => {
    console.log('Success : ', req.body);
    return res.json({ success: true });
  });
  app.post('/api/payment-failure', (req, res) => {
    console.log('Failure : ', req.body);
    return res.json({ success: false });
  });
};
