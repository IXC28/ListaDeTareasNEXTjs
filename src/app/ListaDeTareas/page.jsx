"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ListaDeTareas() {
  const router = useRouter();
  const [tareas, setTareas] = useState([]);
  const [total, setTotal] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(0);
  const [incompleted, setIncompleted] = useState(0);
  const lista = useRef(null);

  // Verificar autenticación consultando el endpoint que valida el token
  useEffect(() => {
    async function verifyAuth() {
      const res = await fetch('/api/usuarios');
      if (!res.ok) {
        router.push('/Login');
      } else {
        const data = await res.json();
        if (!data.authorized) {
          router.push('/Login'); 
        }
        // Opcional: almacena los datos del usuario en un estado si lo necesitas
      }
    }
    verifyAuth();
  }, [router]);

  useEffect(() => {
    const obtenerTareas = async () => {
      try {
        const response = await fetch('/api/tareas');
        if (!response.ok) {
          throw new Error('Error al obtener las tareas');
        }
        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    obtenerTareas();
  }, []);

  useEffect(() => {
    if (lista.current) {
      setTotal(lista.current.children.length);
    }
  }, [tareas]);

  const guardarTarea = async () => {
    if (titulo.trim()) {
      try {
        const response = await fetch('/api/tareas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: titulo }),
        });
        if (!response.ok) {
          throw new Error('Error al enviar la tarea');
        }
        const nuevaTarea = await response.json();
        setTareas([...tareas, nuevaTarea]);
        setIncompleted(incompleted + 1);
        setTitulo("");
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const borrarTarea = async (id) => {
    try {
      const response = await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Error al borrar la tarea');
      }
      const tareaEliminada = tareas.find(tarea => tarea.id === id);
      setTareas(tareas.filter(tarea => tarea.id !== id));
      if (tareaEliminada.status === 'COMPLETA') {
        setCompleted(completed - 1);
      } else {
        setIncompleted(incompleted - 1);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checarTarea = async (id) => {
    try {
      const response = await fetch(`/api/tareas/${id}`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Error al chequear la tarea');
      }
      const tareaActualizada = await response.json();
      setTareas(tareas.map(tarea => 
        tarea.id === tareaActualizada.id ? tareaActualizada : tarea
      ));
      if (tareaActualizada.status === 'COMPLETA') {
        setCompleted(completed + 1);
        setIncompleted(incompleted - 1);
      } else {
        setCompleted(completed - 1);
        setIncompleted(incompleted + 1);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="grid w-full gap-2">
      <div className="w-full h-32 flex items-center justify-center">
        <label className="text-black text-4xl">Lista De Tareas</label>
      </div>

      <div className="grid w-full gap-2 m-4">
        <Textarea
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Escribe tu tarea aquí."
        />
        <Button onClick={guardarTarea}>Añadir Tarea</Button>
      </div>

      <div id="lista-tareas" className="h-40 border-4 border-black bg-transparent overflow-auto overflow-x-hidden rounded-lg m-2">
        <ul ref={lista} className="list-none m-0 p-0">
          {tareas.map((tarea) => (
            <li key={tarea.id} className="list-items flex justify-between items-center w-full border-2 border-gray-700 p-2 rounded-lg">
              <button 
                className="delete-btn flex justify-center items-center w-10 h-10 bg-transparent text-black border border-red-500 hover:bg-red-500 transition-all duration-500 ease-in-out rounded-lg"
                onClick={() => borrarTarea(tarea.id)}
              >
                <svg className="delete-item w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>

              <span className={`text flex-1 break-all text-center ${tarea.status === "COMPLETA" ? "text-gray-500 line-through decoration-green-500" : "text-black"}`}>
                {tarea.text}
              </span>

              <button 
                onClick={() => checarTarea(tarea.id)}
                className={`check-btn flex justify-center items-center w-10 h-10 bg-transparent border border-green-500 transition-all duration-500 ease-in-out rounded-lg ${tarea.status === "COMPLETA" ? "bg-green-400 bg-opacity-50 text-transparent cursor-not-allowed" : "hover:bg-green-500 text-black"}`}
              >
                <svg className="check-item w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="contadores" className="flex justify-between items-center gap-4 mt-4 ml-2 mr-2">
        <span id="total" className="bg-yellow-400 rounded-md px-4 py-2">Total = {total}</span>
        <span id="completed" className="bg-green-500 rounded-md px-4 py-2">Completed = {completed}</span>
        <span id="incompleted" className="bg-red-500 rounded-md px-4 py-2">Incomplete = {incompleted}</span>
      </div>
    </div>
  );
}
