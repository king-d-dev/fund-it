const mongoose = require('mongoose');
const Investment = mongoose.model('Investment');
const Project = mongoose.model('Project');
const paystack = require('paystack')(process.env.PAY_STACK_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function fundNow(req, res) {
  const { transactionDetails } = req.body;

  try {
    if (!transactionDetails)
      throw new Error('Your Payment could not be validated');

    await Promise.all([
      Investment.create({
        _investor: req.user._id,
        _project: req.params.projectId,
        transactionDetails: transactionDetails,
      }),
      Project.updateOne(
        { _id: req.params.projectId },
        { $inc: { amountRaised: transactionDetails.amount / 10 } }
      ),
    ]);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}

function createProjectInvestment(req, res) {}

async function getPaymentIntent(req, res) {
  const { client_secret } = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: req.user.email,
  });

  return res.json({ client_secret });
}

module.exports = { fundNow, createProjectInvestment, getPaymentIntent };
