import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// paypal secret: EDMDH6jK6fqLIuvGMQrJLAJ6rtrMGRp4WGZ_dsfW3FcdmRu9Zj2qaOKWdWeuYccL8Ac6OxN34pnWGRT4

const PayPalPayment = ({ amount }) => {
  const CLIENT_ID = 
  'AXKrM-JIBfuy_0xuDZq_uIe2Nn1TX73EIBETyuSq0IcWThEAB5-WCDRvKBcqqoITd_vz-EBUmx5t8lIZ'; // Replace with your actual Client ID

  const paypalURL = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`;

  const payWithPayPal = `
    <html>
      <head>
        <script src="${paypalURL}"></script>
      </head>
      <body>
        <div id="paypal-button-container"></div>
        <script>
          paypal.Buttons({
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '${amount}'
                  }
                }]
              });
            },
            onApprove: function(data, actions) {
              return actions.order.capture().then(function(details) {
                window.ReactNativeWebView.postMessage('Payment Successful');
              });
            }
          }).render('#paypal-button-container');
        </script>
      </body>
    </html>
  `;



const makePayout = async (amount, email) => {
  try {
    const response = await fetch('http://localhost:5000/api/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, email }),
    });

    const result = await response.json();
    console.log('Payout Result:', result);
  } catch (error) {
    console.error('Error in payout:', error);
  }
};


  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: payWithPayPal }}
      onMessage={(event) => {
        if (event.nativeEvent.data === 'Payment Successful') {
          console.log('Payment success');
          // Handle successful payment (save details to Firestore or perform necessary actions)
        }
      }}
    />
  );
};

export default PayPalPayment;
