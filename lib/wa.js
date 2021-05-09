const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys");
const connect = require('./connect');
const { getRandomExt } = require("./help");
const fs = require('fs')

const vinicius = connect.vinicius
const bufferFakeReply = fs.readFileSync('./lib/image/foto.jpg')

exports.sendSticker = (from, filename, lin) => {
	vinicius.sendMessage(from, filename, MessageType.sticker, {quoted: lin})
}

exports.setName = async function(query){
    const response = await vinicius.updateProfileName(query)
    return response
}

exports.setBio = async function(query){
    const response = await vinicius.setStatus(query)
    return response
}

exports.sendFakeStatus2 = (from, teks, faketeks) => {
	vinicius.sendMessage(from, teks, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks} } } })
}

exports.FakeTokoForwarded = (from, teks, fake) => {
	anu = {
		key: {
			fromMe: false,
			participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
		},
		message: {
			"productMessage": {
				"product": {
					"productImage":{
						"mimetype": "image/jpeg",
					},
					"title": fake,
					"description": "ViniciusSELF",
					"currencyCode": "EUR",
					"priceAmount1000": "5000",
					"retailerId": "SELFBOT",
					"productImageCount": 1
				},
				"businessOwnerJid": `0@s.whatsapp.net`
		}
	}
}
	vinicius.sendMessage(from, teks, MessageType.text, {quoted: anu, contextInfo: {"forwardingScore": 999, "isForwarded": true}})
}

exports.FakeStatusImgForwarded = (from, image, caption, faketeks) => {
	vinicius.sendMessage(from, image, MessageType.image, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks} } }, caption: caption, contextInfo: {"forwardingScore": 999, "isForwarded": true} })
}

exports.sendMessage = async(from, text) => {
    await vinicius.sendMessage(from, text, MessageType.text)
}

exports.sendAudio = async(from, buffer) => {
    await vinicius.sendMessage(from, buffer, MessageType.mp4Audio, { mimetype: Mimetype.mp4Audio, ptt: true })
}

exports.sendImage = async(from, buffer, caption = "") => {
    await vinicius.sendMessage(from, buffer, MessageType.image, { caption: caption })
}

exports.sendVideo = async(from, buffer, caption = "") => {
    await vinicius.sendMessage(from, buffer, MessageType.video, { caption: caption })
}

exports.sendSticker = async(from, buffer) => {
    await vinicius.sendMessage(from, buffer, MessageType.sticker)
}

exports.sendPdf = async(from, buffer, title = "Vinicius.pdf") => {
    await vinicius.sendMessage(from, buffer, MessageType.document, { mimetype: Mimetype.pdf, title: title })
}

exports.sendGif = async(from, buffer) => {
    await vinicius.sendMessage(from, buffer, MessageType.video, { mimetype: Mimetype.gif })
}

exports.sendContact = async(from, nomor, nama) => {
    const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
    await vinicius.sendMessage(from, { displayname: nama, vcard: vcard }, MessageType.contact)
}

exports.sendMention = async(from, text, mentioned) => {
    await vinicius.sendMessage(from, text, MessageType.text, { contextInfo: { mentionedJid: mentioned } })
}

exports.sendImageMention = async(from, buffer, text, mentioned) => {
    await vinicius.sendMessage(from, buffer, MessageType.image, { contextInfo: { mentionedJid: [mentioned], participant: [mentioned] }, caption: text })
}

exports.sendFakeStatus = async(from, text, faketext, mentioned = []) => {
    const options = {
        contextInfo: {
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            quotedMessage: {
                imageMessage: {
                    caption: faketext,
                }
            },
            mentionedJid: mentioned
        }
    }
    await vinicius.sendMessage(from, text, MessageType.text, options)
}

exports.fakeStatusForwarded = async(from, text, faketext) => {
    const options = {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            quotedMessage: {
                imageMessage: {
                    caption: faketext,
                }
            }
        }
    }
    await vinicius.sendMessage(from, text, MessageType.text, options)
}

