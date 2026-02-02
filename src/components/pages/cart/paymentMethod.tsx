// components/PaymentMethods.tsx
import Image from 'next/image';

interface PaymentMethod {
  src: string;
  alt: string;
}

const paymentMethods: PaymentMethod[] = [
  // Row 1
  { src: '/payment/visa.png', alt: 'Visa' },
  { src: '/payment/mastercard.png', alt: 'Mastercard' },
  { src: '/payment/paypal.png', alt: 'PayPal' },
  { src: '/payment/applepay.png', alt: 'Apple Pay' },
  { src: '/payment/emirates.png', alt: 'Emirates NBD' },
  // Row 2 (with empty slots for centering)
  { src: '', alt: '' }, // Empty slot
  { src: '/payment/paytabs.png', alt: 'PayTabs' },
  { src: '/payment/payfort.png', alt: 'PayFort' },
  { src: '/payment/telr.png', alt: 'Telr' },
];

export default function PaymentMethods() {
  return (
    <div className="p-[30px]">
      <div className="grid grid-cols-5 gap-y-6 gap-x-6 place-items-center">
        {paymentMethods.map((method, index) => (
          method.src ? (
            <div key={index} className="w-[44px] h-[14px] relative">
              <Image
                src={method.src}
                alt={method.alt}
                fill
                className="object-contain"
                quality={100}
                sizes="60px"
              />
            </div>
          ) : (
            <div key={index} />
          )
        ))}
      </div>
    </div>
  );
}