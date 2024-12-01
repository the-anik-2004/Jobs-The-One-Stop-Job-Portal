import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, user, isLoaded } = useUser();
    const { pathname } = useLocation();

    // Redirect unauthenticated users to the sign-in page
    if (isLoaded && !isSignedIn) {
        return <Navigate to="/?sign-in=true" />;
    }

    // Redirect signed-in users without a 'role' metadata to the onboarding page
    if (isSignedIn && !user?.unsafeMetadata?.role && pathname !== "/onboarding") {
        return <Navigate to="/onboarding" />;
    }

    // If all conditions are met, render the children components
    return children;
};

export default ProtectedRoute;
