// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: 'error' | 'success';
  result: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { cafeteria } = req.query;
  if (!cafeteria) {
    res.status(400).json({ status: 'error', result: 'You need to provide a cafeteria parameter in the request' });
  }
  if (typeof cafeteria === "object") {
    res.status(400).json({ status: 'error', result: 'Pleas only provide the cafeteria parameter once' });
  }
  res.status(200).json({ status: 'success', result: 'LGTM' });
}
