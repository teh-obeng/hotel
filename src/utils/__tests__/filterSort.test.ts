import { describe, it, expect } from "vitest";

import { filterAndSortHotels, filterHotels, sortHotelsByPrice } from "../filterSort";
import { mockHotelsData } from "../../services/__tests__/data";
import { HotelSortOption } from "../../types";

describe("Filter Sort Utils", () => {
  describe("Filter", () => {
    it("should return same hotels when params are empty", () => {
      const hotels = filterHotels(mockHotelsData, {});

      expect(hotels).toEqual(mockHotelsData);
    });

    it("should return hotels filtered by name with case insensitive", () => {
      const keyword = "prince";
      const hotels = filterHotels(mockHotelsData, { name: keyword });

      expect(hotels).toEqual(
        mockHotelsData.filter(
          (h) => h.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1
        )
      );
    });

    it("should return hotels filtered by star ratings", () => {
      const starRatings = [4, 5];
      const hotels = filterHotels(mockHotelsData, { starRatings });

      expect(hotels).toEqual(
        mockHotelsData.filter((h) => starRatings.includes(h.stars))
      );
    });

    it("should return hotels filtered by review ratings", () => {
      const reviewRatings = [7, 8];
      const hotels = filterHotels(mockHotelsData, { reviewRatings });

      expect(hotels).toEqual(
        mockHotelsData.filter((h) => reviewRatings.some((r) => h.rating >= r))
      );
    });

    it("should return hotels filtered by price", () => {
      const price = { min: 100, max: 200 };
      const hotels = filterHotels(mockHotelsData, { price });

      expect(hotels).toEqual(
        mockHotelsData.filter(
          (h) => price.min <= h.price && h.price <= price.max
        )
      );
    });

    it("should return hotels filtered by all params", () => {
      const hotels = filterHotels(mockHotelsData, {
        name: "tokyo",
        starRatings: [3, 5],
        price: { min: 700, max: 900 },
        reviewRatings: [8, 9],
      });

      expect(hotels).toEqual(
        mockHotelsData.filter((h) => h.id === 2 || h.id === 3)
      );
    });
  });

  describe("Sort", () => {
    it("should return hotels sorted by lowest price", () => {
      const hotels = sortHotelsByPrice(mockHotelsData, {
        sort: HotelSortOption.LOWEST,
      });

      expect(hotels).toEqual(
        [...mockHotelsData].sort((a, b) => a.price - b.price)
      );
    });

    it("should return hotels sorted by highest price", () => {
      const hotels = sortHotelsByPrice(mockHotelsData, {
        sort: HotelSortOption.HIGHEST,
      });

      expect(hotels).toEqual(
        [...mockHotelsData].sort((a, b) => b.price - a.price)
      );
    });

    it("should return hotels sorted by recommended price (order returned by server)", () => {
      const hotels = sortHotelsByPrice(mockHotelsData, {
        sort: HotelSortOption.RECOMMENDED,
      });

      expect(hotels).toEqual(mockHotelsData);
    });
  });

  it("should filter hotels first and then sort the hotels", () => {
    const hotels = filterAndSortHotels(mockHotelsData, {
      name: "tokyo",
      starRatings: [3, 5],
      price: { min: 700, max: 900 },
      reviewRatings: [8, 9],
      sort: HotelSortOption.LOWEST,
    });

    expect(hotels).toEqual(
      mockHotelsData
        .filter((h) => h.id === 2 || h.id === 3)
        .sort((a, b) => a.price - b.price)
    );
  });
});
