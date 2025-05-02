import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '72px', marginBottom: '24px' }}>404</h1>
      <p style={{ fontSize: '24px', marginBottom: '24px' }}>Page Not Found</p>
      <Link to="/meallist" style={{ fontSize: '18px', color: '#007bff' }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
