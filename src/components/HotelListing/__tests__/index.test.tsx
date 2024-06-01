import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import HotelListing from "..";
import { Hotel } from "../../../types";

describe("Hotel Listing", () => {
  afterEach(() => {
    cleanup();
  });

  describe("When got reviews", () => {
    const hotels: Hotel[] = [
      {
        id: 1,
        name: "Hotel One",
        address: "Address of hotel one lorem ipsum",
        rating: 8,
        stars: 4,
        price: 123,
        photo: "",
        description: "Hotel One is located at lorem ipsum",
        reviews: [
          {
            user: { name: "Test", location: "Tokyo" },
            rating: 4,
            title: "Bad",
            description: "",
          },
        ],
      },
      {
        id: 2,
        name: "Hotel Two",
        address: "Address of hotel two lorem ipsum",
        rating: 7,
        stars: 4,
        price: 120,
        photo: "",
        description: "Hotel Two is located at lorem ipsum",
        reviews: [
          {
            user: { name: "Test", location: "Tokyo" },
            rating: 4,
            title: "Bad",
            description: "",
          },
        ],
      },
    ];

    it("should trigger showReview on click of review", async () => {
      const fn = vi.fn();

      render(<HotelListing hotels={hotels} showReview={fn} />);

      const el = (await screen.findAllByTestId("see-review-btn"))[1];
      el.click();

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(hotels[1]);
    });
  });

  describe("When no reviews", () => {
    const hotels: Hotel[] = [
      {
        id: 1,
        name: "Hotel One",
        address: "Address of hotel one lorem ipsum",
        rating: 8,
        stars: 4,
        price: 123,
        photo: "",
        description: "Hotel One is located at lorem ipsum",
      },
      {
        id: 2,
        name: "Hotel Two",
        address: "Address of hotel two lorem ipsum",
        rating: 7,
        stars: 4,
        price: 120,
        photo: "",
        description: "Hotel Two is located at lorem ipsum",
      },
    ];

    it("should NOT trigger showReview on click of review", async () => {
      const fn = vi.fn();

      render(<HotelListing hotels={hotels} showReview={fn} />);

      const el = (await screen.findAllByTestId("see-review-btn"))[0];
      el.click();

      expect(fn).not.toHaveBeenCalled();
    });
  });
});
