import { useMemo, useState } from "react";
import { Hotel } from "../../types";
import MultiRangeSlider from "../MultiRangeSlider";
import HotelSort, { HotelSortOption } from "../HotelSort";

export interface FilterSortParam {
  name?: string;
  starRatings?: number[];
  price?: { min: number; max: number };
  reviewRatings?: number[];
  sort?: HotelSortOption;
}

interface Props {
  hotels: Hotel[];
  onFilterSort: (params: FilterSortParam) => void;
}

function HotelFilter({ hotels, onFilterSort }: Props) {
  const { prices, starRatings, reviewRatings } = useMemo(() => {
    const prices = hotels.map((h) => h.price);
    const starRatings = new Set(hotels.map((h) => h.stars));
    const reviewRatings = new Set(hotels.map((h) => Math.floor(h.rating)));

    return { prices, starRatings, reviewRatings };
  }, [hotels]);

  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: Math.min(...prices),
    max: Math.max(...prices),
  });
  const [stars, setStars] = useState<number[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);
  const [sort, setSort] = useState<HotelSortOption | undefined>();

  function generateStars() {
    const views = [];
    for (const star of starRatings) {
      views.push(
        <div key={star}>
          <label htmlFor={`${star}-stars`} className="hover:cursor-pointer">
            <input
              checked={stars.includes(star)}
              onChange={(e) => updateStar(star, e.target.checked)}
              type="checkbox"
              id={`${star}-stars`}
              value={star}
            />
            <span className="text-sm">&nbsp;{star} stars</span>
          </label>
        </div>
      );
    }

    return <div>{views}</div>;
  }

  function generateReviewRatings() {
    const views = [];
    for (const rating of reviewRatings) {
      views.push(
        <div key={rating}>
          <label htmlFor={`${rating}-ratings`} className="hover:cursor-pointer">
            <input
              checked={ratings.includes(rating)}
              onChange={(e) => updateRating(rating, e.target.checked)}
              type="checkbox"
              id={`${rating}-ratings`}
              value={rating}
            />
            <span className="text-sm">&nbsp;{rating}+ ratings</span>
          </label>
        </div>
      );
    }

    return <div>{views}</div>;
  }

  function updateParam() {
    onFilterSort({
      name: keyword,
      price: priceRange,
      starRatings: stars,
      reviewRatings: ratings,
      sort,
    });
  }

  function resetParam() {
    setKeyword("");
    setPriceRange({
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
    setStars([]);
    setRatings([]);
    setSort(HotelSortOption.RECOMMENDED);
    onFilterSort({});
  }

  function updatePriceRange(min: number, max: number) {
    setPriceRange({ min, max });
  }

  function updateStar(star: number, isChecked: boolean) {
    if (isChecked) {
      setStars([...stars, star]);
    } else {
      setStars(stars.filter((s) => s !== star));
    }
  }

  function updateRating(rating: number, isChecked: boolean) {
    if (isChecked) {
      setRatings([...ratings, rating]);
    } else {
      setRatings(ratings.filter((r) => r !== rating));
    }
  }

  function updateSort(sort: HotelSortOption) {
    setSort(sort);
  }

  return (
    <div className="w-fit py-4 px-10 bg-white rounded-lg mx-auto" data-testid="hotel-filter">
      <h1 className="font-bold">Filter</h1>
      <div>
        <h1>Name</h1>
        <input
          data-testid="keyword-filter-input"
          className="border border-gray-300 rounded px-2"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <br />
      <div>
        <h1>Star Rating</h1>
        <div>{generateStars()}</div>
      </div>
      <br />
      <div>
        <h1>Price</h1>
        <div>
          <MultiRangeSlider
            onChange={updatePriceRange}
            valPrefix="$"
            current={priceRange}
            min={Math.min(...prices)}
            max={Math.max(...prices)}
          />
        </div>
      </div>
      <br />
      <div>
        <h1>Review Rating</h1>
        <div>{generateReviewRatings()}</div>
      </div>
      <br />
      <HotelSort onChange={updateSort} sort={sort} />
      <br />
      <div className="flex gap-2">
        <button
          type="button"
          className="btn bg-red-500 text-white rounded-lg py-2 px-4 text-sm mt-4"
          onClick={resetParam}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn bg-blue-500 text-white rounded-lg py-2 px-4 text-sm mt-4"
          onClick={updateParam}
        >
          Find
        </button>
      </div>
    </div>
  );
}

export default HotelFilter;
