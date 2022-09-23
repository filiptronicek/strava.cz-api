import type { NextApiRequest, NextApiResponse } from "next";
import xml from "xml2json";
import { endpoint } from "../../../lib/constants";
import limiter from "../../../lib/rateLimit";
import {
  GenericAPIResponse,
  RawUpcomingOrdersResponse,
  UpcomingOrdersResult,
} from "../../../types";
import 'core-js/actual/array/group';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenericAPIResponse>
) {
  try {
    await limiter.check(res, 69, "CACHE_TOKEN");
  } catch {
    res.status(429).json({
      status: "error",
      result: "Rate limit exceeded",
    });
  }

  const { canteen, token } = req.query;
  for (const param of [canteen, token]) {
    if (!param) {
      res.status(400).json({
        status: "error",
        result: `You need to provide a canteen and a token as parameters in the request`,
      });
      return;
    }
    if (typeof param === "object") {
      res.status(400).json({
        status: "error",
        result: `Please only provide each parameter once`,
      });
      return;
    }
  }

  try {
    const response = await fetch(
      `${endpoint}/WSORozpisObjednavek?uzivatelWS=StravaCZ&hesloWS=6xgM6IEE&databaze=${canteen}&SID=${token}&podminka=`
    );
    const data: RawUpcomingOrdersResponse = await response.json();
    if (data.WSORozpisObjednavekResult === 0) {
      const parsed: UpcomingOrdersResult = JSON.parse(
        xml.toJson(data.objednavky)
      );
      //@ts-ignore
      const result = parsed.RozpisObjednavek.Produkt.groupBy(o => o.Datum)
      res
        .status(200)
        .json({ status: "success", result });
    } else res.status(403).json({ status: "error", result: "Auth error" });
  } catch (e) {
    res.status(500).json({ status: "error", result: e });
  }
}
