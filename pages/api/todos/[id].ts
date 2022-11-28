import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../../types';
import { todos } from './index';

type Data = {
  todos: Todo[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id } = req.query;
  switch (req.method?.toUpperCase()) {
    case 'DELETE':
      const todoIndexToDelete = todos.findIndex((todo) => String(todo.id) === String(id));
      if (todoIndexToDelete !== -1) {
        todos.splice(todoIndexToDelete, 1);
        res.status(200).json({ todos });
      } else {
        res.status(404).json({ todos });
      }
      break;
    case 'PATCH':
      const todoIndexToSetIsDone = todos.findIndex((todo) => String(todo.id) === String(id));
      if (todoIndexToSetIsDone !== -1) {
        todos[todoIndexToSetIsDone].isDone = !todos[todoIndexToSetIsDone].isDone;
        res.status(200).json({ todos });
      } else {
        res.status(404).json({ todos });
      }
      break;
    default:
      res.status(405).json({ todos });
      throw Error('Method is not supported.');
  }
}
