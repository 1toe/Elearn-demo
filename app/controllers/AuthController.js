const Usuario = require("../models/User");
const { validateEmail, validatePassword, validateRUT } = require("../utils/validators");
const render = require("../utils/render");

class AuthController {
    // Mostrar el formulario de registro
    static getRegister(req, res) {
        const html = render("registro.html", { title: "Registro", error: "", success: "" });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    }

    // Procesar el registro de usuarios
    static async postRegister(req, res) {
        let body = "";
        req.on("data", (chunk) => (body += chunk)); // Leer datos enviados por POST
        req.on("end", async () => {
            const formData = new URLSearchParams(body);
            const usuario = {
                rut: formData.get("rut"),
                nombre: formData.get("nombre"),
                apellido: formData.get("apellido"),
                correo: formData.get("email"),
                contrasenia: formData.get("password"),
                tipo_usuario: "estudiante", // Valor predeterminado para tipo_usuario
            };

            // Validar los datos
            if (!validateRUT(usuario.rut)) {
                const html = render("registro.html", {
                    title: "Registro",
                    error: "El RUT no es válido.",
                    success: "",
                });
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end(html);
                return;
            }

            if (!validateEmail(usuario.correo)) {
                const html = render("registro.html", {
                    title: "Registro",
                    error: "El correo electrónico no es válido.",
                    success: "",
                });
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end(html);
                return;
            }

            if (!validatePassword(usuario.contrasenia)) {
                const html = render("registro.html", {
                    title: "Registro",
                    error: "La contraseña debe tener al menos 6 caracteres.",
                    success: "",
                });
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end(html);
                return;
            }

            try {
                // Intentar registrar al usuario
                await Usuario.create(usuario);
                const html = render("registro.html", {
                    title: "Registro",
                    success: "Usuario registrado exitosamente.",
                    error: "",
                });
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(html);
            } catch (error) {
                if (error.message.includes("UNIQUE constraint failed")) {
                    const html = render("registro.html", {
                        title: "Registro",
                        error: "El correo o el RUT ya están registrados.",
                        success: "",
                    });
                    res.writeHead(400, { "Content-Type": "text/html" });
                    res.end(html);
                } else {
                    const html = render("registro.html", {
                        title: "Registro",
                        error: "Error al registrar usuario. Intenta nuevamente.",
                        success: "",
                    });
                    res.writeHead(500, { "Content-Type": "text/html" });
                    res.end(html);
                }
            }
        });
    }
}

module.exports = AuthController;

