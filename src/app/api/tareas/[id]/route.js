import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/db';


export async function DELETE(request, { params }) {
  try {
    const { id } = await params;  // Obtiene el id de la URL dinámica

    // Borra la tarea de la base de datos usando Prisma
    const tarea = await db.tareas.delete({
      where: { id: parseInt(id) },
    });

    // Responde con la tarea eliminada
    return new Response(JSON.stringify(tarea), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al borrar tarea:', error);
    return new Response(JSON.stringify({ error: 'Error al borrar tarea' }), {
      status: 500,
    });
  }
}

export async function PATCH(request, { params }) {
 
    try {
        const { id } = await params;  // Obtiene el id de la URL dinámica
        const tareaId = parseInt(id);

        // Borra la tarea de la base de datos usando Prisma
        const tareaExistente = await db.tareas.findUnique({
            where: { id: tareaId },
          });        
          

          if (!tareaExistente) {
            return new Response(JSON.stringify({ error: 'Tarea no encontrada' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          // Actualiza el estado de la tarea
          const tarea = await db.tareas.update({
            where: { id: tareaId },
            data: {
              status: 'COMPLETA'
            },
          });    
        // Responde con la tarea eliminada
        return new Response(JSON.stringify(tarea), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error al borrar tarea:', error);
        return new Response(JSON.stringify({ error: 'Error al borrar tarea' }), {
          status: 500,
        });
      }

}
