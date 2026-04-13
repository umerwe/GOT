"use client";

import { ChevronDown } from "lucide-react";
import { Label } from "../ui/label";
import { CiCreditCard1 } from "react-icons/ci";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IoCard } from "react-icons/io5";
import { StripeElementChangeEvent } from "@stripe/stripe-js";

const paymentSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits"),
});

type PaymentValues = z.infer<typeof paymentSchema>;

type StripeFieldState = {
  error: string;
  empty: boolean;
  complete: boolean;
};

const STRIPE_FIELD_ERRORS: Record<string, string> = {
  cardNumber: "Please enter your card number",
  cardExpiry: "Please enter an expiry date",
  cardCvc: "Please enter your security code",
};

export default function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // ── KEY FIX: track empty + complete + error per Stripe field ──
  const [stripeFields, setStripeFields] = useState<Record<string, StripeFieldState>>({
    cardNumber: { error: "", empty: true, complete: false },
    cardExpiry: { error: "", empty: true, complete: false },
    cardCvc: { error: "", empty: true, complete: false },
  });

  // Whether the user attempted submit (triggers empty-field errors)
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { email: "", phone: "", postalCode: "" },
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

  const handleStripeChange = (event: StripeElementChangeEvent, field: string) => {
    setStripeFields((prev) => ({
      ...prev,
      [field]: {
        error: event.error?.message ?? "",
        empty: event.empty,
        complete: event.complete,
      },
    }));
  };

  // Returns the error message to display for a stripe field
  const getStripeError = (field: string): string => {
    const f = stripeFields[field];
    if (!submitted && !f.error) return ""; // don't show errors before first submit attempt
    if (f.empty) return STRIPE_FIELD_ERRORS[field]; // empty after submit → show required msg
    if (f.error) return f.error;                    // Stripe returned a validation error
    return "";
  };

  const onSubmit = async (values: PaymentValues) => {
    if (!stripe || !elements) return;

    setSubmitted(true); // ← this triggers empty-field error display

    // Check all stripe fields are complete
    const allComplete = Object.values(stripeFields).every((f) => f.complete);
    if (!allComplete) return;

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement)!,
      billing_details: {
        email: values.email,
        phone: values.phone,
        address: { postal_code: values.postalCode },
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true); // ← fires ALWAYS, before Zod even runs
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-[20px]"
      >
        {/* Method Selection */}
        <div className="flex gap-4 w-full sm:w-[380px]">
          <button
            type="button"
            className="flex flex-col gap-2 p-2 border-2 border-[#F2A416] bg-white text-left w-[140px]"
          >
            <IoCard className="text-gray-600" size={24} />
            <span className="font-medium text-[#F2A416]">Card</span>
          </button>
        </div>

        <div className="space-y-[20px]">
          {/* Card Number */}
          <div className="space-y-[6px]">
            <Label className={getStripeError("cardNumber") ? "text-red-500" : ""}>
              Card number
            </Label>
            <div
              className={cn(
                "relative border h-[54px] px-4 flex items-center transition-colors",
                getStripeError("cardNumber")
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-gray-900"
              )}
            >
              <div className="w-full">
                <CardNumberElement
                  options={elementOptions}
                  onChange={(e) => handleStripeChange(e, "cardNumber")}
                />
              </div>
            </div>
            {getStripeError("cardNumber") && (
              <p className="text-red-500 text-xs mt-1">{getStripeError("cardNumber")}</p>
            )}
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[6px]">
              <Label className={getStripeError("cardExpiry") ? "text-red-500" : ""}>
                Expiration date
              </Label>
              <div
                className={cn(
                  "w-full h-[54px] px-4 border flex items-center",
                  getStripeError("cardExpiry")
                    ? "border-red-500"
                    : "border-gray-300 focus-within:border-gray-900"
                )}
              >
                <CardExpiryElement
                  options={elementOptions}
                  onChange={(e) => handleStripeChange(e, "cardExpiry")}
                  className="w-full"
                />
              </div>
              {getStripeError("cardExpiry") && (
                <p className="text-red-500 text-xs mt-1">{getStripeError("cardExpiry")}</p>
              )}
            </div>

            <div className="space-y-[6px]">
              <Label className={getStripeError("cardCvc") ? "text-red-500" : ""}>
                Security code
              </Label>
              <div
                className={cn(
                  "relative border h-[54px] px-4 flex items-center",
                  getStripeError("cardCvc")
                    ? "border-red-500"
                    : "border-gray-300 focus-within:border-gray-900"
                )}
              >
                <div className="w-full">
                  <CardCvcElement
                    options={elementOptions}
                    onChange={(e) => handleStripeChange(e, "cardCvc")}
                    className="w-full"
                  />
                </div>
                <CiCreditCard1
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={28}
                />
              </div>
              {getStripeError("cardCvc") && (
                <p className="text-red-500 text-xs mt-1">{getStripeError("cardCvc")}</p>
              )}
            </div>
          </div>

          {/* Save checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#F2A416]" />
            <span className="text-gray-700 font-medium text-sm">
              Save my information for faster checkout
            </span>
          </label>

          {/* Email */}
          <div className="space-y-1">
            <input
              {...register("email")}
              placeholder="email@example.com"
              className={cn(
                "w-full h-[54px] px-4 border font-medium focus:outline-none transition-colors",
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-gray-900 text-gray-600"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <div
              className={cn(
                "relative flex items-center border h-[54px]",
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-gray-900"
              )}
            >
              <div className="flex items-center gap-2 px-4 border-r border-gray-200 h-full bg-white">
                <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
                  <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10" />
                  <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]" />
                  <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white" />
                  <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black" />
                </div>
              </div>
              <input
                {...register("phone")}
                className="flex-1 px-4 focus:outline-none h-full text-gray-600 font-medium"
                placeholder="+971 585300320"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            By selecting to save your info, you agree to create an account
            subject to Link&apos;s Terms and Privacy Policy.
          </p>

          {/* Country + Postal */}
          <div className="grid grid-cols-[1.8fr_1fr] gap-4">
            <div className="space-y-[10px]">
              <Label>Country</Label>
              <div className="relative">
                <select className="w-full h-[54px] px-4 border border-gray-300 appearance-none bg-white focus:outline-none focus:border-gray-900">
                  <option>United Arab Emirates</option>
                </select>
                {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div> */}
              </div>
            </div>

            <div className="space-y-[10px]">
              <Label className={errors.postalCode ? "text-red-500" : ""}>
                Postal Code
              </Label>
              <input
                {...register("postalCode")}
                placeholder="00000"
                className={cn(
                  "w-full h-[54px] px-4 border focus:outline-none",
                  errors.postalCode
                    ? "border-red-500"
                    : "border-gray-300 focus:border-gray-900"
                )}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full h-[64px] bg-[#F2A416] hover:bg-[#D99314] text-gray-900 font-semibold text-sm mt-4 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Confirm payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}