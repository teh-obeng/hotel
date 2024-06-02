import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MultiRangeSlider from "..";

describe("Multi Range Slider", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render prefix", async () => {
    render(
      <MultiRangeSlider
        min={1}
        max={100}
        current={{ min: 10, max: 80 }}
        valPrefix="&"
        onChange={() => {}}
      />
    );

    expect(await screen.findByText("&10")).toBeVisible();
    expect(await screen.findByText("&80")).toBeVisible();
  });

  describe("Left slider", () => {
    it("should trigger onChange", async () => {
      const fn = vi.fn();
      render(
        <MultiRangeSlider
          min={1}
          max={100}
          current={{ min: 10, max: 80 }}
          valPrefix="&"
          onChange={fn}
        />
      );

      const left = await screen.findByTestId("left-slider");
      fireEvent.change(left, { target: { value: 40 } });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(40, 80);
    });

    it("should not exceed right slider value", async () => {
      const fn = vi.fn();

      render(
        <MultiRangeSlider
          min={1}
          max={100}
          current={{ min: 10, max: 80 }}
          valPrefix="&"
          onChange={fn}
        />
      );

      const left = await screen.findByTestId("left-slider");
      fireEvent.change(left, { target: { value: 90 } });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(79, 80);
    });
  });

  describe("Right slider", () => {
    it("should trigger onChange", async () => {
      const fn = vi.fn();

      render(
        <MultiRangeSlider
          min={1}
          max={100}
          current={{ min: 10, max: 80 }}
          valPrefix="&"
          onChange={fn}
        />
      );

      const right = await screen.findByTestId("right-slider");
      fireEvent.change(right, { target: { value: 40 } });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(10, 40);
    });

    it("should not exceed left slider value", async () => {
      const fn = vi.fn();

      render(
        <MultiRangeSlider
          min={1}
          max={100}
          current={{ min: 10, max: 80 }}
          valPrefix="&"
          onChange={fn}
        />
      );

      const right = await screen.findByTestId("right-slider");
      fireEvent.change(right, { target: { value: 9 } });

      expect(fn).toHaveBeenCalledOnce();
      expect(fn).toHaveBeenCalledWith(10, 11);
    });
  });
});
