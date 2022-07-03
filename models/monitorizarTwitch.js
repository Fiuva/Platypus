const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { scheduleJob } = require('node-schedule');
const request = require("request");
const { PRIVATE_CONFIG, GUILD, ROL } = require('../config/constantes');
const { sleep, findOrCreateDocument } = require('../handlers/funciones');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Schema = mongoose.Schema;

const monitorizarSchema = new Schema({
	idDiscord: { type: String, unique: true },
	fechaFin: { type: Number, default: Date.now() + 7*24*60*60*1000 },
    usuarios: { type: Array, default: [] },
    active: { type: Boolean, default: false },
    delay: { type: Number, default: 4 }
})
const MonitorizarTwitch = mongoose.model('MonitorizarTwitch', monitorizarSchema);

var jobs = {};
var cacheFollowing = {};
var cache = {};
var cacheCanalesViendo = {};

module.exports = {
	MonitorizarTwitch,
	createJob,
	getIDbyName,
	getToken,
	mostrarStatsTwitch,
	funcionStart,
	funcionStop,
	calcularPlan,
	getNamebyID,
	buscarTwitch
};


async function mostrarStatsTwitch(message) {
	const userTwitch = await findOrCreateDocument(message.author.id, MonitorizarTwitch);
	if (!cacheCanalesViendo[userTwitch.idDiscord.toString()]) cacheCanalesViendo[userTwitch.idDiscord.toString()] = {};
	if (!cacheFollowing[userTwitch.idDiscord.toString()]) cacheFollowing[userTwitch.idDiscord.toString()] = {};

	let tipoPlan = await calcularPlan((await message.client.guilds.cache.get(GUILD.SERVER_PLATY).members.fetch(userTwitch.idDiscord)), userTwitch);
	if (!userTwitch.active) {
		var embed = new MessageEmbed()
			.setTitle(`Stats`)
			.setAuthor({ name: `Desactivado` })
			.setDescription(`**!planes** para ver los planes disponibles`)
			.setFields(
				{ name: `Plan`, value: tipoPlan, inline: true },
				{ name: `Delay`, value: `${userTwitch.delay} min`, inline: true }
			)
			.setColor('DARK_RED')
			.setFooter({ text: `!start para activarlo` })

		message.channel.send({ embeds: [embed] });
		return;
	} else {
		var embed = new MessageEmbed()
			.setTitle(`Stats`)
			.setAuthor({ name: `Activado` })
			.setFields(
				{ name: `Plan`, value: tipoPlan, inline: true },
				{ name: `Delay`, value: `${userTwitch.delay}min`, inline: true }
		)
			.setColor('PURPLE')
			.setFooter({ text: `!stop para desactivarlo` })
		for (var i = 0; i < userTwitch.usuarios.length; i++) {
			if (!cacheCanalesViendo[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()]) {
				if (!jobs[message.author.id.toString()]) return;
				return message.channel.send(`La monitorización empezará <t:${(jobs[message.author.id.toString()].nextInvocation().getTime() / 1000 << 0) + 10}:R> aprox. (delay: ${userTwitch.delay} min)`);
			}
			let canales = cacheCanalesViendo[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()].canales;
			let stringCanales = 'No está en ningún canal que sigue';
			for (var j = 0; j < canales.length; j++) {
				if (j == 0) {
					stringCanales = `**${canales[j].name}** - ${((Date.now() - canales[j].time) / 1000 / 60).toFixed(2)}min \n`
				} else {
					stringCanales += `**${canales[j].name}** - ${((Date.now() - canales[j].time) / 1000 / 60).toFixed(2)}min \n`
                }
			}
			embed.addField(cacheFollowing[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()].name, stringCanales);
		}
		message.channel.send({ embeds: [embed] });
    }
	
}

