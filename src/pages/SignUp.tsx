
import React from 'react';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <div className="py-12 came-container">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mono mb-8 text-center">Create an Account</h1>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
