import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* TITULO CENTRAL */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          LISTA DE TAREAS
        </h1>

        {/* BOTONES DE NAVEGACIÓN */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/ListaDeTareas">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Ir a Lista de Tareas
            </button>
          </Link>

          <Link href="/Login">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Iniciar Sesión
            </button>
          </Link>

          <Link href="/SignUP">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Registrarse
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
