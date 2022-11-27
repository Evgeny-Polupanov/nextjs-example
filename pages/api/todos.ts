import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../types';

type Data = {
  todos: Todo[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ todos: [{ id: 1, content: 'Learn Next.js' }] });
}
