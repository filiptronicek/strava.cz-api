export interface GenericAPIResponse {
  status: "error" | "success";
  result: any;
}

interface RawUpcomingOrdersResponse {
  WSORozpisObjednavekResult: number;
  uzivatel: string;
  objednavky: string;
}

export interface UpcomingOrdersResponse {
  status: "error" | "success";
  result: UpcomingOrdersResult;
}

export interface UpcomingOrdersResult {
  RozpisObjednavek: {
    Produkt: Produkt[];
    ZmenaKonta: ZmenaKonta;
  };
}

export enum Chod {
  C = "C",
  Empty = "",
  I = "I",
}

export enum Druh {
  Do = "DO",
  Ob = "OB",
  Po = "PO",
}

export enum NelzeObjDen {
  Co = "CO",
  Empty = "",
  T = "T",
}

export enum NelzeZm {
  Empty = "",
  I = "I",
  Z = "Z",
}

export enum PopisDruhu {
  Doplněk = "Doplněk ",
  Oběd1 = "Oběd 1",
  Oběd2 = "Oběd 2",
  Oběd3 = "Oběd 3",
  Polévka = "Polévka ",
}

export enum PopisP {
  Empty = "",
  Oběd = "Oběd",
}

export enum ZkratkaProduktu {
  Empty = "",
  Ob = "OB",
}

export interface ZmenaKonta {
  ZmenaKonta: string;
}

export interface Produkt {
  Veta: string;
  ZkratkaProduktu: ZkratkaProduktu;
  PopisProduktu: PopisP;
  Pocet: string;
  Datum: string;
  Druh: Druh;
  CisloJidelnicku: string;
  Chod: Chod;
  PopisDruhu: PopisDruhu;
  PopisPoradiJidla: PopisP;
  NazevJidelnicku: string;
  PopisJidla: string;
  Poznamka: string;
  Alergeny: string;
  AlergenyUpozornit: string;
  KonecObjednavani: string;
  KonecOdhlaseni: string;
  UkonceniBurzyPrihlasky: string;
  UkonceniBurzyOdhlasky: string;
  NelzeObjDen: NelzeObjDen;
  NelzeObj: Chod;
  NelzeZm: NelzeZm;
  BurzaPrihlasky: string;
  BurzaOdhlasky: string;
  BurzaZmena: string;
  BurzaOstatni: string;
  BurzaNabidka: string;
  BurzaPoptavka: string;
  CenaSDph: string;
  VydejniMisto: string;
  Dieta: string;
  VydejniMista: string;
}
