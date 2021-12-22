import type { NextApiRequest, NextApiResponse } from "next";
import xml from 'xml2json';

type Data = {
  status: "error" | "success";
  result: any;
};

interface Canteen {
  zarizeni: string;
  rezim_uzi: string;
  v_nazev: string;
  v_ulice: string;
  v_mesto: string;
  v_psc: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const endpoint =
    "https://wss52.strava.cz/WSStravne5/WSStravne5.svc/XMLService";
  try {
    const response = await fetch(
      `${endpoint}/WSOSeznamPZarizeni?AutUzivatelWS=IOSA01&AutHesloSW=CeXkKXZbILh4bjix&Zarizeni=&Polozky=V_NAZEV,V_MESTO,V_PSC,V_ULICE,REZIM_UZI`
    );
    const result = JSON.parse(xml.toJson((await response.json()).xml));
    const canteens: Canteen[] = result.VFPData.pomizarizen_wsseznam;
      res
        .status(200)
        .json({ status: "success", result: { total: canteens.length, canteens } });
  } catch (e) {
    res.status(500).json({ status: "error", result: e });
  }
}
