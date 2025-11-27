import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';

const PageLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="mx-auto w-full flex flex-col items-center mt-[80px]">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
