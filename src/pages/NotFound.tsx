
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="py-20 came-container">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-9xl font-bold mono mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page not found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mr-2"
          >
            Go Back
          </Button>
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800">Home Page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