function createJob(authorId, userTwitch, client) {
	let channel = client.users.cache.get(authorId);
	if (!cacheCanalesViendo[userTwitch.idDiscord.toString()]) cacheCanalesViendo[userTwitch.idDiscord.toString()] = {};
	if (!cacheFollowing[userTwitch.idDiscord.toString()]) cacheFollowing[userTwitch.idDiscord.toString()] = {};
	if (!channel) return;
	const job = scheduleJob(`*/${userTwitch.delay} * * * *`, async () => {
		let member = (await client.guilds.cache.get(GUILD.SERVER_PLATY).members.fetch(userTwitch.idDiscord));
		testPlan(await calcularPlan(member, userTwitch), userTwitch, member);

		await sleep(parseInt(authorId.substring(0, 4)));
		let token = await getToken();
		for (var i = 0; i < userTwitch.usuarios.length; i++) {
			let name;
			let thisCache = cacheFollowing[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()];
			if (!thisCache) name = await getNamebyID(token, userTwitch.usuarios[i]);
			else name = thisCache.name;

			let newFollowings;
			if (thisCache && (Date.now() - thisCache.update) < 50000) {
				newFollowings = thisCache.following;
			} else {
				newFollowings = await getFollows(token, userTwitch.usuarios[i]);
			}

			if (!newFollowings) {
				channel.send(`Demasiadas peticiones, **avisa a __Fiuva__ si ves este mensaje**`);
			} else {
				if (thisCache && thisCache.following != newFollowings) {
					var dejaDeSeguir = thisCache.following.filter(function (obj) { return newFollowings.indexOf(obj) == -1; });
					var empiezaASeguir = newFollowings.filter(function (obj) { return thisCache.following.indexOf(obj) == -1; });
					if (empiezaASeguir.length >= 1) {
						channel.send({
							embeds: [
								new MessageEmbed()
									.setTitle(thisCache.name)
									.setColor('GREEN')
									.setDescription(`Ha empezado seguir a **${empiezaASeguir.join(', ')}**`)
									.setTimestamp(new Date())
							]
						})
					}
					if (dejaDeSeguir.length >= 1) {
						channel.send({
							embeds: [
								new MessageEmbed()
									.setTitle(thisCache.name)
									.setColor('DARK_GREEN')
									.setDescription(`Ha dejado de seguir a **${dejaDeSeguir.join(', ')}**`)
									.setTimestamp(new Date())
							]
						})
					}
				}
				cacheFollowing[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()] = {
					name: name,
					following: newFollowings,
					update: Date.now()
				};
				thisCache = cacheFollowing[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()];

				let newCanales = await buscarCanalQueVe(thisCache.name, thisCache.following);
				let thisCacheViendo = cacheCanalesViendo[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()];
				if (!thisCacheViendo) {
					if (newCanales.length != 0)
						channel.send({
							embeds: [
								new MessageEmbed()
									.setTitle(thisCache.name)
									.setColor('BLURPLE')
									.setDescription(`Está viendo a **${newCanales.join(', ')}**`)
									.setTimestamp(new Date())
							]
						})
					for (var k = 0; k < newCanales.length; k++) {
						newCanales[k] = {
							name: newCanales[k],
							time: Date.now()
						}
					}
					cacheCanalesViendo[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()] = {
						canales: newCanales
					};
				} else {
					if (thisCacheViendo.canales.map(obj => obj.name) != newCanales) {
						var dejaDeVer = thisCacheViendo.canales.map(obj => obj.name).filter(function (obj) { return newCanales.indexOf(obj) == -1; });
						var empiezaAVer = newCanales.filter(function (obj) { return thisCacheViendo.canales.map(obj => obj.name).indexOf(obj) == -1; });
						for (var k = 0; k < newCanales.length; k++) {
							if (empiezaAVer.includes(newCanales[k])) {
								newCanales[k] = {
									name: newCanales[k],
									time: Date.now()
								}
							} else {
								newCanales[k] = {
									name: newCanales[k],
									time: thisCacheViendo.canales.find(c => c.name = newCanales[k]).time
								}
                            }
						}
						
						if (empiezaAVer.length != 0) {
							var embed = new MessageEmbed()
								.setAuthor({ name: thisCache.name })
								.setTitle(`Empieza a ver...`)
								.setColor('AQUA')
								.setTimestamp(new Date())
							empiezaAVer.forEach(canal => {
								embed.addField(canal, `<t:${Date.now() / 1000 << 0}:R>`, true);
							})
							channel.send({ embeds: [embed] });
						}
						if (dejaDeVer.length != 0) {
							var embed = new MessageEmbed()
								.setAuthor({ name: thisCache.name })
								.setTitle(`Deja de ver...`)
								.setColor('DARK_AQUA')
								.setTimestamp(new Date())
							dejaDeVer.forEach(canal => {
								embed.addField(canal, `Tiempo visto: **${((Date.now() - thisCacheViendo.canales.find(c => c.name = canal).time) / 1000 / 60).toFixed(2)}min**`, true);
							})
							channel.send({ embeds: [embed] });
						}

						cacheCanalesViendo[userTwitch.idDiscord.toString()][userTwitch.usuarios[i].toString()].canales = newCanales;
                    }
				}
            }
		}
	});
	return job;
}

