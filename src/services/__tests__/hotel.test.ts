import { describe, it, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";

import { getHotels, HOTEL_LIST_URL } from "../hotel";
import { mockHotelsData } from "./data";

describe("Hotel Service", () => {
  describe("Get Hotels", () => {
    afterEach(() => {
      fetchMock.reset();
    });

    it("should call hotel list url once", async () => {
      const mock = fetchMock.get(HOTEL_LIST_URL, mockHotelsData);
      await getHotels();

      expect(mock.calls().length).toEqual(1);
    });

    it("should return list of hotels", async () => {
      fetchMock.getOnce(HOTEL_LIST_URL, mockHotelsData);

      const hotels = await getHotels();

      expect(hotels).toEqual(mockHotelsData);
    });

    it("should throw error for non-200 response", async () => {
      fetchMock.getOnce(HOTEL_LIST_URL, 404);

      await expect(getHotels).rejects.toThrowError();
    });
  });
});
