import { afterEach, describe, expect, it } from "vitest";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { useListHotels } from "../useListHotels";
import fetchMock from "fetch-mock";
import { HOTEL_LIST_URL } from "../../services/hotel";
import { mockHotelsData } from "../../services/__tests__/data";

describe("useListHotels", () => {
  afterEach(() => {
    fetchMock.reset();
    cleanup();
  });
  

  it("should return list of hotels on API success", async () => {
    const mock = fetchMock.get(HOTEL_LIST_URL, mockHotelsData);

    const { result } = renderHook(useListHotels);

    await waitFor(() => expect(mock.called()).toBe(true));

    expect(result.current[2]).toEqual(mockHotelsData);
  });

  it("should return loading = false on API success", async () => {
    const mock = fetchMock.get(HOTEL_LIST_URL, mockHotelsData);

    const { result } = renderHook(useListHotels);

    await waitFor(() => expect(mock.called()).toBe(true));

    expect(result.current[0]).toEqual(false);
  });

  it("should NOT return error on API success", async () => {
    const mock = fetchMock.get(HOTEL_LIST_URL, mockHotelsData);

    const { result } = renderHook(useListHotels);

    await waitFor(() => expect(mock.called()).toBe(true));

    expect(result.current[1]).toBeUndefined;
  });

  it("should return error on API error", async () => {
    const mock = fetchMock.get(HOTEL_LIST_URL, 500);

    const { result } = renderHook(useListHotels);

    await waitFor(() => expect(mock.called()).toBe(true));

    expect(result.current[1]).toEqual(true);
  });
});