async function getToken() {
	const options = {
		url: 'https://id.twitch.tv/oauth2/token',
		json: true,
		body: {
			client_id: PRIVATE_CONFIG.TWITCH.CLIENT_ID,
			client_secret: PRIVATE_CONFIG.TWITCH.CLIENT_SECRET,
			grant_type: 'client_credentials'
		}
	};

	let token = null;
	try {
		token = new Promise(async (resolve, reject) => {
			request.post(options, async (err, res, body) => {
				if (err) {
					return console.log(err);
				} 
				try {
					let token;
					if (res.body) {
						token = res.body.access_token;
					} else {
						console.log('Reintentando...');
						await sleep(2500);
						token = await getToken();
					}
					resolve(token);
				} catch (e) {
					reject(e);
				}
			})
		});
	} catch (e) {
		console.log(e);
	}
	return token;
}
async function getFollows(accessToken, id) {
	let pag = await getPaginaFollows(accessToken, id);
	if (!pag) return null;
	var following = pag.data;
	while (pag.pagination.cursor) { //poner limite por si acaso alguien sigue a 21435124 personas
		pag = await getPaginaFollows(accessToken, id, pag.pagination.cursor);
		if (!pag) return null;
		following = following.concat(pag.data);
	}
	return following;

	async function getPaginaFollows(accessToken, id, after = null) {
		let url = `https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100`
		if (after) url += `&after=${after}`
		const options = {
			url: url,
			method: 'GET',
			headers: {
				'Client-ID': PRIVATE_CONFIG.TWITCH.CLIENT_ID,
				'Authorization': 'Bearer ' + accessToken
			}
		}

		let pagina = null;
		try {
			pagina = await new Promise(async (resolve, reject) => {
				await request.get(options, async (err, res, body) => {
					if (err || !body) return reject(err);
					body = JSON.parse(body);
					let following = {
						data: [],
						pagination: null
					};
					try {
						if (body.status && body.status == 429) {
							console.log('Reintentando...');
							await sleep(10000);
							following = await getPaginaFollows(accessToken, name, after);
						} else {
							following.data = body.data.map(u => u.to_login);
							following.pagination = body.pagination;
						}
						resolve(following);
					} catch (e) {
						reject(e)
					}

				});
			})
		} catch (err) {
			console.log(err);
		}
		return pagina;
	}
}
async function getIDbyName(accessToken, name) {
	const options = {
		url: `https://api.twitch.tv/helix/users?login=${name}`,
		method: 'GET',
		headers: {
			'Client-ID': PRIVATE_CONFIG.TWITCH.CLIENT_ID,
			'Authorization': 'Bearer ' + accessToken
		}
	}
	let id = null;
	try {
		id = await new Promise(async (resolve, reject) => {
			await request.get(options, async (err, res, body) => {
				if (err || !body) return reject(err);
				body = JSON.parse(body);
				let id = null;
				if (body.status && body.status == 429) {
					console.log('Reintentando...');
					await sleep(5000);
					id = await getIDbyName(accessToken, name);
				} else {
					if (body.data[0])
						id = body.data[0].id;
				}
				resolve(id);
			});
		})
	} catch (err) {
		console.log(err);
	}
	return id;
}
async function getNamebyID(accessToken, id) {
	const options = {
		url: `https://api.twitch.tv/helix/users?id=${id}`,
		method: 'GET',
		headers: {
			'Client-ID': PRIVATE_CONFIG.TWITCH.CLIENT_ID,
			'Authorization': 'Bearer ' + accessToken
		}
	}
	let name = null;
	try {
		name = await new Promise(async (resolve, reject) => {
			await request.get(options, async (err, res, body) => {
				if (err) return reject(err);
				body = JSON.parse(body);
				let name = null;
				if (body.status && body.status == 429) {
					console.log('Reintentando...');
					await sleep(5000);
					name = await getNamebyID(accessToken, id);
				} else {
					if (body.data[0])
						name = body.data[0].login;
				}
				resolve(name);
			});
		})
	} catch (err) {
		console.log(err);
	}
	return name;
}

async function buscarCanalQueVe(usuario, arrayCanales = []) {
	var canales = [];
	var procesos = [];
	for (var i = 0; i < arrayCanales.length; i++) {
		let canal = arrayCanales[i];
		procesos.push(procesar(usuario, canal));
	}
	await Promise.all(procesos);
	return canales;

	async function procesar(usuario, canal) {
		if (await usuarioEnCanal(usuario, canal)) {
			return canales.push(canal);
		}
	}
}

async function usuarioEnCanal(usuario, canal) {
	if (cache[canal] && (Date.now() - cache[canal].actualizado) < 50000) {
		return cache[canal].personas.includes(usuario)
	}

	const url = `http://tmi.twitch.tv/group/user/${canal}/chatters`;
	return await fetch(url).then(response => response.json()).then(data => {
		const personas = data.chatters.broadcaster.concat(data.chatters.vips).concat(data.chatters.moderators).concat(data.chatters.viewers)
		cache[canal] = {
			personas: personas,
			actualizado: Date.now()
		};
		return personas.includes(usuario)
	}).catch((e) => {
		console.log("Error por el pinche tmi");
		return false;
	})
}

