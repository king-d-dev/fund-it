const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = process.env.JWT_SECRET;

const jwtOptions = {
  secretOrKey: keys,
  jwtFromRequest: ExtractJwt.fromHeader('authenticate'),
};

const jwtStrategy = new Strategy(jwtOptions, async function (payload, done) {
  try {
    const user = await User.findById(payload.sub, { password: false });

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);
