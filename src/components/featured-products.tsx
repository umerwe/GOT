"use client"; 
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
    const router = useRouter(); 

    const products = [
        {
            id: 1,
            title: "Sport Motorcycle",
            tag: "FEATURED",
            description: "2023 model in excellent condition with low mileage. Perfect for both city riding and racing.",
            price: "15,999",
            rating: 4.8,
            reviewCount: 42,
            image: "f-p-1.png"
        },
        {
            id: 2,
            title: "Premium Cycling Helmet",
            tag: "NEW ARRIVAL",
            description: "Lightweight aerodynamic design with advanced safety features and ventilation system.",
            price: "129",
            rating: 4.8,
            reviewCount: 42,
            image: "f-p-2.png"
        }
    ];

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((product) => (
                        <Card 
                            key={product.id} 
                            className="border-0 shadow-none rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
                            onClick={() => router.push(`/bikes/${product.id}`)} // navigate when card clicked
                        >
                            <div className="relative aspect-[4/3] bg-gray-100 h-75">
                                <Image
                                    src={`/${product.image}`}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <CardContent className="p-6">
                                <div className='flex justify-between items-center mb-3'>
                                    <div className='text-xs bg-[#FEF9C3] text-[#CA8A04] rounded-full py-1 px-3 flex items-center'>
                                        <p>{product.tag}</p>
                                    </div>
                                    <div className="flex">
                                        <Star className="h-5 w-5 text-solid fill-solid" />
                                        <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                                        <span className="text-sm text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>

                                <p className="text-gray-600 mb-4">{product.description}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                                    <Button 
                                        variant="default" 
                                        className="text-black"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent card click firing
                                            router.push(`/bikes/${product.id}`);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
