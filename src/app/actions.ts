'use server';

import { PrismaClient } from '@/lib/prisma-client/client';
import { revalidatePath } from 'next/cache';

import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

export async function getTodos() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Sort: uncompleted first, then completed. Within each group, sort by createdAt desc
  return todos.sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.completed ? 1 : -1;
  });
}

export async function addTodo(content: string) {
  await prisma.todo.create({
    data: {
      content,
    },
  });
  revalidatePath('/');
}

export async function toggleTodo(id: string, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  revalidatePath('/');
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({
    where: { id },
  });
  revalidatePath('/');
}

export async function updateTodo(id: string, content: string) {
  await prisma.todo.update({
    where: { id },
    data: { content },
  });
  revalidatePath('/');
}
