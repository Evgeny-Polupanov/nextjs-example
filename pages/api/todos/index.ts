import type { NextApiRequest, NextApiResponse } from 'next';
import { Todo } from '../../../types';
import { Collection, Db, MongoClient } from 'mongodb';
import { getTodos } from '../../../utils';

type Data = {
  todos: Todo[];
}

let mongoClient: MongoClient;
let db: Db;
export let todosCollection: Collection<Todo>;

try {
  mongoClient = new MongoClient('mongodb://localhost:27017/todos');
  db = mongoClient.db();
  todosCollection = db.collection('todos');
} catch (error) {
  console.error(error);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      res.status(200).json({ todos: await getTodos(todosCollection) });
      break;
    case 'POST':
      const content = req.body && JSON.parse(req?.body)?.content?.trim();
      const todos = await getTodos(todosCollection);
      if (!content || typeof content !== 'string') {
        res.status(400).json({ todos: [] });
      } else if (todos.some((todo) => todo.content.toUpperCase() === content.toUpperCase())) {
        res.status(409).json({ todos: [] });
      } else {
        await todosCollection.insertOne({ content, isDone: false });
        res.status(200).json({ todos: await getTodos(todosCollection) });
      }
      break;
    default:
      res.status(405).json({ todos: [] });
      throw Error('Method is not supported.');
  }
}
