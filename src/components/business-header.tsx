"use client";

import React from "react";

interface BusinessHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export default function BusinessHeader({
    title,
    description,
    className = "",
}: BusinessHeaderProps) {
    return (
        <div className={`mb-[30px] ${className}`}>
            <h1 className="text-2xl font-bold mb-[8px]">
                {title}
            </h1>

            {description && (
                <p className="text-gray-600 text-[13px]">
                    {description}
                </p>
            )}
        </div>
    );
};