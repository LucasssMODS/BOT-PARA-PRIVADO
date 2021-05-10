const { WAConnection } = require("@adiwajshing/baileys")
const chalk = require('chalk')
const fs = require("fs")

const vinicius = new WAConnection()
exports.vinicius = vinicius

exports.connect = async() => {
    console.log(chalk.whiteBright('╭─── [ INICIALIZANDO ]'))
    let auth = './vinicius.json'
    vinicius.logger.level = 'warn'
    vinicius.on("qr", () => {
        console.log(`Escaneia !`)
    })
    fs.existsSync(auth) && vinicius.loadAuthInfo(auth)
    vinicius.on('connecting', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Conectando..."))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Obtendo Conecção IP..."))
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[STATUS]"), chalk.whiteBright("Verificando Dados..."))
    })
    vinicius.on('open', () => {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[WA]"), chalk.whiteBright("Sua VER Do WhatsApp : " + vinicius.user.phone.wa_version))
        const authInfo = vinicius.base64EncodedAuthInfo()
        fs.writeFileSync(auth, JSON.stringify(authInfo, null, '\t'))
    })
    await vinicius.connect({ timeoutMs: 30 * 1000 })
    return vinicius
}