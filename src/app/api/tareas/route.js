"use server";
import { db } from '@lib/db';

export async function GET() {
    try {
      const tareas = await db.tareas.findMany();
      console.log('Tareas:', tareas);
      return new Response(JSON.stringify(tareas), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      return new Response(JSON.stringify({ error: 'Error al obtener tareas' }), {
        status: 500,
      });
    }
  }