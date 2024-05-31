import { useEffect, useRef, useState } from "react";
import CloseIcon from "../../icons/close";
import { Hotel, Review } from "../../types";

interface Props {
  hotel: Hotel;
  onClose: () => void;
}

function HotelReview({ hotel, onClose }: Props) {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(
    hotel.reviews || []
  );
  const [keyword, setKeyword] = useState("");
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "15px";

    return () => {
      document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const reviews = hotel.reviews || [];
    setFilteredReviews(
      reviews.filter((r) => {
        return (
          r.user.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
          r.user.location.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
          r.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
          r.description.toLowerCase().indexOf(keyword.toLowerCase()) > -1
        );
      })
    );
  }, [keyword, hotel]);

  return (
    <div
      className="fixed inset-0 px-10 z-[9999] bg-gray-200/50 h-screen"
      ref={container}
      onClick={(e) => e.target === container.current && onClose()}
    >
      <div className="container mx-auto bg-white xl:max-w-[50%] p-4 flex flex-col h-full">
        <button type="button" onClick={onClose} className="w-fit self-end">
          <CloseIcon />
        </button>
        <h1 className="font-bold text-lg">{hotel.name}'s Reviews</h1>
        <div>Search Review:</div>
        <div className="flex flex-row gap-2 align-center mb-4">
          <input
            type="text"
            className="border border-gray-400 rounded px-2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          ></input>
          <button
            type="button"
            className="btn bg-red-500 text-white px-2 p-1 rounded"
            onClick={() => setKeyword("")}
          >
            Clear
          </button>
        </div>
        <div className="overflow-y-auto">
          {filteredReviews.map((r, i) => (
            <div key={i} className="my-4 border p-4 rounded">
              <h1 className="text-lg">{r.user.name}</h1>
              <h3 className="text-gray-400 text-sm">{r.user.location}</h3>
              <h2 className="font-bold">{r.title}</h2>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HotelReview;
