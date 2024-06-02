import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fetchMock from "fetch-mock";

import App from "../App";
import { HOTEL_LIST_URL } from "../services/hotel";
import { mockHotelsData } from "../services/__tests__/data";

describe("App", () => {
  afterEach(() => {
    fetchMock.reset();
    cleanup();
  });

  describe("Listing", () => {
    it("should call listing API on render", async () => {
      const mock = fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
      render(<App />);

      expect(mock.called()).toBe(true);
    });

    it("should show error on API error", async () => {
      fetchMock.get(HOTEL_LIST_URL, 500);
      render(<App />);

      await waitFor(async () => {
        expect(
          await screen.findByText(
            "Oops, error getting hotel list, please try again later."
          )
        ).toBeVisible();
      });
    });

    it("should show render list of hotels and its filter", async () => {
      fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
      render(<App />);

      await waitFor(async () => {
        expect(await screen.findByTestId("hotel-filter")).toBeVisible();
        expect(await screen.findByTestId("hotel-listing")).toBeVisible();
      });

      expect(await screen.queryByTestId("hotel-review")).toBe(null);
    });

    describe("Show review", () => {
      it("should show hotel review modal", async () => {
        fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
        render(<App />);

        await waitFor(async () => {
          expect(await screen.findByTestId("hotel-listing")).toBeVisible();
        });

        const btn = (await screen.findAllByText(/See Reviews/))[0];
        btn.click();

        await waitFor(async () => {
          expect(await screen.findByTestId("hotel-review")).toBeVisible();
          expect(
            await screen.findByText("Shinagawa Prince Hotel")
          ).toBeVisible();
        });
      });

      it("should hide hotel review modal on close", async () => {
        fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
        render(<App />);

        await waitFor(async () => {
          expect(await screen.findByTestId("hotel-listing")).toBeVisible();
        });

        const btn = (await screen.findAllByText(/See Reviews/))[0];
        btn.click();

        await waitFor(async () => {
          expect(await screen.findByTestId("hotel-review")).toBeVisible();
          expect(
            await screen.findByText("Shinagawa Prince Hotel")
          ).toBeVisible();
        });

        const modal = await screen.findByTestId("hotel-review");
        modal.click();

        await waitFor(async () => {
          expect(await screen.findByTestId("hotel-review")).not.toBeVisible();
        });
      });
    });
  });

  describe("Filtering & Sorting", () => {
    it("should filter and sort hotels", async () => {
      fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
      render(<App />);

      const input = await screen.findByTestId<HTMLInputElement>(
        "keyword-filter-input"
      );
      fireEvent.change(input, { target: { value: "tokyo" } });

      const star = await within(
        await screen.findByTestId("hotel-filter")
      ).findByText("5 stars");
      const starInput = star.parentElement!.querySelector("input")!;
      starInput.click();

      const rating = await screen.findByText("9+ ratings");
      const ratingInput = rating.parentElement!.querySelector("input")!;
      ratingInput.click();

      const left = await screen.findByTestId<HTMLInputElement>("left-slider");
      fireEvent.change(left, { target: { value: 700 } });

      const right = await screen.findByTestId<HTMLInputElement>("right-slider");
      fireEvent.change(right, { target: { value: 841 } });

      const sort = await screen.findByTestId("lowest-sort");
      sort.click();

      const find = await screen.findByText("Find");
      find.click();

      await waitFor(async () => {
        expect(await screen.findByTestId("hotel-listing")).toBeVisible();
      });

      const els = await screen.findAllByTestId("hotel-card");
      expect(els.length).toBe(2);

      const text1 = await within(els[0]).findAllByText("Park Hyatt Tokyo");
      expect(text1.length).toBeGreaterThan(0);

      const text2 = await within(els[1]).findAllByText(
        "The Ritz-Carlton, Tokyo"
      );
      expect(text2.length).toBeGreaterThan(0);
    });
  });
});
