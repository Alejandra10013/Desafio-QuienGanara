const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "-",
        pass: "-",
    }
})

const send = async (ganador, correos, premio) => {
    let mailOptions = {
        from: "-",
        to: ["-"].concat(correos),
        subject: `${ganador.nombre} ha ganado`,
        html: `<h1>Anuncio: El ganador de ¿Quien Ganará? es ${ganador.nombre} y ha ganado: ${premio}. <br/>Gracias por Participar en el concurso.</h1>`
    }
    try {
        const result = await transporter.sendMail(mailOptions)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = { send };
