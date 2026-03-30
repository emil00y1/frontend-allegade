import dynamic from "next/dynamic";
import { type HotelRoom } from "@/components/RoomCarousel";
const RoomCarousel = dynamic(() => import("@/components/RoomCarousel"));

interface HotelRoomShowcaseProps {
  roomShowcaseHeading?: string;
  rooms?: HotelRoom[];
  bookingCtaUrl?: string;
}

export default function HotelRoomShowcase({
  roomShowcaseHeading,
  rooms = [],
  bookingCtaUrl,
}: HotelRoomShowcaseProps) {
  return (
    <RoomCarousel
      rooms={rooms}
      bookingCtaUrl={bookingCtaUrl}
      sectionHeading={roomShowcaseHeading}
    />
  );
}
