import dynamic from "next/dynamic";
const SelskaberOccasionTabs = dynamic(() => import("@/components/SelskaberOccasionTabs"));

interface SelskaberOccasionsProps {
  occasions?: any[];
}

export default function SelskaberOccasions({ occasions }: SelskaberOccasionsProps) {
  const list = occasions || [];
  if (list.length === 0) return null;
  return <SelskaberOccasionTabs occasions={list} />;
}
