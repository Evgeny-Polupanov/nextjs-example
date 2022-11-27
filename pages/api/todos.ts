import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../types';

type Data = {
  todos: Todo[];
}

const todos = [
  { id: 1, content: 'Learn Next.js', isDone: false },
  { id: 2, content: 'Learn Node.js', isDone: false },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let id: string | number;
  switch (req.method) {
    case 'GET':
      res.status(200).json({ todos });
      break;
    case 'DELETE':
      if (req.body) {
        id = JSON.parse(req.body).id;
        const todoIndexToDelete = todos.findIndex((todo) => String(todo.id) === String(id));
        if (todoIndexToDelete !== -1) {
          todos.splice(todoIndexToDelete, 1);
          res.status(200).json({ todos });
        } else {
          res.status(404).json({ todos });
        }
      } else {
        res.status(400).json({ todos });
      }
      break;
    case 'PATCH':
      if (req.body) {
        id = JSON.parse(req.body).id;
        const todoIndexToSetIsDone = todos.findIndex((todo) => String(todo.id) === String(id));
        if (todoIndexToSetIsDone !== -1) {
          todos[todoIndexToSetIsDone].isDone = !todos[todoIndexToSetIsDone].isDone;
          res.status(200).json({ todos });
        } else {
          res.status(404).json({ todos });
        }
      } else {
        res.status(400).json({ todos });
      }
      break;
    default:
      res.status(405).send({ todos });
      throw Error('Method is not supported.');
  }
}
