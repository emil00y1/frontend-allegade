import dynamic from "next/dynamic";
const SelskaberInquiryForm = dynamic(() => import("@/components/SelskaberInquiryForm"));

interface SelskaberFormProps {
  formHeading?: string;
  formDescription?: string;
  formPhone?: string;
  formEmail?: string;
  occasionOptions?: string[];
  occasionLabels?: string[];
  nameLabel?: string;
  emailLabel?: string;
  occasionLabel?: string;
  guestCountLabel?: string;
  dateLabel?: string;
  messageLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  occasionPlaceholder?: string;
  guestCountPlaceholder?: string;
  messagePlaceholder?: string;
  nameRequiredMessage?: string;
  emailRequiredMessage?: string;
  emailInvalidMessage?: string;
  messageRequiredMessage?: string;
  genericErrorMessage?: string;
  networkErrorMessage?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successEyebrow?: string;
  successHeading?: string;
  successBody?: string;
}

export default function SelskaberForm({
  formHeading,
  formDescription,
  formPhone,
  formEmail,
  occasionOptions,
  occasionLabels,
  ...rest
}: SelskaberFormProps) {
  const resolvedOccasions =
    occasionOptions && occasionOptions.length > 0 ? occasionOptions : occasionLabels;
  return (
    <SelskaberInquiryForm
      heading={formHeading}
      description={formDescription}
      phone={formPhone}
      email={formEmail}
      occasionOptions={resolvedOccasions}
      {...rest}
    />
  );
}
