"use client";

import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        if (email === '' || password === '') {
            setNotification("Todos los campos son obligatorios.");
            setTimeout(() => setNotification(''), 3000);
            return;
        }
        // Guardar los valores al hacer clic en el botón
        console.log("Email:", email);
        console.log("Password:", password);

        // Aquí podrías enviar los datos al backend
        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: "login", email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setNotification(data.error || "Error en el inicio de sesión");
                setTimeout(() => setNotification(''), 3000);
                return;
            }

            console.log('Login exitoso:', data);
            setNotification("Inicio de sesión exitoso");

            // Guardar el usuario en localStorage (para autenticación futura)
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("Usuario guardado en localStorage", data.user);

            // Redirigir a la lista de tareas después de iniciar sesión
            setTimeout(() => {
                window.location.href = "/ListaDeTareas";
            }, 2000);

        } catch (error) {
            console.error('Error en el login:', error);
            setNotification("Error en el servidor");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-96 bg-white shadow-md rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300"
                    onClick={handleSubmit}
                >
                    Login
                </button>
                <div id='notification' className={`text-red-500 text-center ${notification !== '' ? 'block' : 'hidden'}`}
                >
                    <h3>{notification}</h3>
                </div>
            </form>
        </div>
    );
}
