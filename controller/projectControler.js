const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const Project = mongoose.model('Project');
const Investment = mongoose.model('Investment');
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

  const formData = new FormData();
  formData.append('image', req.files.photo.data);

  const config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      ...formData.getHeaders(),
    },
    data: formData,
  };

  try {
    const { data } = await axios(config);

    const createdProject = await Project.create({
      ...req.body,
      _owner: req.user._id,
      photo: data.data.link,
    });

    return res.json({ success: true, data: createdProject });
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
}

async function fetch_projects(req, res) {
  let projects;

  if (req.query.category) {
    projects = await Project.find({ category: req.query.category }).populate(
      '_owner'
    );
  } else if (req.query.search) {
    projects = await Project.find({
      $text: { $search: req.query.search },
    }).populate('_owner');
  } else {
    projects = await Project.find().populate('_owner');
  }

  return res.status(200).json({ data: projects });
}

async function featuredProjects(req, res) {
  const projects = await Project.aggregate([
    { $sample: { size: 10 } },
    {
      $lookup: {
        from: 'users',
        localField: '_owner',
        foreignField: '_id',
        as: '_owner',
      },
    },
    { $unwind: '$_owner' },
  ]);

  return res.status(200).json({ data: projects });
}

async function getUserProjects(req, res) {
  try {
    const projects = await Project.find({ _owner: req.params.userId });
    return res.json({ data: projects });
  } catch (error) {
    return res.status(404).json({ data: { error: error.message } });
  }
}

async function getProjectInvestors(req, res) {
  const data = await Investment.find({
    _project: req.params.projectId,
  }).populate('_investor', '-password');

  console.log('investors', data);
  return res.json({ data });
}

async function getMyInvestments(req, res) {
  const investments = await Investment.find({ _investor: req.user._id });

  return res.json({ data: investments });
}

module.exports = {
  create_project,
  fetch_projects,
  getUserProjects,
  featuredProjects,
  getProjectInvestors,
  getMyInvestments,
};
