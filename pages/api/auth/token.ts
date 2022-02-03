import type { NextApiRequest, NextApiResponse } from "next";
import { endpoint } from "../../../lib/constants";
import limiter from "../../../lib/rateLimit";
import xml from 'xml2json';

type Data = {
  status: "error" | "success";
  result: any;
};

interface AuthResponse {
    WSOPrihlaseniUzivateleKomplet2Result: number;
    aSID: string;
    xmlUzivatel: string;
    xmlKonto: string;
    xmlVydejniMista: string;
    xmlDiety: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    await limiter.check(res, 20, 'CACHE_TOKEN');
  } catch {
    res.status(429).json({
      status: 'error',
      result: 'Rate limit exceeded',
    });
  }

  const { canteen, username, password } = req.query;
  for (const param of [canteen, username, password]) {
    if (!param) {
      res
        .status(400)
        .json({
          status: "error",
          result: `You need to provide a cafeteria, username and password parameters in the request`,
        });
      return;
    }
    if (typeof param === "object") {
      res
        .status(400)
        .json({
          status: "error",
          result: `Please only provide each parameter once`,
        });
      return;
    }
  }

  try {
    const response = await fetch(
      `${endpoint}/WSOPrihlaseniUzivateleKomplet2?uzivatelWS=StravaCZ&hesloWS=6xgM6IEE&databaze=${canteen}&uzivatel=${username}&heslo=${password}&mobilni=true&jazyk=3&vstupniZarizeni=M`
    );
    const result: AuthResponse = await response.json();
    if (result.WSOPrihlaseniUzivateleKomplet2Result === 0) {
      res
        .status(200)
        .json({ status: "success", result: { token: result.aSID, user: JSON.parse(xml.toJson(result.xmlUzivatel)).VlastnostiUzivatele.Uzivatel } });
    } else {
      res
        .status(400)
        .json({
          status: "error",
          result:
            "Auth failed, please make sure you are using the correct combination of canteen ID, username and password",
        });
    }
  } catch (e) {
    res.status(500).json({ status: "error", result: e });
  }
}
