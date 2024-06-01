import { useEffect, useState } from "react";
import { Hotel } from "../types";
import * as hotelService from "../services/hotel";

export function useListHotels(): [boolean, boolean, Hotel[]] {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const hotels = await hotelService.getHotels();

        setHotels(hotels);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    })();
  }, []);

  return [loading, error, hotels];
}
