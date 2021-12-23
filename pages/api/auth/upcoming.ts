import type { NextApiRequest, NextApiResponse } from "next";
import xml from "xml2json";
import { endpoint } from "../../../lib/constants";

type Data = {
  status: "error" | "success";
  result: any;
};

interface UpcomingOrdersResponse {
  WSORozpisObjednavekResult: number;
  objednavky: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { canteen, token } = req.query;
  for (const param of [canteen, token]) {
    if (!param) {
      res.status(400).json({
        status: "error",
        result: `You need to provide a cafeteria, username and password parameters in the request`,
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
    const data: UpcomingOrdersResponse = await response.json();
    if (data.WSORozpisObjednavekResult === 0) {
      const result = JSON.parse(xml.toJson(data.objednavky));
      res
        .status(200)
        .json({ status: "success", result: result.RozpisObjednavek });
    } else res.status(403).json({ status: "error", result: "Auth error" });
  } catch (e) {
    res.status(500).json({ status: "error", result: e });
  }
}
