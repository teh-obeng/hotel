import { useEffect, useState } from "react";

import HotelListing from "./components/HotelListing";
import { Hotel } from "./types";
import HotelFilter, { FilterSortParam } from "./components/HotelFilter";
import { HotelSortOption } from "./components/HotelSort";
import HotelReview from "./components/HotelReview";

function App() {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [hotelReview, setHotelReview] = useState<Hotel | null>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        "https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/en"
      );
      const body = await resp.json();

      setHotels(body as Hotel[]);
      setFilteredHotels(body as Hotel[]);

      setLoading(false);
    })();
  }, []);

  function onFilterSort(param: FilterSortParam) {
    let result = hotels;

    if (param.name && param.name.trim()) {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().indexOf(param.name!.trim().toLowerCase()) > -1
      );
    }

    if (param.starRatings && param.starRatings.length) {
      result = result.filter((h) => param.starRatings!.includes(h.stars));
    }

    if (param.price) {
      result = result.filter(
        (h) => param.price!.min <= h.price && h.price <= param.price!.max
      );
    }

    if (param.reviewRatings && param.reviewRatings.length) {
      result = result.filter((h) =>
        param.reviewRatings?.some((r) => h.rating >= r)
      );
    }

    if (param.sort) {
      result.sort((a, b) => {
        if (param.sort === HotelSortOption.LOWEST) {
          return a.price - b.price;
        } else if (param.sort === HotelSortOption.HIGHEST) {
          return b.price - a.price;
        } else {
          // Do nothing for RECOMMENDED sort, assume it is best order returned from server
          return 0;
        }
      });
    }

    setFilteredHotels([...result]);
  }

  function showModal(hotel: Hotel) {
    setHotelReview(hotel);
  }

  function closeModal() {
    setHotelReview(null);
  }

  return (
    <main className="container gap-10 relative mx-auto bg-gray-100 min-h-screen p-10">
      {loading ? (
        <h1>Loading hotel, please wait...</h1>
      ) : (
        <>
          <div className="flex">
            <div className="basis-1/3">
              <HotelFilter hotels={hotels} onFilterSort={onFilterSort} />
            </div>
            <div className="basis-2/3 shrink-0">
              {filteredHotels.length ? (
                <HotelListing hotels={filteredHotels} showReview={showModal} />
              ) : (
                <div>
                  No hotels found by your search criteria, consider reset your
                  filter.
                </div>
              )}
            </div>
          </div>
          {hotelReview && (
            <HotelReview hotel={hotelReview} onClose={closeModal} />
          )}
        </>
      )}
    </main>
  );
}

export default App;
