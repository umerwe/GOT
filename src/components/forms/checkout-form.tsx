"use client";

import { CreditCard, Landmark, ChevronDown, AlertCircle } from "lucide-react";
import { Label } from "../ui/label";
import { CiCreditCard1 } from "react-icons/ci";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IoCard } from "react-icons/io5";
import { StripeElementChangeEvent } from "@stripe/stripe-js"; // Import this type

// 1. Define Zod Schema
const paymentSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits"),
});

type PaymentValues = z.infer<typeof paymentSchema>;

export default function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [cardBrand, setCardBrand] = useState<string>("unknown");
  const [stripeErrors, setStripeErrors] = useState<{ [key: string]: string }>({});

  // 2. Initialize React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      email: "",
      phone: "",
      postalCode: "",
    },
  });

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#4b5563",
        fontFamily: "inherit",
        "::placeholder": { color: "#6b7280" },
      },
      invalid: { color: "#ef4444" },
    },
  };

  const handleStripeChange = (
    event: StripeElementChangeEvent, 
    fieldName: string
  ) => {
    setStripeErrors((prev) => ({
      ...prev,
      [fieldName]: event.error ? event.error.message : "",
    }));
  };

  const onSubmit = async (values: PaymentValues) => {
    if (!stripe || !elements) return;

    // Check if Stripe elements have errors before proceeding
    if (Object.values(stripeErrors).some((msg) => msg !== "")) return;

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)!,
      billing_details: {
        email: values.email,
        phone: values.phone,
        address: { postal_code: values.postalCode }
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push(`/success?tid=${paymentMethod.id}`);
    }
  };

  return (
    <div className="border border-gray-200 p-[30px] bg-white">
      <h2 className="mb-[5px]">Payment</h2>
      <p className="text-gray-500 text-lg mb-[20px] border-b border-gray-900 pb-[20px]">
        Add your payment method details below
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[20px]">
        {/* Method Selection */}
        <div className="flex gap-4 w-full sm:w-[380px]">
          <button type="button" className="flex flex-col gap-2 p-2 border-2 border-[#F2A416] bg-white text-left w-[140px]">
            <IoCard className="text-gray-600" size={24} />
            <span className="font-medium text-[#F2A416]">Card</span>
          </button>
          {/* <button type="button" className="flex-1 flex flex-col gap-2 p-4 border border-gray-200 bg-white text-left hover:border-gray-300 w-[140px]">
            <Landmark className="text-gray-600" size={24} />
            <span className="font-medium text-gray-800">Bank account</span>
          </button> */}
        </div>

        <div className="space-y-[20px]">
          {/* Card Number */}
          <div className="space-y-[10px]">
            <Label className={stripeErrors.cardNumber ? "text-red-500" : ""}>Card number</Label>
            <div className={cn(
              "relative border h-[54px] px-4 flex items-center transition-colors",
              stripeErrors.cardNumber ? "border-red-500" : "border-gray-300 focus-within:border-gray-900"
            )}>
              <div className="w-full">
                <CardNumberElement 
                  options={elementOptions} 
                  onChange={(e) => handleStripeChange(e, 'cardNumber')} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[10px]">
              <Label className={stripeErrors.cardExpiry ? "text-red-500" : ""}>Expiration date</Label>
              <div className={cn("w-full h-[54px] px-4 border flex items-center", stripeErrors.cardExpiry ? "border-red-500" : "border-gray-300 focus-within:border-gray-900")}>
                <CardExpiryElement options={elementOptions} onChange={(e) => handleStripeChange(e, 'cardExpiry')} className="w-full" />
              </div>
            </div>
            <div className="space-y-[10px]">
              <Label className={stripeErrors.cardCvc ? "text-red-500" : ""}>Security code</Label>
              <div className={cn("relative border h-[54px] px-4 flex items-center", stripeErrors.cardCvc ? "border-red-500" : "border-gray-300 focus-within:border-gray-900")}>
                <div className="w-full">
                  <CardCvcElement options={elementOptions} onChange={(e) => handleStripeChange(e, 'cardCvc')} className="w-full" />
                </div>
                <CiCreditCard1 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={28} />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#F2A416]" />
            <span className="text-gray-700 font-medium text-sm">Save my information for faster checkout</span>
          </label>

          {/* Email with Zod Validation */}
          <div className="space-y-1">
            <input
              {...register("email")}
              placeholder="email@example.com"
              className={cn(
                "w-full h-[54px] px-4 border font-medium focus:outline-none transition-colors",
                errors.email ? "border-red-500" : "border-gray-300 focus:border-gray-900 text-gray-600"
              )}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          {/* Phone with Zod Validation */}
          <div className="space-y-1">
            <div className={cn("relative flex items-center border h-[54px]", errors.phone ? "border-red-500" : "border-gray-300 focus-within:border-gray-900")}>
              <div className="flex items-center gap-2 px-4 border-r border-gray-200 h-full bg-white">
                <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
                  <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10" />
                  <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]" />
                  <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white" />
                  <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                {...register("phone")}
                className="flex-1 px-4 focus:outline-none h-full text-gray-600 font-medium" 
                placeholder="+971 585300320" 
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            By selecting to save your info, you agree to create an account subject to Link&apos;s Terms and Privacy Policy.
          </p>

          <div className="grid grid-cols-[1.8fr_1fr] gap-4">
            <div className="space-y-[10px]">
              <Label>Country</Label>
              <div className="relative">
                <select className="w-full h-[54px] px-4 border border-gray-300 appearance-none bg-white focus:outline-none focus:border-gray-900">
                  <option>United Arab Emirates</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-[10px]">
              <Label className={errors.postalCode ? "text-red-500" : ""}>Postal Code</Label>
              <input
                {...register("postalCode")}
                placeholder="00000"
                className={cn("w-full h-[54px] px-4 border focus:outline-none", errors.postalCode ? "border-red-500" : "border-gray-300 focus:border-gray-900")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full h-[64px] bg-[#F2A416] hover:bg-[#D99314] text-gray-900 font-semibold text-sm mt-4 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> : "Confirm payment"}
          </button>
        </div>
      </form>
    </div>
  );
}