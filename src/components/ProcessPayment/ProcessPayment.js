import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SimpleCardForm from './SimpleCardForm';
import SplitCardForm from './SplitCardForm';

const stripePromise = loadStripe('pk_test_51IebtOEfLSXh2ldbzYeSMtviCqBvw8YzxhRbhXc265i3Sm6U2KPd15mkawWspI5SKKHTR098dyG37HCBT5Ks8qsA00DWv77nhV');

const ProcessPayment = ({handlePayment}) => {
    return (
        <Elements stripe={stripePromise}>
            <SimpleCardForm handlePayment={handlePayment}></SimpleCardForm>
            {/* <SplitCardForm></SplitCardForm> */}
        </Elements>
    );
};

export default ProcessPayment;