const http = require("http");
const fs = require("fs");
const { nuevoUsuario, guardarUsuario } = require("./usuarios");
const { send } = require("./correo")

http.createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
        res.setHeader("Content-type", "text/html")
        res.end(fs.readFileSync("index.html", "utf8"));
    }

    if (req.url.startsWith("/usuario") && req.method == "POST") {
        nuevoUsuario()
            .then(async (usuario) => {
                guardarUsuario(usuario)
                res.end(JSON.stringify(usuario))
            })
            .catch(error => {
                res.statusCode = 500;
                res.end();
                console.log("Error en el resultado de usuario random", error);
            });
    }

    if (req.url.startsWith("/usuarios") && req.method == "GET") {
        res.setHeader("Content-type", "application/json")
        res.end(fs.readFileSync("usuarios.json", "utf8"))
    }

    if (req.url.startsWith("/premio") && req.method == "GET") {
        res.setHeader("Content-type", "application/json")
        res.end(fs.readFileSync("premio.json", "utf8"))
    }

    if (req.url.startsWith("/premio") && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString();
        })
        req.on("end", () => {
            const nuevoPremio = JSON.parse(body);
            fs.writeFile("premio.json", JSON.stringify(nuevoPremio), (err) => {
                err ? console.log("no..") : console.log("Ok")
                res.end("Premio editado con exito")
            })
        })
    }

    if (req.url.startsWith("/ganador") && req.method == "GET") {
        const premio = JSON.parse(fs.readFileSync("premio.json", "utf8")).nombre
        const usuarios = JSON.parse(fs.readFileSync("usuarios.json", "utf8")).usuarios
        const correos = usuarios.map((u) => u.correos)
        const total = usuarios.length
        const ganador = usuarios[Math.floor(Math.random() * (total - 0)) + 0]
        send(ganador, correos, premio).then(() => {
            res.end(JSON.stringify(ganador));
        }).catch(e => {
            res.statusCode = 500
            res.end()
            console.log("Error en el envio de correos electronicos", e);
        })
        res.end(JSON.stringify(ganador))
    }

}).listen(3000, console.log("server on! http://localhost:3000"));