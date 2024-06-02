import { FilterSortParam } from "../components/HotelFilter";
import { Hotel, HotelSortOption } from "../types";

/**
 * Filter hotels by param
 *
 * `filter` function will assure no mutation on `hotels` object. When Array.prototype.filter is called it will return new array.
 *
 * @param hotels
 * @param param
 * @returns Hotel[]
 */
export function filterHotels(hotels: Hotel[], param: FilterSortParam): Hotel[] {
  let result = hotels;

  if (param.name && param.name.trim()) {
    result = result.filter(
      (h) => h.name.toLowerCase().indexOf(param.name!.trim().toLowerCase()) > -1
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

  return result;
}

/**
 *
 * Spread the hotels array before sort to prevent mutation on hotels object.
 *
 * @param hotels
 * @param param
 * @returns Hotel[]
 */
export function sortHotelsByPrice(
  hotels: Hotel[],
  param: FilterSortParam
): Hotel[] {
  return [...hotels].sort((a, b) => {
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

/**
 * 
 * Filter first then sort
 * 
 * @param hotels 
 * @param param 
 * @returns Hotel[]
 */
export function filterAndSortHotels(
  hotels: Hotel[],
  param: FilterSortParam
): Hotel[] {
  const result = filterHotels(hotels, param);
  return sortHotelsByPrice(result, param);
}
