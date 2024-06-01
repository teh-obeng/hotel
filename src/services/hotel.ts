import { Hotel } from "../types";

export const HOTEL_LIST_URL =
  "https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/en";

export async function getHotels(): Promise<Hotel[]> {
  const resp = await fetch(HOTEL_LIST_URL);
  const body = await resp.json();

  return body as Hotel[];
}
