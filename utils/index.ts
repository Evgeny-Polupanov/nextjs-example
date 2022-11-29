import { Collection } from 'mongodb';
import { Todo } from '../types';

export const getTodos = async (collection?: Collection<Todo>): Promise<Todo[]> => {
  if (collection) {
    return await collection.find().toArray();
  }
  return [];
};
