import type { NextApiRequest, NextApiResponse } from "next";

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

  const endpoint =
    "https://wss52.strava.cz/WSStravne5/WSStravne5.svc/XMLService";
  try {
    const response = await fetch(
      `${endpoint}/WSOPrihlaseniUzivateleKomplet2?uzivatelWS=StravaCZ&hesloWS=6xgM6IEE&databaze=${canteen}&uzivatel=${username}&heslo=${password}&mobilni=true&jazyk=3&vstupniZarizeni=M`
    );
    const result: AuthResponse = await response.json();
    if (result.WSOPrihlaseniUzivateleKomplet2Result === 0) {
      res
        .status(200)
        .json({ status: "success", result: { token: result.aSID } });
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
