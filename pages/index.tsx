import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { GetStaticProps } from 'next';
import { FC, useState, MouseEvent, FormEvent, useRef, useEffect } from 'react';
import { Todo } from '../types';
import cn from 'classnames';
import { getTodos } from '../utils';
import { todosCollection } from './api/todos';

export const getStaticProps: GetStaticProps = async () => {
  const { name } = await (await fetch('http://localhost:3000/api/hello')).json();
  const todos = await getTodos(todosCollection);

  return {
    props: {
      name,
      todos,
    },
  };
};

interface Props {
  name: string;
  todos: Todo[];
}

const Home: FC<Props> = ({ name, todos: todosProps }) => {
  const [todos, setTodos] = useState(todosProps);
  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoInputRef.current?.focus();
  }, []);

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const todoContent = todoInputRef.current?.value.trim();
    if (!todoContent || todos.some((todo) => todo.content === todoContent)) {
      return;
    }
    const { todos: newTodos } = await (await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      body: JSON.stringify({ content: todoInputRef.current?.value }),
    })).json();
    setTodos(newTodos);
    if (todoInputRef.current) {
      todoInputRef.current.value = '';
      todoInputRef.current.focus();
    }
  };

  const toggleTodo = async (id: string) => {
    const { todos } = await (await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'PATCH',
    })).json();
    setTodos(todos);
  };

  const removeTodo = async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => {
    event.stopPropagation();
    const { todos } = await (await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE',
    })).json();
    setTodos(todos);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Todo List, {name}
        </h1>

        <h2>Your Todos &darr;</h2>

        <section className={styles.wrapper}>
          {todos.length === 0 && (
            <h1 className={styles.placeholder}>No todos so far</h1>
          )}

          {todos.map((todo) => (
            <div key={todo._id} className={styles.card} onClick={() => toggleTodo(todo._id)}>
              <p className={cn({ [styles.done]: todo.isDone })}>{todo.content}</p>
              <button onClick={(event) => removeTodo(event, todo._id)}>
                <Image src="/remove.png" alt="Remove the todo" width="24" height="24" />
              </button>
            </div>
          ))}
        </section>

        <form onSubmit={addTodo} className={styles.form}>
          <input type="text" placeholder="Add Todo" className={styles.input} ref={todoInputRef} autoFocus />
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
