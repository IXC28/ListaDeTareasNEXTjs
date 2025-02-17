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
  const [logged, setLogged] = useState(false);
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
      }
    }
    verifyAuth();
  }, [router]);

  // Verificar si el token existe en las cookies y mostrar el botón de cerrar sesión
  useEffect(() => {
    const cookieStr = document.cookie;
    const tokenCookie = cookieStr.split('; ').find(row => row.startsWith('accessToken='));
    if (tokenCookie) setLogged(true);
  }, []);

  const handleLogout = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLogged(false);
    router.push('/Login');
  };

  // Obtener tareas
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

  // Actualizar total a partir de los elementos en la lista
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
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-4">
      {/* Cabecera con botón de Cerrar Sesión */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-6">
        {/* Título clickeable para ir a la página principal */}
        <h1
          onClick={() => router.push('/')}
          className="text-4xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600"
        >
          Lista De Tareas
        </h1>
        {logged && (
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cerrar Sesión
          </Button>
        )}
      </div>
      
      {/* Formulario para crear tarea */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <Textarea
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Escribe tu tarea aquí..."
          className="mb-4 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <Button onClick={guardarTarea} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">
          Añadir Tarea
        </Button>
      </div>
      
      {/* Lista de Tareas */}
      <div id="lista-tareas" className="bg-white shadow rounded-lg p-4 mb-6 overflow-auto">
        <ul ref={lista} className="space-y-3">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded"
            >
              <button 
                className="w-10 h-10 flex justify-center items-center bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white rounded transition-all"
                onClick={() => borrarTarea(tarea.id)}
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>

              <span className={`flex-1 text-center break-words transition-colors duration-300 ${tarea.status === "COMPLETA" ? "text-gray-500 line-through" : "text-gray-800"}`}>
                {tarea.text}
              </span>

              <button 
                onClick={() => checarTarea(tarea.id)}
                className={`w-10 h-10 flex justify-center items-center border rounded transition-colors duration-300 ${tarea.status === "COMPLETA" ? "bg-green-400 bg-opacity-50 border-green-400 cursor-not-allowed" : "bg-transparent border-green-500 hover:bg-green-500 hover:text-white text-green-500"}`}
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Contadores */}
      <div id="contadores" className="flex justify-between items-center bg-white shadow rounded-lg p-4">
        <span className="bg-yellow-300 rounded px-4 py-2 font-semibold">
          Total = {total}
        </span>
        <span className="bg-green-300 rounded px-4 py-2 font-semibold">
          Completed = {completed}
        </span>
        <span className="bg-red-300 rounded px-4 py-2 font-semibold">
          Incomplete = {incompleted}
        </span>
      </div>
    </div>
  );
}
