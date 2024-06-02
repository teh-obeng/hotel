import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import HotelCard from "..";
import { Hotel } from "../../../types";

describe("HotelCard", () => {
  afterEach(() => {
    cleanup();
  });

  describe("When got reviews", () => {
    const hotel: Hotel = {
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
    };

    it("should trigger onReviewClick on click of reviews", async () => {
      const fn = vi.fn();

      render(<HotelCard hotel={hotel} onReviewClick={fn} />);

      const el = await screen.findByTestId("see-review-btn");
      el.click();

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(hotel);
    });

    it("should show See Reviews text", async () => {
      render(<HotelCard hotel={hotel} onReviewClick={() => {}} />);

      const text = await screen.findByText("8 | See Reviews (1)");
      expect(text).toBeVisible();
    });
  });

  describe("When no reviews", () => {
    const hotel: Hotel = {
      id: 1,
      name: "Hotel One",
      address: "Address of hotel one lorem ipsum",
      rating: 8,
      stars: 4,
      price: 123,
      photo: "",
      description: "Hotel One is located at lorem ipsum",
    };

    it("should NOT trigger onReviewClick on click of reviews", async () => {
      const fn = vi.fn();

      render(<HotelCard hotel={hotel} onReviewClick={fn} />);

      const el = await screen.findByTestId("see-review-btn");
      el.click();

      expect(fn).not.toHaveBeenCalled();
    });

    it("should NOT show See Reviews text", async () => {
      render(<HotelCard hotel={hotel} onReviewClick={() => {}} />);

      const text = await screen.queryByText(/See Reviews/);

      expect(text).toBe(null);
    });
  });
});
