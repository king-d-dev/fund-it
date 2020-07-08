const mongoose = require('mongoose');
const {
  userTypes,
  returnPeriods,
  projectCategories,
  idTypes,
} = require('../enums');

const { Schema } = mongoose;
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
  },
  bio: String,
  photo: String,
  idNumber: String,
  idType: {
    type: String,
    required: true,
    enum: idTypes,
  },
  userType: { type: String, required: true, enum: userTypes },
});

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    _owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      enum: projectCategories,
    },
    fundTarget: { type: Number, required: true },
    amountRaised: { type: Number, default: 0.0 },
    BIN: { type: String, required: true, unique: true },
    returnRate: { type: Number, required: true },
    returnPeriod: {
      type: String,
      enum: returnPeriods,
      default: 'Monthly',
    },
    photo: String,
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', description: 'text', category: 'text' });

const InvestmentSchema = new Schema(
  {
    _investor: { type: Schema.Types.ObjectId, ref: 'User' },
    _project: { type: Schema.Types.ObjectId, ref: 'Project' },
    transactionDetails: { type: Object, required: true },
  },
  { timestamps: true }
);

mongoose.model('User', UserSchema);
mongoose.model('Project', ProjectSchema);
mongoose.model('Investment', InvestmentSchema);
