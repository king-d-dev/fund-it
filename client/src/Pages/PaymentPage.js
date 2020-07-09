import React, { useEffect, useContext, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import { Context as AuthContext } from '../context/authContext';
import { Button } from 'semantic-ui-react';
import fundItApi from '../api/fundIt';
import {
  usePaystackPayment,
  PaystackButton,
  PaystackConsumer,
} from 'react-paystack';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

const options = {
  style: {
    base: {
      padding: 400,
      fontSize: '16px',
      backgroundColor: '#fff',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentPage() {
  const [loading, setLoadingTo] = useState(false);
  const [error, setErrorTo] = useState('');
  const { state: authState } = useContext(AuthContext);
  const reactLocation = useLocation();
  const { projectId } = useParams();
  const reactHistory = useHistory();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      console.log('here');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      setLoadingTo(true);
      const {
        data: { client_secret },
      } = await fundItApi.post('/payment-intent', {
        amount: reactLocation.state.amount * 100,
      });

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: authState.user?.fullName,
          email: authState.user?.email,
        },
      });

      if (error) {
        setLoadingTo(false);
        setErrorTo(error.message);
      } else {
        const confirmedCardPayment = await stripe.confirmCardPayment(
          client_secret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmedCardPayment.paymentIntent.status === 'succeeded') {
          await fundItApi.post(`/projects/${projectId}/fund-now`, {
            transactionDetails: confirmedCardPayment.paymentIntent,
          });

          reactHistory.replace('/me/investments');
        } else {
          setLoadingTo(false);
          setErrorTo(
            'Could not finish Processing your payment, Try again soon'
          );
        }
      }
    } catch (error) {
      setLoadingTo(false);
      setErrorTo(error.toString());
    }
  };

  return (
    <React.Fragment>
      <SweetAlert
        show={!!error}
        type="error"
        title="Error"
        text={error}
        onConfirm={() => setErrorTo('')}
      />

      <div css={styles.container}>
        <div css={styles.content}>
          <CardElement options={options} />
          <div css={styles.button}>
            <Button
              disabled={loading || !stripe}
              onClick={(e) => handleSubmit(e)}
              color="green"
            >
              {loading
                ? 'PROCESSING...'
                : `PAY GH₵ ${reactLocation.state.amount}`}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PaymentPage;

const styles = {
  container: css`
    display: flex;
    height: calc(100vh - ${window.headerHeight});
    justify-content: center;
    align-items: center;
    background-color: #fff;
  `,
  content: css`
    width: 50%;
    padding: 50px;
    margin: auto 0;
    border-radius: 5px;
    background-color: #eee;
  `,
  button: css`
    text-align: center;
    margin-top: 50px;
  `,
};
