import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../../types';

type Data = {
  todos: Todo[];
}

export const todos = [
  { id: 1, content: 'Learn Next.js', isDone: false },
  { id: 2, content: 'Learn Node.js', isDone: false },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      res.status(200).json({ todos });
      break;
    default:
      res.status(405).json({ todos });
      throw Error('Method is not supported.');
  }
}
