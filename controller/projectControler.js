const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const { projectCategories, returnPeriods } = require('../enums');

async function create_project(req, res) {
  const {
    title,
    description,
    category,
    BIN,
    returnRate,
    returnPeriod,
    fundTarget,
  } = req.body;

  const errors = {
    title: [],
    description: [],
    fundTarget: [],
    category: [],
    returnPeriod: [],
    returnRate: [],
    BIN: [],
    photo: [],
  };

  if (!(BIN && BIN.trim())) {
    errors.BIN.push('please provide a valid BIN');
  }

  if (!returnPeriod || returnPeriods.indexOf(returnPeriod) == -1) {
    errors.returnPeriod.push('please select a valid returns period');
  }

  if (!category || projectCategories.indexOf(category) == -1) {
    errors.category.push('please select a valid returns category');
  }

  if (!(title && title.trim())) {
    errors.title.push('title is required');
  }

  if (!description || !description.trim()) {
    errors.description.push('description is required');
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

  let imagePath = '';
  const imageName = Date.now().toString() + path.extname(req.files.photo.name);
  if (req.files && req.files.photo) {
    const store = path.resolve(__dirname, '..', 'store');
    imagePath = path.join(store, imageName);

    if (!fs.existsSync(store)) {
      fs.mkdirSync(store);
    }

    req.files.photo.mv(imagePath, async (error) => {
      if (error) res.status(500).json({ errorMessage: error.message });
    });
  }

  try {
    await Project.create({
      ...req.body,
      _owner: req.user._id,
      photo: imageName,
    });

    const projects = await Project.find({ _owner: req.user._id });
    return res.json({ success: true, projects, user: req.user });
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
}

module.exports = {
  create_project,
};