exports.sendFakeThumb = async(from, buffer, caption = "") => {
    let options = {
        thumbnail: fs.readFileSync('./lol/resource/foto2.jpg'),
        caption: caption
    }
    await vinicius.sendMessage(from, buffer, MessageType.image, options)
}

exports.downloadMedia = async(media) => {
    const filePath = await vinicius.downloadAndSaveMediaMessage(media, `./temp/${getRandomExt()}`)
    const fileStream = fs.createReadStream(filePath)
    const fileSizeInBytes = fs.statSync(filePath).size
    fs.unlinkSync(filePath)
    return { size: fileSizeInBytes, stream: fileStream }
}

exports.hideTag = async(from, text) => {
    members = await this.getGroupParticipants(from)
    await vinicius.sendMessage(from, text, MessageType.text, { contextInfo: { mentionedJid: members } })
}

exports.hideTagImage = async(from, buffer) => {
    members = await this.getGroupParticipants(from)
    await vinicius.sendMessage(from, buffer, MessageType.image, { contextInfo: { mentionedJid: members } })
}

exports.hideTagSticker = async(from, buffer) => {
    members = await this.getGroupParticipants(from)
    await vinicius.sendMessage(from, buffer, MessageType.sticker, { contextInfo: { mentionedJid: members } })
}

exports.hideTagContact = async(from, nomor, nama) => {
    let vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
    members = await this.getGroupParticipants(from)
    await vinicius.sendMessage(from, { displayname: nama, vcard: vcard }, MessageType.contact, { contextInfo: { mentionedJid: members } })
}

exports.blockUser = async(id, block) => {
    if (block) return await vinicius.blockUser(id, "add")
    await vinicius.blockUser(id, "remove")
}

exports.getGroupParticipants = async(id) => {
    var members = await vinicius.groupMetadata(id)
    var members = members.participants
    let mem = []
    for (let i of members) {
        mem.push(i.jid)
    }
    return mem
}

exports.getGroupAdmins = async(participants) => {
    admins = []
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}

exports.getGroupInvitationCode = async(id) => {
    const linkgc = await vinicius.groupInviteCode(id)
    const code = "https://chat.whatsapp.com/" + linkgc
    return code
}

exports.kick = function(from, orangnya){
	for (let i of orangnya){
		vinicius.groupRemove(from, [i])
	}
}

exports.add = function(from, orangnya){
	vinicius.groupAdd(from, orangnya)
}

exports.kickMember = async(id, target = []) => {
    const group = await vinicius.groupMetadata(id)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = vinicius.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await vinicius.groupRemove(to, [i])
        } else {
            await this.sendMessage(id, "Not Premited!")
            break
        }
    }
}

exports.sendKontak = (from, nomor, nama) => {
	const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
	vinicius.sendMessage(from, {displayname: nama, vcard: vcard}, MessageType.contact)
}

exports.promoteAdmin = async(to, target = []) => {
    const g = await vinicius.groupMetadata(to)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = vinicius.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await vinicius.groupMakeAdmin(to, [i])
        } else {
            await this.sendMessage(to, "Not Premited!")
            break
        }
    }
}

exports.demoteAdmin = async(to, target = []) => {
    const g = await vinicius.groupMetadata(to)
    const owner = g.owner.replace("c.us", "s.whatsapp.net")
    const me = vinicius.user.jid
    for (i of target) {
        if (!i.includes(me) && !i.includes(owner)) {
            await vinicius.groupDemoteAdmin(to, [i])
        } else {
            await this.sendMessage(to, "Not Premited!")
            break
        }
    }
}

exports.getUserName = async(jid) => {
    const user = vinicius.contacts[jid]
    return user != undefined ? user.notify : ""
}

exports.getBio = async(mids) => {
    const pdata = await vinicius.getStatus(mids)
    if (pdata.status == 401) {
        return pdata.status
    } else {
        return pdata.status
    }
}

exports.getPictProfile = async(mids) => {
    try {
        var url = await vinicius.getProfilePicture(mids)
    } catch {
        var url = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
    return url
}