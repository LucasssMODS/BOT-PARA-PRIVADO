const { WAConnection } = require("@adiwajshing/baileys")
const chalk = require('chalk')
const fs = require("fs")

const client = new WAConnection()
exports.client = client

exports.connect = async() => {
    console.log(chalk.whiteBright('╭─── [ INICIALIZANDO ]'))
    let auth = './client.json'
    client.logger.level = 'warn'
    client.on("qr", () => {
        console.log(`Escaneia !`)
    })
    fs.existsSync(auth) && client.loadAuthInfo(auth)
    client.on('connecting', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Conectando..."))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Obtendo Conecção IP..."))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Verificando Dados..."))
    })
    client.on('open', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[WA]"), chalk.whiteBright("Sua VER Do WhatsApp : " + client.user.phone.wa_version))
        const authInfo = client.base64EncodedAuthInfo()
        fs.writeFileSync(auth, JSON.stringify(authInfo, null, '\t'))
    })
    await client.connect({ timeoutMs: 30 * 1000 })
    return client
}