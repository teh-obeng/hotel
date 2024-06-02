import { Hotel } from "../../types";
import HotelCard from "../HotelCard";

interface Props {
  hotels: Array<Hotel>;
  showReview: (hotel: Hotel) => void
}

function HotelListing({ hotels, showReview }: Props) {
  return (
    <div data-testid="hotel-listing">
      <div className="flex flex-col gap-4">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onReviewClick={showReview} />
        ))}
      </div>
    </div>
  );
}

export default HotelListing;
