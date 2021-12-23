import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAnon } from '../../lib/fetchPage';
import limiter from '../../lib/rateLimit';

type Data = {
  status: 'error' | 'success';
  result: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    await limiter.check(res, 69, 'CACHE_TOKEN');
  } catch {
    res.status(429).json({
      status: 'error',
      result: 'Rate limit exceeded',
    });
  }

  const { cafeteria } = req.query;
  if (!cafeteria) {
    res.status(400).json({ status: 'error', result: 'You need to provide a cafeteria parameter in the request' });
  }
  if (typeof cafeteria === "object") {
    res.status(400).json({ status: 'error', result: 'Pleas only provide the cafeteria parameter once' });
    return;
  }

  try {
    const result = await fetchAnon(cafeteria);
    res.status(200).json({ status: 'success', result });
  } catch (e) {
    res.status(500).json({ status: 'error', result: e })
  }
}
