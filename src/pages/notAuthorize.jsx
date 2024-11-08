import React from 'react';
import { Link } from 'react-router-dom';

function NotAuthorizedPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="text-xl mt-4">
        You do not have the necessary permissions to view this page.
      </p>
      <Link to="/" className="mt-8 text-blue-500 underline">
        Go back to Home
      </Link>
    </div>
  );
}

export default NotAuthorizedPage;
