import React from 'react';

export const QuoteDashboard = () => {
  return (
    <div className="my-3">
      <h1 className="text-sm uppercase">Welcome back,</h1>
      <p className="text-4xl font-medium">Kowalski 👋</p>
      {/* creative quote */}
      <p className="text-accent text-xs">
        great day's comming, <span className="font-bold">Kowalski!</span>
      </p>
    </div>
  );
};
