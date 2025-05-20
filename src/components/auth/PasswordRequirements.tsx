
import React from 'react';

const PasswordRequirements: React.FC = () => {
  return (
    <div className="text-sm text-gray-500 space-y-1">
      <p>Password must:</p>
      <ul className="list-disc pl-5">
        <li>Be at least 6 characters long</li>
        <li>Contain at least 1 uppercase letter</li>
        <li>Contain at least 1 lowercase letter</li>
        <li>Contain at least 1 number</li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
