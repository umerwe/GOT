import { Mountain } from "lucide-react";
import { FaWrench } from "react-icons/fa";
import { PiMapPinAreaFill } from "react-icons/pi";

const features = [
  {
    icon: <FaWrench size={14} className="text-white" />,
    title: "Performance Upgrade",
    description: "Acrapovic full exhaust system included.",
  },
  {
    icon: <Mountain size={14} className="text-white" fill="white" />,
    title: "Adventure-Ready Setup",
    description: "Touratech suspension, SW Motech bags.",
  },
  {
    icon: <PiMapPinAreaFill  size={14} className="text-white" />,
    title: "Modern Navigation & Safety -",
    description: "Montana 700i GPS with inReach",
  },
];

export default function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-[20px] bg-[#F3F4F6]">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* Icon Circle */}
          <div className="flex-shrink-0 w-[34px] h-[34px] bg-black rounded-full flex items-center justify-center">
            {feature.icon}
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col gap-[4px]">
            <h1 className="text-lg font-medium text-black leading-tight">
              {feature.title}
            </h1>
            <p className="text-sm text-gray-600">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}