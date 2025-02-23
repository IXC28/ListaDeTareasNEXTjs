import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { email, password, type } = await req.json(); // Se recibe el tipo de acción

        if (type === "register") {
            // 🔹 REGISTRO DE USUARIO
            console.log("Registrando usuario:", email);

            // Verificar si el usuario ya existe
            const userExistente = await db.user.findUnique({
                where: { email },
            });

            if (userExistente) {
                return new Response(JSON.stringify({ error: "El usuario ya existe" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario en la base de datos
            const newUser = await db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            return new Response(JSON.stringify({ message: "Usuario creado exitosamente", user: newUser }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } 

        else if (type === "login") {
            // 🔹 LOGIN DE USUARIO
            console.log("Iniciando sesión con:", email);

            // Buscar usuario en la base de datos
            const user = await db.user.findUnique({
                where: { email },
            });

            if (!user) {
                return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Depurar ACCESS_TOKEN_SECRET
            console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

            // Generar el accessToken y configurar la cookie
            const userForToken = { id: user.id };
            const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            // Updated cookie: add "Path=/" to ensure it's available in /ListaDeTareas
            const cookie = `accessToken=${accessToken}; Expires=${new Date(Date.now() + 1000 * 60 * 60 * 24).toUTCString()}; Path=/;`;

            return new Response(JSON.stringify({ message: "Login exitoso", user }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookie,
                },
            });
        }

        // Si no se recibe un `type` válido
        return new Response(JSON.stringify({ error: "Tipo de acción no válido" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error en usuarios:", error);
        return new Response(JSON.stringify({ error: "Error en el servidor" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(req) {
  try {
    // Extraer el token de la cookie
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar la firma del token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Buscar el usuario basado en el id del token
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Retornar la información del usuario (puedes ajustar qué datos enviar)
    return new Response(JSON.stringify({ authorized: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error en autenticación:", error);
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}