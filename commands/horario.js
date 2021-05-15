const config = require('../data/config.json');
var calendar = require('../data/calendar.json');
const fs = require('fs');

module.exports = {
	name: 'horario',
	description: 'guarda y genera el horario de diversos usuarios',
	execute(message, args) {
		if (!args.length){
			//help command, TO DO
			message.channel.send("help goes here")
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
