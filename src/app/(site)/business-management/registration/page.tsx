import BusinessHeader from "@/components/business/business-header";
import Container from "@/components/container";
import { BusinessDetailsForm } from "@/components/forms/business-details-form";

export default function BusinessSetupPage() {
  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <BusinessHeader
            title="Register your business"
            description="Create your seller account to list motorcycles, gear, and services in Dubai."
          />
          <BusinessDetailsForm />
        </div>
      </Container>
    </div>
  );
}