"use client";

import React from 'react';

export default function SignUpPage(){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [notification, setNotification] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '' || confirmPassword === '') {
      setNotification("Todos los campos son obligatorios.");
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    if (password !== confirmPassword) {
      setNotification("Las contraseñas no coinciden.");
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      // Enviar el registro al backend
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: "register", email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Si el error es que el usuario ya existe, se muestra la notificación y se limpian los inputs
        if(result.error === "El usuario ya existe") {
          setNotification("El usuario ya existe");
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTimeout(() => setNotification(''), 3000);
        } else {
          setNotification("Error al registrar el usuario");
          setTimeout(() => setNotification(''), 3000);
        }
        return;
      }

      setNotification("Usuario creado con éxito.");
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setNotification("Error en el servidor");
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>     
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
          <div id='notification' className={`text-red-500 text-center ${notification !== '' ? 'block' : 'hidden'}`}>
            <h3>{notification}</h3>
          </div> 
        </form>
      </div>
    </div>
  );
}

