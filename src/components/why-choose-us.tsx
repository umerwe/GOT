import { ShieldCheck, UserRoundCheck, MessagesSquare } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-[#CA8A04]" />,
            title: "Secure Transactions",
            description: "Our secure payment system ensures your money is safe until you receive your item.",
        },
        {
            icon: <UserRoundCheck className="w-8 h-8 text-[#CA8A04]" />,
            title: "Verified Sellers",
            description: "Every seller is verified to ensure authenticity and quality of listed items.",
        },
        {
            icon: <MessagesSquare className="w-8 h-8 text-[#CA8A04]" />,
            title: "Direct Chat Support",
            description: "Connect directly with sellers to ask questions or negotiate prices.",
        },
    ];

    return (
        <section className="px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Why Choose Get Out There?
                </h1>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="mb-4 w-19 h-19 rounded-full bg-[#FEF9C3] flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}