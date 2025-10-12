import React from 'react';
import Header from './Header';

type PageLayoutProps = React.PropsWithChildren<{}>;

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="mx-auto w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
