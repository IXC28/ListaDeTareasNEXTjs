import React from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ListaDeTareas() {

  
  return (

    <div className="grid w-full gap-2">

      <div className="w-full h-32 flex items-center justify-center">
        <label className="text-black text-4xl">Lista De Tareas</label>
      </div>

      <Textarea id="bar" className="m-2" placeholder="Escribe tu tarea aqui." />
      <Button id="add-btn" className="m-2">Añadir Tarea</Button>


      <div id="lista-tareas">
        <ul id="list">





        </ul>
      </div>

      <div id="contadores" className="flex justify-between items-center gap-4 mt-4 ml-2 mr-2">
        <span id="total" className="bg-yellow-400 rounded-md px-4 py-2">Total</span>
        <span id="completed" className="bg-green-500 rounded-md px-4 py-2">Completed</span>
        <span id="incompleted" className="bg-red-500 rounded-md px-4 py-2">Incomplete</span>
      </div>

    </div>

  )
}
