import { HotelSortOption } from "../../types";

export interface Props {
  sort?: HotelSortOption;
  onChange: (sort: HotelSortOption) => void;
}

function HotelSort({ onChange, sort }: Props) {
  return (
    <div className="my-2">
      <h3 className="font-bold">Sort By:</h3>
      <div className="flex flex-col flex-wrap">
        <label htmlFor="lowest-sort">
          <input
            type="radio"
            id="lowest-sort"
            name="sort"
            data-testid="lowest-sort"
            onChange={() => onChange(HotelSortOption.LOWEST)}
            checked={sort === HotelSortOption.LOWEST}
          ></input>
          <span>&nbsp;Lowest Price</span>
        </label>
        <label htmlFor="highest-sort">
          <input
            type="radio"
            id="highest-sort"
            name="sort"
            data-testid="highest-sort"
            onChange={() => onChange(HotelSortOption.HIGHEST)}
            checked={sort === HotelSortOption.HIGHEST}
          ></input>
          <span>&nbsp;Highest Price</span>
        </label>
        <label htmlFor="recommended-sort">
          <input
            type="radio"
            id="recommended-sort"
            name="sort"
            data-testid="recommended-sort"
            onChange={() => onChange(HotelSortOption.RECOMMENDED)}
            checked={sort === HotelSortOption.RECOMMENDED || !sort}
          ></input>
          <span>&nbsp;Recommended</span>
        </label>
      </div>
    </div>
  );
}

export default HotelSort;
