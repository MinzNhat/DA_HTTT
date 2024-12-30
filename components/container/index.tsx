import React from 'react';

interface ContainerProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const Container = ({ className, children, onClick }: ContainerProps) => {
    return (
        <div
            onClick={onClick}
            className={`!z-5 relative rounded-primary bg-lightContainer bg-clip-border
            shadow-shadow-500 dark:!bg-darkContainer dark:text-white dark:shadow-none shadow-3xl
            ${className}`}>
            {children}
        </div>
    );
};

export default Container;