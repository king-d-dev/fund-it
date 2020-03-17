const mongoose = require('mongoose');
const Solicitor = mongoose.model('Solicitor');
const Investor = mongoose.model('Investor');

function require_logged_in(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('you must be logged in');
  }

  next();
}

async function require_email_verified(req, res, next) {
  const user = await User.findById(req.session.user);
  if (!user.meta.includes('EMAIL_VERIFIED')) {
    return res.status(401).send('please, verify your email');
  }

  next();
}

module.exports = { require_logged_in, require_email_verified };
