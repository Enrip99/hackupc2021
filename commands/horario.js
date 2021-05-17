const config = require('../data/config.json');
var calendar = require('../data/calendar.json');
const fs = require('fs');
//const Discord = require('discord.js');
//const client = new Discord.Client();


module.exports = {
	name: 'horario',
	description: 'guarda y genera el horario de diversos usuarios',
	execute(message, args, client) {
		if (!args.length){
			message.channel.send("Para ver un listado de las horas a las que habrá gente en el despacho, escribe `horario check` seguido de un día de la semana. Por ejemplo, para ver la lista de los martes, escribe `horario check m`.\nPara añadir los días en que puedes estar por el despacho, escribe `despacho add` seguido de una lista de los días y horas en los que estás. Por ejemplo, para añadir que estarás el lunes a las 18:00, las 19:00 y el viernes a las 9:00, escribe `despacho add l 18 l 19 v 9`.\nPara quitar de la lista días en los que ya no puedes venir, escribe `despacho remove` seguido de una lista de los días y horas en los que estás. Por ejemplo, para quitar los miércoles a las 10:00 y los jueves a las 12, escribe `despacho remove x 10 j 12`.\nLas horas soportadas son de 8 a 21. Como día de la semana solo acepto las iniciales: **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
		}
		else{
			if (args[0] == "add"){
				if (args.length == 1 || args.length%2 == 0) {
					message.channel.send("Comando inválido - Recuerda enviar los días y horas a pares")
				}

				else{
					var i
					var hora
					var dia
					for (i = 1; i<args.length; i+=2){
						dia = args[i]
						if (dia.length == 1 && dia.match(/[lmxjvsd]/)){
							hora = parseInt(args[i+1],10)
							if (!isNaN(hora) && hora < 22 && hora > 7){
								//main code here, only if valid hour and day
								hora -=8
								switch(dia) {
									case 'l':
									dia = 0
									break
									case 'm':
									dia = 1
									break
									case 'x':
									dia = 2
									break
									case 'j':
									dia = 3
									break
									case 'v':
									dia = 4
									break
									case 's':
									dia = 5
									break
									case 'd':
									dia = 6
									break
								}
								var found = false
								for(x in calendar.hor[dia][hora]){
									if (calendar.hor[dia][hora][x] == message.author.id) found = true
								}
								if (!found){
									calendar.hor[dia][hora].push(message.author.id)
								}
							}
							else{
								message.channel.send(args[i+1] +" no es una hora válida")
							}
						}
						else{
							message.channel.send("`" + args[i] + "` no es un día válido. Solo acepto **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
						}
					}
					fs.writeFile("./data/calendar.json", JSON.stringify(calendar), function(err) {if (err) console.log(err)})
				}
			}
			else if (args[0] == "check"){
				if (args.length == 2){
					var dia = args[1]
					if (dia.length == 1 && dia.match(/[lmxjvsd]/)){
						switch(dia) {
							case 'l':
							dia = 0
							break
							case 'm':
							dia = 1
							break
							case 'x':
							dia = 2
							break
							case 'j':
							dia = 3
							break
							case 'v':
							dia = 4
							break
							case 's':
							dia = 5
							break
							case 'd':
							dia = 6
							break
						}
						dia = calendar.hor[dia]
						var msgToSend = ""
						var hora

						for (hora = 0; hora < dia.length; ++hora){
							if (dia[hora].length > 0){
								msgToSend = msgToSend.concat("A las ",hora+8,": ", dia[hora].length, " personas\n")
							}
							else if (dia[hora].length == 1){
								msgToSend = msgToSend.concat("A las ",hora+8,": ", dia[hora].length, " persona\n")
							}
						}
						if (msgToSend != "")message.channel.send(msgToSend)
						else message.channel.send("Este día no hay nadie")
					}
					else {
						message.channel.send("`" + dia + "` no es un día válido. Solo acepto **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
					}
				}
				else if (args.length == 3){
					var dia = args[1]
					if (dia.length == 1 && dia.match(/[lmxjvsd]/)){
						switch(dia) {
							case 'l':
							dia = 0
							break
							case 'm':
							dia = 1
							break
							case 'x':
							dia = 2
							break
							case 'j':
							dia = 3
							break
							case 'v':
							dia = 4
							break
							case 's':
							dia = 5
							break
							case 'd':
							dia = 6
							break
						}
						hora = parseInt(args[2],10)
						if (!isNaN(hora) && hora < 22 && hora > 7){
							//main code here, only if valid hour and day
							hora -=8
							if(calendar.hor[dia][hora].length == 0){
								message.channel.send("Ese día a esa hora no hay nadie")
							}
							else{
								var count = 0
								var msgToSend = "Las siguientes personas estarán a esa hora:"
								for (var i = 0; i < calendar.hor[dia][hora].length; ++i){
									client.users.fetch(String(calendar.hor[dia][hora][i])).then(usr =>{
										console.log("i am here")
										msgToSend = msgToSend.concat("\n",usr.username)
										++count
										if (count == calendar.hor[dia][hora].length) message.channel.send(msgToSend)
									})
								}
							}
						}
						else message.channel.send("Hora no válida")
					}
					else {
						message.channel.send("`" + dia + "` no es un día válido. Solo acepto **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
					}
				}
				else{
					message.channel.send("Argumentos incorrectos. Por favor especifíca un solo día")
				}
			}
			else if (args[0] == "remove"){
				if (args.length == 1 || args.length%2 == 0) {
					message.channel.send("Comando inválido - Recuerda enviar los días y horas a pares")
				}

				else{
					var i
					var hora
					var dia
					for (i = 1; i<args.length; i+=2){
						dia = args[i]
						if (dia.length == 1 && dia.match(/[lmxjvsd]/)){
							hora = parseInt(args[i+1],10)
							if (!isNaN(hora) && hora < 22 && hora > 7){
								hora -=8
								switch(dia) {
									case 'l':
									dia = 0
									break
									case 'm':
									dia = 1
									break
									case 'x':
									dia = 2
									break
									case 'j':
									dia = 3
									break
									case 'v':
									dia = 4
									break
									case 's':
									dia = 5
									break
									case 'd':
									dia = 6
									break
								}
								for(x in calendar.hor[dia][hora]){
									if (calendar.hor[dia][hora][x] == message.author.id) calendar.hor[dia][hora].splice(x,1)
								}
							}
							else{
								message.channel.send(args[i+1] +" no es una hora válida")
							}
						}
						else{
							message.channel.send("`" + args[i] + "` no es un día válido. Solo acepto **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
						}
					}
					fs.writeFile("./data/calendar.json", JSON.stringify(calendar), function(err) {if (err) console.log(err)})
				}
			}
		}
	}
}