async function calcularPlan(member, userTwitch) {
	if (member.roles.cache.has(ROL.TWITCH.TIER1)) {
		return "Tier 1";
	} else if (member.roles.cache.has(ROL.TWITCH.TIER2)) {
		return "Tier 2"
	} else if (member.roles.cache.has(ROL.TWITCH.TIER3)) {
		return "Tier 3"
	} else {
		if (userTwitch.fechaFin - Date.now() > 0) {
			return `Prueba *termina <t:${userTwitch.fechaFin / 1000 << 0}:R>*`
		} else {
			return `Sin Plan`
        }
    }
}

async function testPlan(plan, userTwitch, member) {
	switch (plan) {
		case "Tier 1":
			if (userTwitch.usuarios.length <= 1 && userTwitch.delay >= 3) return;
			if (userTwitch.usuarios.length > 1) {
				userTwitch.usuarios = [userTwitch.usuarios[0]];
			}
			if (userTwitch.delay < 3) {
				userTwitch.delay = 3;
			}
			await MonitorizarTwitch.updateOne({ idDiscord: userTwitch.idDiscord }, { delay: userTwitch.delay, usuarios: userTwitch.usuarios });
			await funcionStart(member)
			member.send({ embeds: [new MessageEmbed().setTitle(`Ahora el plan es Tier 1`).setColor('RED').setDescription(`**El delay y los usuarios han podido ser modificados** \n !planes para ver los beneficios de tener un plan mejor`)] });
			break;
		case "Tier 2":
			if (userTwitch.usuarios.length <= 2) return;
			userTwitch.usuarios = [userTwitch.usuarios[0], userTwitch.usuarios[1]];
			await MonitorizarTwitch.updateOne({ idDiscord: userTwitch.idDiscord }, { usuarios: userTwitch.usuarios });
			await funcionStart(member)
			member.send({ embeds: [new MessageEmbed().setTitle(`Ahora el plan es Tier 2`).setColor('RED').setDescription(`**Los usuarios han podido ser modificados** \n !planes para ver los beneficios de tener un plan mejor`)] });
			break;
		case "Tier 3":
			break;
		case "Sin Plan":
			await funcionStop(member);
			member.send({ embeds: [new MessageEmbed().setTitle(`Ya no tienes ningún plan activo :<`).setColor('RED').setDescription(`**Debes estar en el servidor de Fiuva** \n Debes tener la cuenta de twitch vinculada a discord \n *!planes para ver los planes disponibles*`)] });
			break;
    }
}

async function funcionStart(member, reinicio = false) {
	const userTwitch = await findOrCreateDocument(member.id, MonitorizarTwitch);
	if (await calcularPlan(member, userTwitch) == 'Sin Plan') {
		if (!reinicio) member.send(`Necesitas algún **plan** para activar la monitorización de usuarios de Twitch __*!planes*__`);
		return;
    }
	if (userTwitch.active) {
		try {
			jobs[member.id.toString()].cancel();
		} catch { }
		if (!reinicio) member.send(`Monitorización reiniciada`);
	} else {
		await MonitorizarTwitch.updateOne({ idDiscord: member.id }, { active: true });
		if (!reinicio) member.send(`Monitorización iniciada`);
	}
	const job = createJob(member.id, userTwitch, member.client);
	jobs[member.id.toString()] = job;
}

async function funcionStop(member) {
	const userTwitch = await findOrCreateDocument(member.id, MonitorizarTwitch);
	if (!userTwitch.active) return member.send(`No está activa la monitorización`)
	await MonitorizarTwitch.updateOne({ idDiscord: member.id }, { active: false });

	try {
		jobs[member.id.toString()].cancel();
		member.send(`Se ha detenido la monitorización`)
	} catch {
		member.send(`Error al detener la monitorzación`);
	}
}

async function buscarTwitch(nombre, idTwitch, message, token, fechaInicio) {
	nombre = nombre.toLowerCase();
	let newFollowings = await getFollows(token, idTwitch);
	let newCanales = await buscarCanalQueVe(nombre, newFollowings);
	var embed = new MessageEmbed()
		.setTitle(nombre)
		.setTimestamp(Date.now())
		.setAuthor({ name: `Sigue a ${newFollowings.length} canales` });
	if (newCanales.length == 0) {
		embed.setDescription(`No está en ningún canal que siga`);
	} else {
		var texto = "Canales en los que está: \n";
		for (var i = 0; i < newCanales.length; i++) {
			texto += `• **${newCanales[i]}** \n`
		}
		embed.setDescription(texto);
		embed.setColor('BLURPLE')
	}
	embed.setFooter({ text: `Tiempo: ${((Date.now() - fechaInicio) / 1000).toFixed(2)} seg` })
	message.edit({ content: " ", embeds: [embed] });
}