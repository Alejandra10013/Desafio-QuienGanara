const axios = require("axios");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const nuevoUsuario = async () => {
    try {
        const { data } = await axios.get("http://randomuser.me/api")
        const usuario = data.results[0];
        const user = {
            id: uuid().slice(30),
            correo: usuario.email,
            nombre: `${usuario.name.title} ${usuario.name.first} ${usuario.name.last}`,
            foto: usuario.picture.large,
            pais: usuario.location.country,
        }
        return user
    } catch (error) {
        throw error;
    }
}

const guardarUsuario = (usuario) => {
    const usuariosJSON =  JSON.parse(fs.readFileSync("usuarios.json", "utf8"));
    usuariosJSON.usuarios.push(usuario);
    fs.writeFileSync("usuarios.json", JSON.stringify(usuariosJSON));
}

module.exports = { nuevoUsuario, guardarUsuario };