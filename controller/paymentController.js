const mongoose = require('mongoose');
const Investment = mongoose.model('Investment');
const paystack = require('paystack')(process.env.PAY_STACK_SECRET_KEY);

function verifyTransaction(req, res) {
  const transactionReference = req.query.reference;

  if (!transactionReference)
    return res
      .status(400)
      .send('Please add a transaction reference to this request');

  paystack.transaction
    .get(transactionReference)
    .then((res) => {
      return res.send('ok');
    })
    .catch((error) => {
      console.log('varify tran error', error);
      return res
        .status(400)
        .send('something went wrong while verifying transaction');
    });
}

function createProjectInvestment(req, res) {}

module.exports = { verifyTransaction, createProjectInvestment };
