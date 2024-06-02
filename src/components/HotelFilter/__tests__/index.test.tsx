import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HotelFilter from "..";
import { Hotel } from "../../../types";
import { HotelSortOption } from "../../HotelSort";

describe("Hotel Filter & Sort", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Keyword filter", () => {
    it("should render empty keyword input field", async () => {
      render(<HotelFilter hotels={[]} onFilterSort={() => {}} />);

      expect(await screen.findByTestId("keyword-filter-input")).toBeVisible();
    });

    it("should be able to fill in keyword", async () => {
      render(<HotelFilter hotels={[]} onFilterSort={() => {}} />);
      const input = await screen.findByTestId<HTMLInputElement>(
        "keyword-filter-input"
      );
      fireEvent.change(input, { target: { value: "hello" } });

      expect(input.value).toBe("hello");
    });
  });

  describe("Hotel star ratings", () => {
    it("should render available hotel star ratings", async () => {
      const hotels: Hotel[] = [
        {
          id: 1,
          name: "",
          address: "",
          price: 1,
          rating: 4,
          stars: 3,
          photo: "",
          description: "",
        },
        {
          id: 2,
          name: "",
          address: "",
          price: 1,
          rating: 4,
          stars: 5,
          photo: "",
          description: "",
        },
      ];
      render(<HotelFilter hotels={hotels} onFilterSort={() => {}} />);

      expect(await screen.findByText("3 stars")).toBeVisible();
      expect(await screen.findByText("5 stars")).toBeVisible();
    });

    it("should be checkable", async () => {
      const hotels: Hotel[] = [
        {
          id: 1,
          name: "",
          address: "",
          price: 1,
          rating: 4,
          stars: 3,
          photo: "",
          description: "",
        },
        {
          id: 2,
          name: "",
          address: "",
          price: 1,
          rating: 4,
          stars: 5,
          photo: "",
          description: "",
        },
      ];
      render(<HotelFilter hotels={hotels} onFilterSort={() => {}} />);
      const threeStar = await screen.findByText("3 stars");
      const fiveStar = await screen.findByText("5 stars");

      let input = threeStar.parentElement!.querySelector("input")!;
      expect(input).toBeVisible();
      expect(input.checked).toBe(false);
      input.click();
      expect(input.checked).toBe(true);

      input = fiveStar.parentElement!.querySelector("input")!;
      expect(input).toBeVisible();
      expect(input.checked).toBe(false);
      input.click();
      expect(input.checked).toBe(true);
    });
  });

  describe("Hotel review rating", () => {
    it("should render available hotel review ratings", async () => {
      const hotels: Hotel[] = [
        {
          id: 1,
          name: "",
          address: "",
          price: 1,
          rating: 4,
          stars: 3,
          photo: "",
          description: "",
        },
        {
          id: 2,
          name: "",
          address: "",
          price: 1,
          rating: 8,
          stars: 5,
          photo: "",
          description: "",
        },
      ];
      render(<HotelFilter hotels={hotels} onFilterSort={() => {}} />);

      const fourRatings = await screen.findByText("4+ ratings");
      const eightRatings = await screen.findByText("8+ ratings");

      let input = fourRatings.parentElement!.querySelector("input")!;
      expect(input).toBeVisible();
      expect(input.checked).toBe(false);
      input.click();
      expect(input.checked).toBe(true);

      input = eightRatings.parentElement!.querySelector("input")!;
      expect(input).toBeVisible();
      expect(input.checked).toBe(false);
      input.click();
      expect(input.checked).toBe(true);
    });
  });

  describe("Price filter", () => {
    it("should render", async () => {
      const hotels: Hotel[] = [
        {
          id: 1,
          name: "",
          address: "",
          price: 100,
          rating: 4,
          stars: 3,
          photo: "",
          description: "",
        },
        {
          id: 2,
          name: "",
          address: "",
          price: 241,
          rating: 8,
          stars: 5,
          photo: "",
          description: "",
        },
      ];
      render(<HotelFilter hotels={hotels} onFilterSort={() => {}} />);

      const slider = await screen.findByTestId("multi-range-slider");
      expect(slider).toBeVisible();
    });
  });

  it("should render sort option", async () => {
    const hotels: Hotel[] = [];
    render(<HotelFilter hotels={hotels} onFilterSort={() => {}} />);

    expect(await screen.findByText("Sort By:")).toBeVisible();
    expect(await screen.findByText("Lowest Price")).toBeVisible();
    expect(await screen.findByText("Highest Price")).toBeVisible();
    expect(await screen.findByText("Recommended")).toBeVisible();
  });

  it("should be able to reset filter", async () => {
    const hotels: Hotel[] = [
      {
        id: 1,
        name: "",
        address: "",
        price: 100,
        rating: 4,
        stars: 3,
        photo: "",
        description: "",
      },
      {
        id: 2,
        name: "",
        address: "",
        price: 241,
        rating: 8,
        stars: 5,
        photo: "",
        description: "",
      },
    ];
    const fn = vi.fn();
    render(<HotelFilter hotels={hotels} onFilterSort={fn} />);

    const input = await screen.findByTestId<HTMLInputElement>(
      "keyword-filter-input"
    );
    fireEvent.change(input, { target: { value: "hello" } });

    const threeStar = await screen.findByText("3 stars");
    const threeStarInput = threeStar.parentElement!.querySelector("input")!;
    threeStarInput.click();

    const fourRating = await screen.findByText("4+ ratings");
    const fourRatingInput = fourRating.parentElement!.querySelector("input")!;
    fourRatingInput.click();

    const left = await screen.findByTestId<HTMLInputElement>("left-slider");
    fireEvent.change(left, { target: { value: 40 } });

    const right = await screen.findByTestId<HTMLInputElement>("right-slider");
    fireEvent.change(right, { target: { value: 80 } });

    const sort = await screen.findByTestId("highest-sort");
    sort.click();

    const reset = await screen.findByText("Reset");

    expect(reset).toBeVisible();
    reset.click();

    await waitFor(async () => {
      expect(input.value).toEqual("");
      expect(threeStarInput.checked).toBe(false);
      expect(fourRatingInput.checked).toBe(false);
      expect(left.value).toEqual("100");
      expect(right.value).toEqual("241");

      const sort = await screen.findByTestId<HTMLInputElement>(
        "recommended-sort"
      );
      expect(sort.checked).toBe(true);
    });

    expect(fn).toHaveBeenCalledWith({});
  });

  it("should trigger onFilterSort", async () => {
    const hotels: Hotel[] = [
      {
        id: 1,
        name: "",
        address: "",
        price: 100,
        rating: 4,
        stars: 3,
        photo: "",
        description: "",
      },
      {
        id: 2,
        name: "",
        address: "",
        price: 241,
        rating: 8,
        stars: 5,
        photo: "",
        description: "",
      },
    ];
    const fn = vi.fn();
    render(<HotelFilter hotels={hotels} onFilterSort={fn} />);

    const input = await screen.findByTestId<HTMLInputElement>(
      "keyword-filter-input"
    );
    fireEvent.change(input, { target: { value: "hello" } });

    const threeStar = await screen.findByText("3 stars");
    const threeStarInput = threeStar.parentElement!.querySelector("input")!;
    threeStarInput.click();

    const fourRating = await screen.findByText("4+ ratings");
    const fourRatingInput = fourRating.parentElement!.querySelector("input")!;
    fourRatingInput.click();

    const left = await screen.findByTestId<HTMLInputElement>("left-slider");
    fireEvent.change(left, { target: { value: 200 } });

    const right = await screen.findByTestId<HTMLInputElement>("right-slider");
    fireEvent.change(right, { target: { value: 220 } });

    const sort = await screen.findByTestId("highest-sort");
    sort.click();

    const find = await screen.findByText("Find");

    expect(find).toBeVisible();
    find.click();

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith({
      name: "hello",
      price: { min: 200, max: 220 },
      starRatings: [3],
      reviewRatings: [4],
      sort: HotelSortOption.HIGHEST,
    });
  });
});
