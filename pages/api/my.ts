import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAnon, getAuthedLunchList } from '../../lib/fetchPage';

type Data = {
  status: 'error' | 'success';
  result: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { cafeteria, username, password } = req.query;
  for (const param of [cafeteria, username, password]) {
    if (!param) {
      res.status(400).json({ status: 'error', result: `You need to provide a cafeteria, username and password parameters in the request` });
      return;
    }
    if (typeof param === "object") {
      res.status(400).json({ status: 'error', result: `Please only provide each parameter once` });
      return;
    }
  }

  try {
    // @ts-ignore
    const result = await getAuthedLunchList(username, password, cafeteria);
    res.status(200).json({ status: 'success', result });
  } catch (e) {
    res.status(500).json({ status: 'error', result: e })
  }
}
