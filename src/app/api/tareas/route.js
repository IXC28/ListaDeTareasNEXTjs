"use server";
import { db } from '@/lib/db';
import exp from 'constants';

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

export async function POST(request) {
  try {
    const data = await request.json();
    const nuevaTarea = await db.tareas.create({
      data: {
        text: data.text,
        status: 'INCOMPLETA'
      }
    });
    return new Response(JSON.stringify(nuevaTarea), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return new Response(JSON.stringify({ error: 'Error al crear tarea' }), {
      status: 500,
    });
  }
}
