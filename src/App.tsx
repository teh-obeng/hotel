import { useEffect, useState } from "react";

import HotelListing from "./components/HotelListing";
import { Hotel } from "./types";
import HotelFilter, { FilterSortParam } from "./components/HotelFilter";
import HotelReview from "./components/HotelReview";
import * as filterSortUtils from "./utils/filterSort";
import { useListHotels } from "./hooks/useListHotels";
import { CenterText } from "./components/CenterText";

function App() {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [hotelReview, setHotelReview] = useState<Hotel | null>(null);
  const [loading, error, hotels] = useListHotels();

  useEffect(() => {
    setFilteredHotels(hotels);
  }, [hotels]);

  function onFilterSort(param: FilterSortParam) {
    let result = filterSortUtils.filterHotels(hotels, param);
    result = filterSortUtils.sortHotelsByPrice(result, param);

    setFilteredHotels(result);
  }

  function showModal(hotel: Hotel) {
    setHotelReview(hotel);
  }

  function closeModal() {
    setHotelReview(null);
  }

  return (
    <main className="container flex gap-10 relative mx-auto bg-gray-100 min-h-screen p-10">
      {loading ? (
        <CenterText>Loading hotel, please wait...</CenterText>
      ) : error ? (
        <CenterText>
          Oops, error getting hotel list, please try again later.
        </CenterText>
      ) : (
        <>
          <div className="flex w-full">
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
        </>
      )}
      {hotelReview && <HotelReview hotel={hotelReview} onClose={closeModal} />}
    </main>
  );
}

export default App;
