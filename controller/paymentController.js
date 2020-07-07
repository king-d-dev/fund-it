const mongoose = require('mongoose');
const Investment = mongoose.model('Investment');
const Project = mongoose.model('Project');
const paystack = require('paystack')(process.env.PAY_STACK_SECRET_KEY);

function fundNow(req, res) {
  const transactionReference = req.query.reference;

  if (!transactionReference)
    return res
      .status(400)
      .send('Please add a transaction reference to this request');

  paystack.transaction
    .get(transactionReference)
    .then(async ({ data }) => {
      await Promise.all([
        Investment.create({
          _investor: req.user._id,
          _project: req.params.projectId,
          transactionDetails: data.data,
        }),
        Project.updateOne(
          { _id: req.params.projectId },
          { $inc: { amountRaised: data.data.amount } }
        ),
      ]);

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

module.exports = { fundNow, createProjectInvestment };
