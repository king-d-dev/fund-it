import React, { useEffect, useContext } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Context as AuthContext } from '../context/authContext';
import {
  usePaystackPayment,
  PaystackButton,
  PaystackConsumer,
} from 'react-paystack';

function PaymentPage() {
  const { state: authState } = useContext(AuthContext);
  const params = useParams();
  const reactLocation = useLocation();
  console.log(reactLocation.state);

  const config = {
    reference: params.projectId,
    email: authState.user?.email,
    amount: reactLocation.state.amount,
    publicKey: 'pk_test_3cfd3b8fb93410ef41a02346e9ceb0a3bd49349b',
  };
  const componentProps = {
    ...config,
    text: 'Paystack Button Implementation',
    onSuccess: () => {
      console.log('success');
    },
    onClose: () => {
      console.log('closed');
    },
  };

  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    initializePayment();
  });

  return (
    <div>
      <button
        onClick={() => {
          initializePayment();
        }}
      >
        pay here
      </button>

      <PaystackButton {...componentProps} />
      <PaystackConsumer {...componentProps}>
        {({ initializePayment }) => (
          <button onClick={() => initializePayment()}>
            Paystack Consumer Implementation
          </button>
        )}
      </PaystackConsumer>
    </div>
  );
}

export default PaymentPage;
