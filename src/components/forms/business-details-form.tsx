"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailsSchema, type BusinessDetailsValues } from "@/validations/business";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterBusiness } from "@/hooks/useBusiness";
import { BusinessLocationInput } from "../business-location-input";

export function BusinessDetailsForm() {
    const { mutate, isPending } = useRegisterBusiness();

    const {
        register,
        handleSubmit,
        setValue, // Needed for the map component
        formState: { errors },
    } = useForm<BusinessDetailsValues>({
        resolver: zodResolver(businessDetailsSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            password: "",
            address: "",
            latitude: 33.6844,
            longitude: 73.0479,
        },
    });

    const onSubmit = (data: BusinessDetailsValues) => {
        mutate(data);
    };

    return (
        <div className="w-full bg-white p-6">
            <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900">Business details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Input id="first_name" label="First Name" {...register("first_name")} error={errors.first_name?.message} />
                    <Input id="last_name" label="Last Name" {...register("last_name")} error={errors.last_name?.message} />
                    <Input id="phone" label="Phone" {...register("phone")} error={errors.phone?.message} />
                    <Input id="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />
                    <Input id="password" label="Password" type="password" {...register("password")} error={errors.password?.message} />
                    
                    {/* The Map Component replaces the old Address Input */}
                    <div className="md:col-span-2">
                        <BusinessLocationInput
                            setValue={setValue} 
                            errors={errors} 
                            isPending={isPending} 
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="font-semibold h-[42px]" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}