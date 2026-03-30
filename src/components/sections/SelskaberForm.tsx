import dynamic from "next/dynamic";
const SelskaberInquiryForm = dynamic(() => import("@/components/SelskaberInquiryForm"));

interface SelskaberFormProps {
  formHeading?: string;
  formDescription?: string;
  formPhone?: string;
  formEmail?: string;
  occasionLabels?: string[];
}

export default function SelskaberForm({
  formHeading,
  formDescription,
  formPhone,
  formEmail,
  occasionLabels,
}: SelskaberFormProps) {
  return (
    <SelskaberInquiryForm
      heading={formHeading}
      description={formDescription}
      phone={formPhone}
      email={formEmail}
      occasionOptions={occasionLabels}
    />
  );
}
