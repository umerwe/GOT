import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const RecentlyViewed = () => {
    const items = [
        { id: 1, name: 'Mountain Bike', price: '$850', image: 'rv-1.png' },
        { id: 2, name: 'Road Bike', price: '$850', image: 'rv-2.png' },
        { id: 3, name: 'Cycling Helmet', price: '$850', image: 'rv-3.png' },
        { id: 4, name: 'Bike Light Set', price: '$850', image: 'rv-4.png' },
        { id: 5, name: 'Cycling Gloves', price: '$850', image: 'rv-5.png' },
        { id: 6, name: 'Bike Water Bottle', price: '$850', image: 'rv-6.png' },
    ];

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
                    <Link href="#" className="flex items-center text-sm font-medium text-[#CA8A04] hover:text-dark">
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} className="border-0 shadow-sm transition-shadow">
                            <CardContent className="p-0">
                                <div className="relative h-30 bg-gray-100 rounded-t-lg overflow-hidden">
                                    <Image
                                        src={`/${item.image}`}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className='p-3'>
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                    <p className="text-sm font-semibold text-[#CA8A04]">{item.price}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewed;