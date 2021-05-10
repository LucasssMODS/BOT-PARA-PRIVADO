///////////////////////////////////////////////////
//  POR FAVOR LEIA //
// NÂO RETIRE OS CRÉDITOS!!!, 
//Foi muito Desgastante Fazer isso/Adaptar,
// Deixe pelo menos meu nome (Vinicius)
// Ou meu Contato!
// Atenciosamente, Criador. wa.me/558183064666
///////////////////////////////////////////////////
const { WAConnection, MessageType, Presence, MessageOptions, Mimetype, WALocationMessage, WA_MESSAGE_STUB_TYPES, ReconnectMode, ProxyAgent, GroupSettingChange, ChatModification, waChatKey, WA_DEFAULT_EPHEMERAL, mentionedJid, processTime } = require("@adiwajshing/baileys")
const moment = require("moment-timezone");
const FormData = require('form-data')
const imageToBase64 = require('image-to-base64');
const speed = require('performance-now');
const chalk = require('chalk');
const request = require('request');
const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const conn = require("./lib/connect")
const msg = require("./lib/message")
const wa = require("./lib/wa")
const Exif = require('./lib/exif');
const exif = new Exif();
const { recognize } = require('./lib/ocr');
const help = require("./lib/help")
const postBuffer = help.postBuffer
const getBuffer = help.getBuffer
const getRandom = help.getRandomExt
const postJson = help.postJson
const getJson = help.getJson
const config = JSON.parse(fs.readFileSync("./config.json"))
const owner = config.owner
const mods = config.mods
const public = config.public
const imagenye = JSON.parse(fs.readFileSync('./database/image.json'))

conn.connect()
const vinicius = conn.vinicius

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

fake = 'VINICIUS SELFBOT'
prefix = '!'
apikey = 'LindowApi'
hit_today = []

vinicius.on('CB:action,,call', async json => {
    const callerId = json[2][0][1].from;
    console.log("[BLOCK]"+ callerId)
        vinicius.sendMessage(callerId, "Não Ligue para Mim, sou um bot", MessageType.text)
        await sleep(4000)
        await vinicius.blockUser(callerId, "add")
})

vinicius.on('group-participants-update', async(chat) => {
    try {
        var member = chat.participants
        for (var x of member) {
            try {
                if (x == vinicius.user.jid) return
                var photo = await wa.getPictProfile(x)
                var username = await wa.getUserName(x) || "Guest"
                var from = chat.jid
                var group = await vinicius.groupMetadata(from)
                if (chat.action == 'add' && public) {
                     text = `${username}, Bem Vindo ${group.subject}!`
                        wa.sendImage(from, photo, text)
                }
                if (chat.action == 'remove' && public) {
                    text = `${username}, Xau 👋 kkkkkkkk`
                    await wa.sendMessage(from, text)
                }
            } catch {
                continue
            }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ERRO]"), chalk.keyword("red")(e))
    }
})

vinicius.on('chat-update', async(lin) => {
    try {
        if (!lin.hasNewMessage) return
        if (!lin.messages) return
        if (lin.key && lin.key.remoteJid == 'status@broadcast') return
        lin = lin.messages.all()[0]
        if (!lin.message) return
        const from = lin.key.remoteJid
        const type = Object.keys(lin.message)[0]
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        const quoted = type == 'extendedTextMessage' && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
        const typeQuoted = Object.keys(quoted)[0]
        const body = lin.message.conversation || lin.message[type].caption || lin.message[type].text || ""
        chats = (type === 'conversation') ? lin.message.conversation : (type === 'extendedTextMessage') ? lin.message.extendedTextMessage.text : ''
        budy = (type === 'conversation' && lin.message.conversation.startsWith(prefix)) ? lin.message.conversation : (type == 'imageMessage') && lin.message.imageMessage.caption.startsWith(prefix) ? lin.message.imageMessage.caption : (type == 'videoMessage') && lin.message.videoMessage.caption.startsWith(prefix) ? lin.message.videoMessage.caption : (type == 'extendedTextMessage') && lin.message.extendedTextMessage.text.startsWith(prefix) ? lin.message.extendedTextMessage.text : ''

        if (prefix != "") {
            if (!body.startsWith(prefix)) {
                cmd = false
                comm = ""
            } else {
                cmd = true
                comm = body.slice(1).trim().split(" ").shift().toLowerCase()
            }
        } else {
            cmd = false
            comm = body.trim().split(" ").shift().toLowerCase()
        }

        const reply = async(teks) => {
            await vinicius.sendMessage(from, teks, MessageType.text, { quoted: lin })
        }

        const command = comm
        hit_today.push(command)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = cmd
        const meNumber = vinicius.user.jid
        const botNumber = vinicius.user.jid.split("@")[0]
        const isGroup = from.endsWith('@g.us')
        const arg = chats.slice(command.length + 2, chats.length)
        const sender = lin.key.fromMe ? vinicius.user.jid : isGroup ? lin.participant : lin.key.remoteJid
        const senderNumber = sender.split("@")[0]
        const groupMetadata = isGroup ? await vinicius.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? await wa.getGroupAdmins(groupMembers) : []
        const isAdmin = groupAdmins.includes(sender) || false
        const botAdmin = groupAdmins.includes(vinicius.user.jid)
        const totalChat = vinicius.chats.all()
        const itsMe = senderNumber == botNumber
        const isOwner = senderNumber == owner || senderNumber == botNumber || mods.includes(senderNumber)
        const mentionByTag = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
        const mentions = (teks, memberr, id) => {
	    (id == null || id == undefined || id == false) ? vinicius.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : vinicius.sendMessage(from, teks.trim(), extendedText, {quoted: lin, contextInfo: {"mentionedJid": memberr}})}
        const isImage = type == 'imageMessage'
        const isVideo = type == 'videoMessage'
        const isAudio = type == 'audioMessage'
        const isSticker = type == 'stickerMessage'
        const isContact = type == 'contactMessage'
        const isLocation = type == 'locationMessage'
        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
        typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"
        const isQuoted = type == 'extendedTextMessage'
        const isQuotedImage = isQuoted && typeQuoted == 'imageMessage'
        const isQuotedVideo = isQuoted && typeQuoted == 'videoMessage'
        const isQuotedAudio = isQuoted && typeQuoted == 'audioMessage'
        const isQuotedSticker = isQuoted && typeQuoted == 'stickerMessage'
        const isQuotedContact = isQuoted && typeQuoted == 'contactMessage'
        const isQuotedLocation = isQuoted && typeQuoted == 'locationMessage'

        if (!public) {
            mods.indexOf(botNumber) === -1 ? mods.push(botNumber) : false
            mods.indexOf(owner) === -1 ? mods.push(owner) : false
            if (!mods.includes(senderNumber)) return
            mods.slice(mods.indexOf(owner), 1)
        }
        if (!isGroup && isGroup && !isCmd) console.log(chalk.keyword("aqua")("[RECV]"), chalk.whiteBright(typeMessage), chalk.greenBright("DE"), chalk.keyword("yellow")(senderNumber))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[EXEC]"), chalk.whiteBright(typeMessage), chalk.greenBright("DE"), chalk.keyword("yellow")(senderNumber))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[EXEC]"), chalk.whiteBright(typeMessage), chalk.greenBright("DE"), chalk.keyword("yellow")(senderNumber), chalk.greenBright("EM"), chalk.keyword("yellow")(groupName))
        switch (command) {
            case 'help':
                textnya = `
_*ViniciusBOT - GDRDEV*_

*Informações:*
_Versão 1.1.0_
Contato Criador: https://wa.me/558183064666
Base: ViniciusBOT SELF
API: https://api-gdr.herokuapp.com
\n
╿
̑ͮͫͭͥͦͣ̔͒͑͑̅͊́͋͊͗͑̓̍̽ͬ̋̎̓ͧ͂̊̉ͣ̉ͩ̀̈̏̍ͭ̒͒͂̍̇̐̿ͨͦ̑͑̃̎͒̋͌̌̈́ͩ̔ͩ̉̿̐ͭ̂͛͊ͩ̔͋ͭͩ͑̆̇͊ͫ̃͋̋ͪͦ͐̈́͗ͭ̒̐̿̃͂́̅̉͊ͧͫ̔̄̿̓́̀̄̾ͨ̍ͨͩͩͮ̑ͭͧͦͣ̽̃͛̔̇ͣ̂͗ͪ͛̈́̆ͮͧ̈̔́͛́͊̇͒ͭ̓ͬ̅̑̊ͩ͆̌ͩ͑̒͊ͭ̀̃̏̅̏ͦͣ̏̿ͬ͂̿ͣ́̓͌ͥ̍ͦ̊̄̆̿̿̈́̅̄̐̎͌͋ͦ͋͂ͨ̂̈͂̉̈́̀̒̃̈́͂̃ͤͪ̎͋̆ͤ̽̇ͩ̑ͨ̽͊ͦͩ̓̎̑̎̆̉ͮ̄͑̆͌ͨ̓̀̋ͤͥͯ͋͑ͧ̆̋ͨͯ̔̑̽͗ͬ͒̀̓͐ͯ̏͆̏ͣ̌͌ͩ̏́̈͂̃͋͛̔ͣ̓̓̇̉ͪͩͯ͛̍͑ͯͨͫͯ̔ͯ̾̓͊͐ͯ̑̌̋̽̈́̏̒ͭ͗̐̇͛̅̍̒̐͌͛̿ͧ͐ͭͣͭ͌̋ͩ̄͌̍̎̽̍ͪ̿ͮͦ͐ͮͪ̇̒͛ͬͦ̏̐̀͊ͮ̓̀͂́͋̾̄̃̐̅̍̉ͫ͂͐̄͗̆̽ͩ̾̾ͤͦ̽̏ͫ̄̓ͫ̍̔ͣ̾̍̍͛ͩ̆ͫ́ͭ͛̂̒ͣ̆̏͌̄ͬ̃̎ͧͧͯ̐ͫ̓̽͆ͪ̚̚̚̚̚ 
̑ͮͫͭͥͦͣ̔͒͑͑̅͊́͋͊͗͑̓̍̽ͬ̋̎̓ͧ͂̊̉ͣ̉ͩ̀̈̏̍ͭ̒͒͂̍̇̐̿ͨͦ̑͑̃̎͒̋͌̌̈́ͩ̔ͩ̉̿̐ͭ̂͛͊ͩ̔͋ͭͩ͑̆̇͊ͫ̃͋̋ͪͦ͐̈́͗ͭ̒̐̿̃͂́̅̉͊ͧͫ̔̄̿̓́̀̄̾ͨ̍ͨͩͩͮ̑ͭͧͦͣ̽̃͛̔̇ͣ̂͗ͪ͛̈́̆ͮͧ̈̔́͛́͊̇͒ͭ̓ͬ̅̑̊ͩ͆̌ͩ͑̒͊ͭ̀̃̏̅̏ͦͣ̏̿ͬ͂̿ͣ́̓͌ͥ̍ͦ̊̄̆̿̿̈́̅̄̐̎͌͋ͦ͋͂ͨ̂̈͂̉̈́̀̒̃̈́͂̃ͤͪ̎͋̆ͤ̽̇ͩ̑ͨ̽͊ͦͩ̓̎̑̎̆̉ͮ̄͑̆͌ͨ̓̀̋ͤͥͯ͋͑ͧ̆̋ͨͯ̔̑̽͗ͬ͒̀̓͐ͯ̏͆̏ͣ̌͌ͩ̏́̈͂̃͋͛̔ͣ̓̓̇̉ͪͩͯ͛̍͑ͯͨͫͯ̔ͯ̾̓͊͐ͯ̑̌̋̽̈́̏̒ͭ͗̐̇͛̅̍̒̐͌͛̿ͧ͐ͭͣͭ͌̋ͩ̄͌̍̎̽̍ͪ̿ͮͦ͐ͮͪ̇̒͛ͬͦ̏̐̀͊ͮ̓̀͂́͋̾̄̃̐̅̍̉ͫ͂͐̄͗̆̽ͩ̾̾ͤͦ̽̏ͫ̄̓ͫ̍̔ͣ̾̍̍͛ͩ̆ͫ́ͭ͛̂̒ͣ̆̏͌̄ͬ̃̎ͧͧͯ̐ͫ̓̽͆ͪ̚̚̚̚̚ 
*~
̑ͮͫͭͥͦͣ̔͒͑͑̅͊́͋͊͗͑̓̍̽ͬ̋̎̓ͧ͂̊̉ͣ̉ͩ̀̈̏̍ͭ̒͒͂̍̇̐̿ͨͦ̑͑̃̎͒̋͌̌̈́ͩ̔ͩ̉̿̐ͭ̂͛͊ͩ̔͋ͭͩ͑̆̇͊ͫ̃͋̋ͪͦ͐̈́͗ͭ̒̐̿̃͂́̅̉͊ͧͫ̔̄̿̓́̀̄̾ͨ̍ͨͩͩͮ̑ͭͧͦͣ̽̃͛̔̇ͣ̂͗ͪ͛̈́̆ͮͧ̈̔́͛́͊̇͒ͭ̓ͬ̅̑̊ͩ͆̌ͩ͑̒͊ͭ̀̃̏̅̏ͦͣ̏̿ͬ͂̿ͣ́̓͌ͥ̍ͦ̊̄̆̿̿̈́̅̄̐̎͌͋ͦ͋͂ͨ̂̈͂̉̈́̀̒̃̈́͂̃ͤͪ̎͋̆ͤ̽̇ͩ̑ͨ̽͊ͦͩ̓̎̑̎̆̉ͮ̄͑̆͌ͨ̓̀̋ͤͥͯ͋͑ͧ̆̋ͨͯ̔̑̽͗ͬ͒̀̓͐ͯ̏͆̏ͣ̌͌ͩ̏́̈͂̃͋͛̔ͣ̓̓̇̉ͪͩͯ͛̍͑ͯͨͫͯ̔ͯ̾̓͊͐ͯ̑̚̚̚̚̚�​  
\n
*Comandos*
┇─ *${prefix}publico*
┇─ *${prefix}self*
┇─ *${prefix}setprefix*
┇─ *${prefix}bc*
┇─ *${prefix}setthumb*
┇─ *${prefix}status*
┇─ *${prefix}bloquear*
┇─ *${prefix}desbloquear*
┇─ *${prefix}entrar*
┇─ *${prefix}hidetag*
┇─ *${prefix}stickertag*
┇─ *${prefix}promover*
┇─ *${prefix}despromover*
┇─ *${prefix}linkgrupo*
┇─ *${prefix}abrirgrp*
┇─ *${prefix}fechargrp*
┇─ *${prefix}mudardesc*
┇─ *${prefix}pegartexto*
┇─ *${prefix}toimage*
┇─ *${prefix}adicionar*
┇─ *${prefix}banir*
┇─ *${prefix}chat*
┇─ *${prefix}fakereply*
┇─ *${prefix}lertudo*
┇─ *${prefix}mutar*
┇─ *${prefix}desmutar*
┇─ *${prefix}arquivar*
┇─ *${prefix}desarquivar*
┇─ *${prefix}term*
┇─ *${prefix}setreply*
┇─ *${prefix}setbio*
┇─ *${prefix}getpic*
┇─ *${prefix}getbio*
┇─ *${prefix}sticker*
┇─ *${prefix}tinyurl*
┇─ *${prefix}semprefixo*
┇─ *${prefix}ytmp3*
┇─ *${prefix}play*
┇─ *${prefix}ytmp4*
┇Adicionar Fotos ao Sistema
┇
┇─*${prefix}addimagem*
┇─*${prefix}listaimagem*
┇─*${prefix}pegarimagem*
`
            wa.fakeStatusForwarded(from, textnya, fake)
                break			
            case 'ytmp3':
                yt = await axios.get(`https://api-gdr.herokuapp.com/api/yta?url=${body.slice(7)}`)
                var { ext, filesize, result, thumb, title } = yt.data
                foto = await getBuffer(thumb)
                if (Number(filesize.split(' MB')[0]) >= 30.00) return vinicius.sendMessage(from, foto, MessageType.image, {caption: `Title : ${title}\n\nExt : ${ext}\nLink : ${result}\n\nPassou de 30mb n baixo, é podcast?`})
                cap = `Ytmp3 downloader\n\nTitle : ${title}\n\nExt : ${ext}\n\nFilesize : ${filesize}`
                vinicius.sendMessage(from, foto, MessageType.image, {caption: cap})
                au = await getBuffer(result)
                vinicius.sendMessage(from, au, MessageType.audio, {mimetype: 'audio/mp4', filename: `${title}.mp3`, quoted: lin})
                break
            case 'play':
                yta = await axios.get(`https://api.zeks.xyz/api/ytplaymp3?apikey=apivinz&q=${body.slice(6)}`)
                var { size, url_audio, thumbnail, title } = yta.data
                foto = await getBuffer(thumbnail)
                cap = `YT PLAY downloader\n\nTitulo : ${title}\nTamanho : ${size}`
                vinicius.sendMessage(from, foto, MessageType.image, {caption: cap})
                au = await getBuffer(url_audio)
                vinicius.sendMessage(from, au, MessageType.audio, {mimetype: 'audio/mp4', filename: `${title}.mp3`, quoted: lin})
                break
            case 'ytmp4':
                yt = await axios.get(`https://api-gdr.herokuapp.com/api/ytv?url=${body.slice(7)}`)
                var { ext, filesize, result, thumb, title } = yt.data
                foto = await getBuffer(thumb)
                if (Number(filesize.split(' MB')[0]) >= 30.00) return vinicius.sendMessage(from, foto, MessageType.image, {caption: `Title : ${title}\n\nExt : ${ext}\n\n\nLink : ${result}\n\nMto Grande! Baixe Manual`})
                cap = `YTMP4 DOWNLOADER\n\nTitulo : ${title}\n\nTipo : ${ext}\n\nTamanho : ${filesize}`
                vinicius.sendMessage(from, foto, MessageType.image, {caption: cap})
                au = await getBuffer(result)
                vinicius.sendMessage(from, au, MessageType.video, {mimetype: 'video/mp4', filename: `${title}.mp4`, quoted: lin, caption: `${title}`})
                break
            case 'igstalk':
                anu = await axios.get(`https://api-gdr.herokuapp.com/api/stalk?username=${body.slice(9)}`)
                var { Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, name, Profile_pic } = anu.data
                imgig = await getBuffer(Profile_pic)
                text = `IG STALKER\n\nNome: ${name}\nTem ${Jumlah_Following} Seguindo\nSegue ${Jumlah_Followers}\nTem ${Jumlah_Post}\nBIO: ${Biodata}`
                vinicius.sendMessage(from, imgig, MessageType.imagen, {caption: text})
                break
            case 'wikipedia':
                q = body.slice(11)
                wiki = await axios.get(`https://api-gdr.herokuapp.com/api/wiki?q=${q}`)
                reply(`De ${q}\nResultado:\n${wiki.result}`)
                break
            case 'semprefixo':
                prefix = ''
                reply('succes')
                break
            case 'tinyurl':
                url = args.join(" ")
                request(`https://tinyurl.com/api-create.php?url=${url}`, function (error, response, body) {
                try {
                    reply(body)
                  } catch (e) {
                    reply(e)
                  }
                })
                break
            case 'listaimagem':
	        teks = '*Lista Imagens :*\n\n'
                for (let awokwkwk of imagenye) {
		teks += `- ${awokwkwk}\n`
		}
		teks += `\n*Total : ${imagenye.length}*`
		vinicius.sendMessage(from, teks.trim(), extendedText, { quoted: lin, contextInfo: { "mentionedJid": imagenye } })
		break
            case 'pegarimagem':
		namastc = body.slice(10)
		buffer = fs.readFileSync(`./lib/image/${namastc}.jpeg`)
		vinicius.sendMessage(from, buffer, MessageType.image, {quoted: {
                    key: {
                        fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? {
                        remoteJid: "status@broadcast"
                        }: {})
                    }, message: { conversation: `Resultado : ${namastc}.jpg` }}})
		break
            case 'addimagem':
	        if (!isQuotedImage) return reply('reply imagem!')
	        svst = body.slice(10)
		if (!svst) return reply('bota um nome na img!')
	        boij = JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                delb = await vinicius.downloadMediaMessage(boij)
		imagenye.push(`${svst}`)
	        fs.writeFileSync(`./lib/image/${svst}.jpeg`, delb)
		fs.writeFileSync('./database/image.json', JSON.stringify(imagenye))
		    reply(`Succeso ao Adicionar \n${prefix}listimage to view`)
		break
            case 'stickername':
	        if (!isQuotedSticker) return reply(`Reaja a um Sticker Mencionando *${prefix}takestick nama|author*`)
		const pembawm = body.slice(11)
		if (!pembawm.includes('|')) return reply(`Reply sticker dengan caption *${prefix}takestick nama|author*`)
                const encmedia = JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                const media = await vinicius.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname = pembawm.split('|')[0]
	        const author = pembawm.split('|')[1]
		    exif.create(packname, author, `takestick_${sender}`)
		    exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
		    if (error) return reply('error')
		    wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)
		    fs.unlinkSync(`./sticker/takestick_${sender}.exif`)
		})
		break
            case 'scdl':
                var url = budy.slice(6)
                var res = await axios.get(`https://lindow-api.herokuapp.com/api/dlsoundcloud?url=${url}&apikey=${apikey}`)
                var { title, result } = res.data
                thumbb = await getBuffer(`${res.data.image}`)
                vinicius.sendMessage(from, thumbb, MessageType.image, {caption: `${title}`})
                    audiony = await getBuffer(result)
                    vinicius.sendMessage(from, audiony, MessageType.audio, {mimetype: 'audio/mp4', filename: `${title}.mp3`, quoted: lin})
                break
            case 'randomaesthetic':
                    url = `https://lindow-api.herokuapp.com/api/randomaesthetic?apikey=${apikey}`
                    estetik = await getBuffer(url)
                    vinicius.sendMessage(from, estetik, MessageType.video, {mimetype: 'video/mp4', filename: `estetod.mp4`, quoted: lin, caption: 'success'})
                break
            case 'swm':
	    case 'stickerwm':
	        if (isMedia && !lin.message.videoMessage || isQuotedImage) {
		if (!arg.includes('|')) return reply(`Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`)
		const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await vinicius.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = arg.split('|')[0]
		const author1 = arg.split('|')[1]
		exif.create(packname1, author1, `stickwm_${sender}`)
		    await ffmpeg(`${media}`)
		    .input(media)
		    .on('start', function (cmd) {
		        console.log(`Iniciei : ${cmd}`)
		    })
		    .on('error', function (err) {
		    console.log(`Erro : ${err}`)
		fs.unlinkSync(media)
		reply('error')
		})
		.on('end', function () {
		console.log('Finalizado')
		exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
	        if (error) return reply('error')
	        wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)	
		    fs.unlinkSync(`./sticker/${sender}.webp`)	
		    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
		    })
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(`./sticker/${sender}.webp`)
		} else if ((isMedia && lin.message.videoMessage.fileLength < 10000000 || isQuotedVideo && lin.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
		if (!arg.includes('|')) return reply(`Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`)
		const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await vinicius.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = arg.split('|')[0]
		const author1 = arg.split('|')[1]
		    exif.create(packname1, author1, `stickwm_${sender}`)
		    reply('wait')
		    await ffmpeg(`${media}`)
		        .inputFormat(media.split('.')[4])
			.on('start', function (cmd) {
			console.log(`Iniciei : ${cmd}`)
		    })
		    .on('error', function (err) {
		    console.log(`Erro : ${err}`)
		        fs.unlinkSync(media)
			tipe = media.endsWith('.mp4') ? 'video' : 'gif'
			reply('error')
		    })
		    .on('end', function () {
		    console.log('Finalizado')
		        exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
			if (error) return reply('error')
			wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)									
			fs.unlinkSync(media)
			fs.unlinkSync(`./sticker/${sender}.webp`)
			fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
			})
		    })
		    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		    .toFormat('webp')
		    .save(`./sticker/${sender}.webp`)
		} else {
		reply(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
	        }
		break
            case 'sticker':
	    case 'stiker':
	    case 's':
		if (isMedia && !lin.message.videoMessage || isQuotedImage) {
		const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await vinicius.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		await ffmpeg(`${media}`)
		.input(media)
		.on('start', function (cmd) {
	        console.log(`Iniciei : ${cmd}`)
		})
		.on('error', function (err) {
		console.log(`Erro : ${err}`)
  		fs.unlinkSync(media)
		reply('error')
		})
		.on('end', function () {
		console.log('Finalizado')
		exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => { 
                if (error) return reply('error')
		    wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)	
		    fs.unlinkSync(`./sticker/${sender}.webp`)	
		    })
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(`./sticker/${sender}.webp`)
		} else if ((isMedia && lin.message.videoMessage.fileLength < 10000000 || isQuotedVideo && lin.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
		    const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		    const media = await vinicius.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		    reply('wait')
			await ffmpeg(`${media}`)
			.inputFormat(media.split('.')[4])
			.on('start', function (cmd) {
			console.log(`Iniciei a Figurinha : ${cmd}`)
		})
		.on('error', function (err) {
		console.log(`Erro: ${err}`)
		    fs.unlinkSync(media)
		    tipe = media.endsWith('.mp4') ? 'video' : 'gif'
		    reply('error')
		})
		.on('end', function () {
		console.log('Finalizado')
		exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
		if (error) return reply('error')
	            wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)
		    fs.unlinkSync(`./sticker/${sender}.webp`)
		    })
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(`./sticker/${sender}.webp`)
	        } else {
		reply(`Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
		}
	        break
            case 'getbio':
                var yy = lin.message.extendedTextMessage.contextInfo.mentionedJid[0]
                var p = await vinicius.getStatus(`${yy}`, MessageType.text)
                reply(p.status)
                if (p.status == 401) {
                reply("Não Achei")
                }
                break
	   case 'getpic':
		if (lin.message.extendedTextMessage != undefined){
		mentioned = lin.message.extendedTextMessage.contextInfo.mentionedJid
	        try {
		    pic = await vinicius.getProfilePicture(mentioned[0])
		} catch {
		    pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
		}
		thumb = await getBuffer(pic)
		vinicius.sendMessage(from, thumb, MessageType.image, {caption: 'successo'})
	        }
		break
            case 'fdeface': 
		var nn = budy.slice(9)
                var urlnye = nn.split("|")[0];
                var titlenye = nn.split("|")[1];
	        var descnye = nn.split("|")[2];
                run = getRandom('.jpeg')
                var media1 = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo : lin
                var media2 = await vinicius.downloadAndSaveMediaMessage(media1)
                var ddatae = await imageToBase64(JSON.stringify(media2).replace(/\"/gi, ''))
                vinicius.sendMessage(from, {
                    text: `${urlnye}`,
                    matchedText: `${urlnye}`,
                    canonicalUrl: `${urlnye}`,
                    description: `${descnye}`,
                    title: `${titlenye}`,
                    jpegThumbnail: ddatae }, 'extendedTextMessage', { detectLinks: false })
		break
            case 'setbio':
	        if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
		if (!arg) return reply('bio')
	        wa.setBio(arg)
	        .then((res) => wa.sendFakeStatus2(from, JSON.stringify(res), fake))
		.catch((err) => wa.sendFakeStatus2(from, JSON.stringify(err), fake))
		break
            case 'setname':
		if (!itsMe) return reply('Apenas meu dono')
	        if (!arg) return reply('masukkan nama')
		wa.setName(arg)
		.then((res) => wa.sendFakeStatus2(from, JSON.stringify(res), fake))
		.catch((err) => wa.sendFakeStatus2(from, JSON.stringify(err), fake))
	        break
            case 'term':
	        if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
		if (!arg) return
		exec(arg, (err, stdout) => {
		    if (err) return wa.sendFakeStatus2(from, err, fake)
		    if (stdout) wa.sendFakeStatus2(from, stdout, fake)
		})
		break
            case 'speed': 
            case 'ping':
		let timestamp = speed();
		let latensi = speed() - timestamp
		wa.sendFakeStatus2(from, `Velocidade do *ViniciusBOT:* ${latensi.toFixed(4)} Segundos`, fake)
		break
            case 'runtime':
		run = process.uptime()
		let text = msg.runtime(run)
	        wa.sendFakeStatus2(from, MessageType.text,`TEMPO ON-LINE`)
		break
            case 'desarquivar':
                if (!itsMe) return reply('Apenas meu dono pode usar isso')
                reply('*succes unarchive all chat*')
                anu = await vinicius.chats.all()
                for (let _ of anu) {
                vinicius.modifyChat(_.jid, ChatModification.unarchive)
                }
                break
            case 'arquivar':
                if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
                reply('*okey wait..*')
                await sleep(3000)
                vinicius.modifyChat(from, ChatModification.archive)
                break
            case 'deletarchat':
                if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
                reply('*Pronto*')
                await sleep(4000)
                vinicius.modifyChat(from, ChatModification.delete)
                break
            case 'mute':
                if (!itsMe) return reply('Só pd ser usado pelo meu dono')
                vinicius.modifyChat(from, ChatModification.mute, 24*60*60*1000)
                reply('*succes mute this chat*')
                break
            case 'unmute':
                if (!itsMe) return reply('Apenas meu dono')
                vinicius.modifyChat(from, ChatModification.unmute)
                reply('*succes unmute this chat*')
                break
            case 'upstory':
                if (!itsMe) return reply('Apenas meu dono')
                var teks = body.slice(9)
                vinicius.sendMessage('status@broadcast', teks, text)
                    reply('succses')
                break
            case 'deslertudo':
                if (!itsMe) return reply('Apenas meu dono')
                var chats = await vinicius.chats.all()
                chats.map( async ({ jid }) => {
                await vinicius.chatRead(jid, 'unread')
                    })
		    var teks = `\`\`\`Successfully unread ${chats.length} chats !\`\`\``
		    await vinicius.sendMessage(from, teks, MessageType.text, {quoted: lin})
		    console.log(chats.length)
	        break
            case 'lertudo':
                if (!itsMe) return reply('Apenas meu dono')
                var chats = await vinicius.chats.all()
                chats.map( async ({ jid }) => {
                await vinicius.chatRead(jid)
                })
		var teks = `\`\`\`Pronto li ${chats.length} chats !\`\`\``
	        await vinicius.sendMessage(from, teks, MessageType.text, {quoted: lin})
		console.log(chats.length)
		break
            case 'fakereply':
		if (!args) return reply(`Usa :\n${prefix}fakereply [numero/msg/suamsg]]\n\nEx : \n${prefix}fakereply 0|oi|oi juga`)
		var ghh = budy.slice(11)
		var nomorr = ghh.split("|")[0];
	        var target = ghh.split("|")[1];
		var bot = ghh.split("|")[2];
	            vinicius.sendMessage(from, `${bot}`, MessageType.text, {quoted: { key: { fromMe: false, participant: nomorr+'@s.whatsapp.net', ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target}` }}})
                break
            case 'tagall':
                if (!isAdmin) return reply('only for admin group')
                members_id = []
		        teks = (args.length > 1) ? budy.slice(8).trim() : ''
	            teks += '\n\n'
	            for (let mem of groupMembers) {
		            teks += `┣➥ @${mem.jid.split('@')[0]}\n`
		            members_id.push(mem.jid)
		        }
		        mentions(teks, members_id, true)
		        break
            case 'chat':
                if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
                var pc = budy.slice(6)
                var nomor = pc.split("|")[0];
                var org = pc.split("|")[1];
                vinicius.sendMessage(nomor+'@s.whatsapp.net', org, MessageType.text)   
                reply('done..')
                break
            case 'setpp':
                if (!itsMe) return reply('Esse BOT é Self TLGD Né?')
                vinicius.updatePresence(from, Presence.composing) 
                if (!isQuotedImage) return reply(`Kirim gambar dengan caption ${prefix}setpp atau tag gambar yang sudah dikirim`)
	        var media1 = JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo
		var media2 = await vinicius.downloadAndSaveMediaMessage(media1)
	        await vinicius.updateProfilePicture(meNumber, media2)
		reply('Done!')
	        break
            case 'banir':
                if (!isAdmin) return reply('Apenas Admins admin')
	        if (!args) return reply(`Assim ${prefix}kick @tag`)
                if (lin.message.extendedTextMessage != undefined){
                mentioned = lin.message.extendedTextMessage.contextInfo.mentionedJid
		await wa.FakeTokoForwarded(from, `Bye...`, fake)
		    wa.kick(from, mentioned)
		} else {
	        await wa.FakeTokoForwarded(from, `Bye...`, fake)
		wa.kick(from, [args[0] + '@s.whatsapp.net'])
		}
		break
            case 'adicionar':
                if (!isAdmin) return reply('only for admin group')
		if (!args) return reply(`Usa: ${prefix}add 628xxxx`)
		wa.add(from, [args[0] + '@s.whatsapp.net'])
                wa.FakeTokoForwarded(from, `Sukses`, fake)
                break
            case 'shutdown':
                if (!itsMe) return reply('Apenas meu donoa')
	            await wa.FakeTokoForwarded(from, `Bye...`, fake)
		        await sleep(5000)
                vinicius.close()
		        break
            case 'pegartexto': 
	        if ((isMedia && !lin.message.videoMessage || isQuotedImage) && args.length == 0) {
	    	var media1 = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo : lin
                var media2 = await vinicius.downloadAndSaveMediaMessage(media1)
                reply("*waitt*")
	    	await recognize(media2, {lang: 'eng+ind', oem: 1, psm: 3})
		    .then(teks => {
		    reply(teks.trim())
		    fs.unlinkSync(media2)
		})
		.catch(err => {
		reply(err.message)
		fs.unlinkSync(media2)
		})
	        } else {
		reply(`Send image and reply with caption ${prefix}ocr`)
		}
	        break
            case 'demoteall':
                members_id = []
		for (let mem of groupMembers) {
	   	members_id.push(mem.jid)
	  	}
                vinicius.groupDemoteAdmin(from, members_id)
                break
            case 'publico':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (public) return await reply('already in public mode')
                config["public"] = true
                public = true
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
                await wa.sendFakeStatus(from, "*Success changed to public mode*", "Public : true")
                break
            case 'self':
                if (!isOwner && !itsMe) return await reply('Apenas meu dono or owner')
                if (!public) return await reply('mode private is already')
                config["public"] = false
                public = false
                fs.writeFileSync("./config.json", JSON.stringify(config, null, 4))
                await wa.sendFakeStatus(from, "*Success changed to self mode*", "Self : true")
                break
            case 'setprefix':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                var newPrefix = args[0] || ""
                prefix = newPrefix
                await reply("Success change prefix to: " + prefix)
                break
            case 'bc':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                text = args.join(" ")
                for (let chat of totalChat) {
                    await wa.sendMessage(chat.jid, text)
                }
                break
            case 'setthumb':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (!isQuotedImage && !isImage) return await reply('Gambarnya mana?')
                media1 = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                mediaa = await vinicius.downloadMediaMessage(media1)
                fs.writeFileSync(`./lib/image/foto.jpg`, mediaa)
                await wa.sendFakeStatus(from, "*Succes changed image for help image*", "success")
                break
            case 'status':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                texxt = await msg.stats(totalChat)
                await wa.sendFakeStatus(from, texxt, "BOT STATUS!")
                break
            case 'bloquear':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (isGroup) {
                    if (mentionUser.length == 0) return await reply("tag target!")
                    return await wa.blockUser(sender, true)
                }
                await wa.blockUser(sender, true)
                break
            case 'desbloquear':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (isGroup) {
                    if (mentionUser.length == 0) return await reply("Tag targer!")
                    return await wa.blockUser(sender, false)
                }
                await wa.blockUser(sender, false)
                break
            case 'sair':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                reply(`ADEEEUSS!`).then(async() => {
                    await help.sleep(3000)
                    await vinicius.groupLeave(from)
                })
                break
            case 'entrar':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (isGroup) return await reply('This command only for private chat')
                if (args.length == 0) return await reply('Link group?')
                var link = args[0].replace("https://chat.whatsapp.com/", "")
                await vinicius.acceptInvite(link)
                break
            case 'clearall':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                for (let chat of totalChat) {
                    await vinicius.modifyChat(chat.jid, "delete")
                }
                await wa.sendFakeStatus(from, "Success clear", "success")
                break

            case 'hidetag':
                if (!isOwner && !itsMe) return await reply('Apenas Meu Dono')
                if (!isAdmin && !isOwner && !itsMe) return await reply('Só pode ser usado por admin!!!')
                await wa.hideTag(from, args.join(" "))
                break
            case 'toimage':
	        if (!isQuotedSticker) return reply(`send sticker and reply with caption ${prefix}toimg`)
	        if (lin.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
		reply(`nan pd ser gif `)
	        } else {
		var media1 = JSON.parse(JSON.stringify(lin).replace('quotedM','m')).message.extendedTextMessage.contextInfo
	        var media2 = await vinicius.downloadAndSaveMediaMessage(media1)
		ran = getRandom('.png')
                exec(`ffmpeg -i ${media2} ${ran}`, (err) => {
		fs.unlinkSync(media2)
		if (err) {
			reply(`error\n\n${err}`)
			fs.unlinkSync(ran)
			} else {
			buffer = fs.readFileSync(ran)
			vinicius.sendMessage(from, buffer, MessageType.image, {quoted: lin, caption: 'success'})
			fs.unlinkSync(ran)
			}
	            })
		}
		break
            case 'stickertag':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                if (!isAdmin && !isOwner && !itsMe) return await reply('Só pode ser usado por admin!!!n')
                if (!isQuotedImage && !isImage) return await reply('Stickernya mana?')
                media = isQuotedSticker ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
                buffer = await vinicius.downloadMediaMessage(media)
                await wa.hideTagSticker(from, buffer)
                break
            case 'promover':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                if (!isAdmin) return await reply('Só pode ser usado por admin!!!n')
                if (!botAdmin) return await reply('jadikan bot admin')
                if (mentionUser.length == 0) return await reply('Tag member')
                await wa.promoteAdmin(from, mentionUser)
                await reply(`Success ao Promover`)
                break
            case 'desprovover':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                if (!isAdmin) return await reply('Só pode ser usado por admin!!!n')
                if (!botAdmin) return await reply('Só Consigo usar com eu sendo ademir')
                if (mentionUser.length == 0) return await reply('Tag member!')
                await wa.demoteAdmin(from, mentionUser)
                await reply(`Succeso Ao tirar`)
                break
            case 'linkgrupo':
                var link = await wa.getGroupInvitationCode(from)
                await wa.sendFakeStatus(from, link, "Este Link")
                break
            case 'fechargrp':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                if (!isAdmin) return await reply('Só pode ser usado por admin!!!')
                if (!botAdmin) return await reply('Só Consigo usar com eu sendo ademir')
                    vinicius.groupSettingChange(from, GroupSettingChange.messageSend, false).then(() => {
                        wa.sendFakeStatus(from, "*Success open group*", "GRUPO FECHADO")
                    })
                break
                case 'abrirgrp':
                    if (!isGroup) return await reply('Só pode ser usado em grps otário!')
                    if (!isAdmin) return await reply('Só pode ser usado por admin!!!')
                    if (!botAdmin) return await reply('Só Consigo usar com eu sendo ademir')
                vinicius.groupSettingChange(from, GroupSettingChange.messageSend, true).then(() => {
                    wa.sendFakeStatus(from, "*Successo", "GRUPO ABERTO")
                })
                break
            case 'nomegrp':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!s')
                if (!isAdmin) return await reply('Só pode ser usado por admin!!!')
                if (!botAdmin) return await reply('Só Consigo usar com eu sendo ademir')
                var newName = args.join(" ")
                vinicius.groupUpdateSubject(from, newName).then(() => {
                    wa.sendFakeStatus(from, "Mudei Para" + newName, "GROUP SETTING")
                })
                break
            case 'mudardesc':
                if (!isGroup) return await reply('Só pode ser usado em grps otário!s')
                if (!isAdmin) return await reply('Só pode ser usado por admin!!!')
                if (!botAdmin) return await reply('Só consigo usar se eu tiver admin')
                var newDesc = args.join(" ")
                vinicius.groupUpdateDescription(from, newDesc).then(() => {
                    wa.sendFakeStatus(from, "Alterei para" + newDesc, "o Texto")
                })
            default:
                if (body.startsWith("!")) {
                    if (!itsMe) return await reply('Este Comando é Só para meu Dono')
                    return await reply(JSON.stringify(eval(args.join(" ")), null, 2))
                }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ERRO]"), chalk.keyword("red")(e))
    }
})
