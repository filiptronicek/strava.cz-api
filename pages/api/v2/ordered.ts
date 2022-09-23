import type { NextApiRequest, NextApiResponse } from "next";
import limiter from "../../../lib/rateLimit";
import {
  GenericAPIResponse,
} from "../../../types";
import "core-js/actual/array/group";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenericAPIResponse>
) {
  res.status(501).json({ status: "error", result: "Not implemented" });

  try {
    await limiter.check(res, 69, "CACHE_TOKEN");
  } catch {
    res.status(429).json({
      status: "error",
      result: "Rate limit exceeded",
    });
  }
}

