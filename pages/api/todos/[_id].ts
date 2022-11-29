import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../../types';
import { todosCollection } from './index';
import { getTodos } from '../../../utils';

type Data = {
  todos: Todo[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { _id } = req.query;
  if (typeof _id !== 'string') {
    res.status(400).json({ todos: [] });
    return;
  }
  switch (req.method?.toUpperCase()) {
    case 'DELETE':
      const deletedTodo = await todosCollection.findOneAndDelete({ _id })
      if (deletedTodo.ok) {
        res.status(200).json({ todos: await getTodos(todosCollection) });
      } else {
        res.status(404).json({ todos: [] });
      }
      break;
    case 'PATCH':
      const todoToUpdate = await todosCollection.findOne({ _id });
      const updatedTodo = await todosCollection.findOneAndUpdate({ _id }, {
        $set: { isDone: !todoToUpdate?.isDone },
      });
      if (updatedTodo.ok) {
        res.status(200).json({ todos: await getTodos(todosCollection) });
      } else {
        res.status(404).json({ todos: [] });
      }
      break;
    default:
      res.status(405).json({ todos: [] });
      throw Error('Method is not supported.');
  }
}
