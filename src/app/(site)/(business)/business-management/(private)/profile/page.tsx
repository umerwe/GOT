import BusinessHeader from "@/components/business-header";
import Container from "@/components/container";
import BusinessProfileForm from "@/components/forms/business-profile-form";

export default function BusinessProfilePage() {
  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <BusinessHeader
            title="Business Profile"
            description="Update business information, contacts, and payout details"
          />
          <BusinessProfileForm />
        </div>
      </Container>
    </div>
  );
}