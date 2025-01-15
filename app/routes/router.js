const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");

const rutas = (req, res) => {
    try {
        // Ruta de inicio
        if (req.url === "/" && req.method === "GET") {
            const html = render("index.html", { title: "Inicio" });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
            return;
        }

        // Rutas de autenticación
        if (req.url === "/auth/login" && req.method === "GET") { // El GET significa que se está solicitando la página de inicio de sesión
            return AuthController.getLogin(req, res); // Se llama al método getLogin del controlador de autenticación
        }
        if (req.url === "/auth/login" && req.method === "POST") { // EL POST significa que se está enviando el formulario de inicio de sesión
            return AuthController.postLogin(req, res); // Se llama al método postLogin del controlador de autenticación
        }
        if (req.url === "/auth/registro" && req.method === "GET") {
            return AuthController.getRegister(req, res);
        }
        if (req.url === "/auth/registro" && req.method === "POST") {
            return AuthController.postRegister(req, res);
        }

        // Ruta del perfil
        if (req.url === "/perfil" && req.method === "GET") {
            return AuthController.getProfile(req, res);
        }

        // Ruta no encontrada
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(render("404.html", { title: "Página no encontrada" }));
    } catch (error) {
        console.error("Error en el router:", error.message);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error interno del servidor");
        }
    }
};

module.exports = rutas; // Se exporta la función rutas para que pueda ser utilizada en otros archivos
