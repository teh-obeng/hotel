import { useMemo, useState } from "react";
import { Hotel, HotelSortOption } from "../../types";
import MultiRangeSlider from "../MultiRangeSlider";
import HotelSort from "../HotelSort";

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

  const generateCheckboxes = (
    items: number[] | Set<number>,
    selectedItems: number[],
    update: (item: number, isChecked: boolean) => void,
    labelSuffix: string
  ) => {
    return Array.from(items).map((item) => (
      <div key={`${item}-${labelSuffix}`}>
        <label
          htmlFor={`${item}-${labelSuffix}`}
          className="hover:cursor-pointer"
        >
          <input
            checked={selectedItems.includes(item)}
            onChange={(e) => update(item, e.target.checked)}
            type="checkbox"
            id={`${item}-${labelSuffix}`}
            value={item}
          />
          <span className="text-sm">
            &nbsp;{item}{labelSuffix}
          </span>
        </label>
      </div>
    ));
  };

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
    <div
      className="w-fit py-4 px-10 bg-white rounded-lg mx-auto"
      data-testid="hotel-filter"
    >
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
        <div>{generateCheckboxes(starRatings, stars, updateStar, " stars")}</div>
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
        <div>{generateCheckboxes(reviewRatings, ratings, updateRating, "+ ratings")}</div>
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
