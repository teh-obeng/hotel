import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HotelSort, { HotelSortOption } from "..";

describe("Hotel Sort", () => {
  afterEach(() => {
    cleanup();
  });

  it("should default to recommended", async () => {
    render(<HotelSort onChange={() => {}} />);

    const checkbox = await screen.findByTestId<HTMLInputElement>(
      "recommended-sort"
    );

    expect(checkbox.checked).toBe(true);
  });

  it("should check option based on `sort`", async () => {
    render(<HotelSort onChange={() => {}} sort={HotelSortOption.HIGHEST} />);

    const checkbox = await screen.findByTestId<HTMLInputElement>(
      "highest-sort"
    );

    expect(checkbox.checked).toBe(true);
  });

  it("should trigger event on change of sort", async () => {
    const change = vi.fn();

    render(<HotelSort onChange={change} sort={HotelSortOption.HIGHEST} />);

    const checkbox = await screen.findByTestId<HTMLInputElement>("lowest-sort");
    checkbox.click();

    expect(change).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledWith(HotelSortOption.LOWEST);
  });
});
