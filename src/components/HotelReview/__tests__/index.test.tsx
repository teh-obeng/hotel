import { afterEach, describe, expect, it, vi } from "vitest";

import { Hotel } from "../../../types";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HotelReview from "..";

describe("Hotel Review", () => {
  afterEach(() => {
    cleanup();
  });

  const hotel: Hotel = {
    id: 1,
    name: "Hotel Ayana",
    address: "Jalan Besar",
    description: "Hotel Ayana lorem ipsum sit dolor amet",
    price: 123,
    stars: 4,
    rating: 8,
    photo: "",
    reviews: [
      {
        user: { name: "User One", location: "Singapore" },
        title: "Awesome",
        description: "Hotel Ayana has awesome hospitality",
        rating: 8,
      },
      {
        user: { name: "User Two", location: "Jakarta, ID" },
        title: "Good",
        description: "Location in downtown area.",
        rating: 9,
      },
    ],
  };

  it("should show reviews", async () => {
    render(<HotelReview hotel={hotel} onClose={() => {}} />);

    const reviews = await screen.getAllByTestId("review");

    expect(reviews[0].textContent).toContain("User One");
    expect(reviews[0].textContent).toContain("Singapore");
    expect(reviews[0].textContent).toContain(
      "Hotel Ayana has awesome hospitality"
    );

    expect(reviews[1].textContent).toContain("User Two");
    expect(reviews[1].textContent).toContain("Jakarta, ID");
    expect(reviews[1].textContent).toContain("Location in downtown area.");
  });

  describe("Filter", () => {
    it("should show filtered reviews by name", async () => {
      render(<HotelReview hotel={hotel} onClose={() => {}} />);

      const input = await screen.getByTestId("filter-input");
      fireEvent.change(input, { target: { value: "User Two" } });

      const reviews = await screen.getAllByTestId("review");

      expect(reviews.length).toEqual(1);
      expect(reviews[0].textContent).toContain("User Two");
    });

    it("should show filtered reviews by location", async () => {
      render(<HotelReview hotel={hotel} onClose={() => {}} />);

      const input = await screen.getByTestId("filter-input");
      fireEvent.change(input, { target: { value: "Jakarta" } });

      const reviews = await screen.getAllByTestId("review");

      expect(reviews.length).toEqual(1);
      expect(reviews[0].textContent).toContain("User Two");
    });

    it("should show filtered reviews by title", async () => {
      render(<HotelReview hotel={hotel} onClose={() => {}} />);

      const input = await screen.getByTestId("filter-input");
      fireEvent.change(input, { target: { value: "good" } });

      const reviews = await screen.getAllByTestId("review");

      expect(reviews.length).toEqual(1);
      expect(reviews[0].textContent).toContain("User Two");
    });

    it("should show filtered reviews by description", async () => {
      render(<HotelReview hotel={hotel} onClose={() => {}} />);

      const input = await screen.getByTestId("filter-input");
      fireEvent.change(input, { target: { value: "location in downtown" } });

      const reviews = await screen.getAllByTestId("review");

      expect(reviews.length).toEqual(1);
      expect(reviews[0].textContent).toContain("User Two");
    });
  });

  it("should trigger onClose on click of close button", async () => {
    const fn = vi.fn();
    render(<HotelReview hotel={hotel} onClose={fn} />);

    const button = await screen.getByTestId("close-btn");
    button.click();

    expect(fn).toHaveBeenCalledOnce();
  });

  it("should trigger onClose on click outside of modal", async () => {
    const fn = vi.fn();
    render(<HotelReview hotel={hotel} onClose={fn} />);

    const container = await screen.getByTestId("container");
    container.click();

    expect(fn).toHaveBeenCalledOnce();
  });

  describe("Hiding scrollbar on document body", () => {
    it("should hide root scrollbar when modal is shown", () => {
      render(<HotelReview hotel={hotel} onClose={() => {}} />);

      expect(document.body.style.overflow).toEqual("hidden");
      expect(document.body.style.paddingRight).toEqual("15px");
    });

    it("should remove custom style when modal is hidden", () => {
      const { unmount } = render(
        <HotelReview hotel={hotel} onClose={() => {}} />
      );

      expect(document.body.style.overflow).toEqual("hidden");
      expect(document.body.style.paddingRight).toEqual("15px");

      unmount();

      expect(document.body.style.overflow).toEqual("");
      expect(document.body.style.paddingRight).toEqual("");
    });
  });
});
