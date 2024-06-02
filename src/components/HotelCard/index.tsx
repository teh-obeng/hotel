import { Hotel } from "../../types";

interface Props {
  hotel: Hotel;
  onReviewClick: (hotel: Hotel) => void;
}

function HotelCard({ hotel, onReviewClick }: Props) {
  const hasReview = hotel.reviews && hotel.reviews.length > 0;

  function onClick() {
    hasReview && onReviewClick(hotel);
  }

  return (
    <div className="flex bg-white rounded-lg overflow-hidden hover:border-blue-500 border border-gray-200" data-testid="hotel-card">
      <div className="basis-1/3">
        <img className="w-full h-[182px] object-cover" src={hotel.photo} />
      </div>
      <div className="p-4 basis-2/3 flex flex-col w-full">
        <h3>{hotel.name}</h3>
        <p className="text-sm">{hotel.stars} stars</p>
        <p className="text-xs text-gray-400">{hotel.address}</p>
        <div className="flex flex-col mt-auto self-end font-thin">
          <div
            data-testid="see-review-btn"
            onClick={onClick}
            className={`${
              hotel.rating > 7 ? "bg-blue-500" : "bg-yellow-500"
            } text-white rounded-md px-2 text-center ${
              hasReview ? "hover:cursor-pointer" : ""
            }`}
          >
            {hotel.rating}
            {hasReview ? ` | See Reviews (${hotel.reviews!.length})` : ""}
          </div>
          <div className="ml-2 text-right">
            $<span className="font-medium">{hotel.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
