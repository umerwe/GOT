import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`w-full px-[17px] ${className}`}>
      {children}
    </div>
  );
};

export default Container;
