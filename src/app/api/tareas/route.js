import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Obtener el token de las cookies
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No se proporcionó token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar el token y obtener el id del usuario
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buscar únicamente las tareas que pertenezcan a ese usuario
    const tareas = await db.tareas.findMany({
      where: {
        userId: userId
      }
    });

    console.log('Tareas del usuario:', tareas);
    return new Response(JSON.stringify(tareas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener tareas' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Obtener el token de las cookies
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'No se proporcionó token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar el token y obtener el id del usuario
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Crear la nueva tarea asociándola al usuario
    const nuevaTarea = await db.tareas.create({
      data: {
        text: data.text,
        status: 'INCOMPLETA',
        userId: userId,
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
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
