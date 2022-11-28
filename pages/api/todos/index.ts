import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../../types';
import { uid } from 'uid';

type Data = {
  todos: Todo[];
}

export const todos: Todo[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      res.status(200).json({ todos });
      break;
    case 'POST':
      const content = req.body && JSON.parse(req?.body)?.content?.trim();
      if (!content || typeof content !== 'string') {
        res.status(400).json({ todos });
      } else if (todos.some((todo) => todo.content.toUpperCase() === content.toUpperCase())) {
        res.status(409).json({ todos });
      } else {
        let id = uid(16);
        while (todos.some((todo) => String(todo.id) === String(id))) {
          id = uid(16);
        }
        todos.unshift({ id, content, isDone: false });
        res.status(200).json({ todos });
      }
      break;
    default:
      res.status(405).json({ todos });
      throw Error('Method is not supported.');
  }
}
