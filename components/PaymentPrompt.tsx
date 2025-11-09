import React from 'react';
import Logo from './Logo';

interface PaymentPromptProps {
  onPay: () => void;
  isExpired: boolean;
}

const PaymentPrompt: React.FC<PaymentPromptProps> = ({ onPay, isExpired }) => {
  const message = isExpired
    ? "💛 Time’s up! Tap below to renew your hour and keep learning."
    : "Hey friend 💛 Before we begin, please make a quick R24 payment to unlock your 1-hour IT Mastery session!";

  const buttonText = isExpired ? "Extend for R24" : "Start 1-Hour Session (R24)";

  return (
    <div className="fixed inset-0 bg-energetic-light-yellow bg-opacity-95 flex flex-col justify-center items-center p-6 text-center z-20">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <Logo className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-charcoal-gray mb-4">
          Welcome to Funda Nathi
        </h2>
        <p className="text-charcoal-gray mb-6">{message}</p>
        <button
          onClick={onPay}
          className="w-full bg-deep-energetic-yellow text-charcoal-gray font-bold py-4 px-6 rounded-full text-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
        >
          {buttonText}
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Payments are simulated for this demo. By continuing, you agree that your chat data is temporary and payments are handled securely.
        </p>
      </div>
    </div>
  );
};

export default PaymentPrompt;