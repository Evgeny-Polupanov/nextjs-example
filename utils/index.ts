import { Todo } from '../types';
import { todosCollection } from '../pages/api/todos';

export const getTodos = async (): Promise<Todo[]> => {
  if (todosCollection) {
    return await todosCollection.find().toArray();
  }
  return [];
};
