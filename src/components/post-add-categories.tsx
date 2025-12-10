import { useGetCategories } from '@/hooks/useCategories';
import React, { useState } from 'react'

const PostAddCategories = () => {
    const { data = [] } = useGetCategories();
    const navItems = [...data.map((cat: Category) => cat.title), "All"]

    const [activeItem, setActiveItem] = useState(navItems[0]);


    const handleItemClick = (item: Category) => {
        setActiveItem(item);
        console.log(`Navigating to: ${item}`);
    };
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Ad</h1>
                <p className="text-gray-600">Choose a Category</p>
            </div>
            <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleItemClick(item)}
                        className={`relative py-2 transition-all duration-300 border-b-2 
        ${activeItem === item
                                ? 'border-solid text-solid font-medium'
                                : 'border-transparent text-gray-600 hover:text-solid hover:border-solid'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PostAddCategories
