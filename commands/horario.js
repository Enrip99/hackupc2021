const config = require('../data/config.json');
var calendar = require('../data/calendar.json');
const fs = require('fs');

function help_message(message){
	message.channel.send("Para ver un listado de las horas a las que habrá gente en el despacho, escribe `horario check` seguido de un día de la semana. Por ejemplo, para ver la lista de los martes, escribe `horario check m`.\nPara ver la lista de personas que estarán en el despacho un día y a una hora determinados, escribe `horario check` seguido de un día de la semana y una hora. Por ejemplo, para ver qué personas habrá el jueves a las 9:00, escribe `horario check j 9`.\nPara añadir los días en que puedes estar por el despacho, escribe `despacho add` seguido de una lista de los días y horas en los que estás. Por ejemplo, para añadir que estarás el lunes a las 18:00, las 19:00 y el viernes a las 9:00, escribe `despacho add l 18 l 19 v 9`.\nPara quitar de la lista días en los que ya no puedes venir, escribe `despacho remove` seguido de una lista de los días y horas en los que estás. Por ejemplo, para quitar los miércoles a las 10:00 y los jueves a las 12, escribe `despacho remove x 10 j 12`.\nLas horas soportadas son de 8 a 21. Como día de la semana solo acepto las iniciales: **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
}

function validate_day(day){
	if (day.length == 1 && day[0].match(/[lmxjvsd]/)){
		switch(day) {
			case 'l':
				return 0
				break
			case 'm':
				return 1
				break
			case 'x':
				return 2
				break
			case 'j':
				return 3
				break
			case 'v':
				return 4
				break
			case 's':
				return 5
				break
			case 'd':
				return 6
				break
			}
	}
	else return -1
}

function validate_hour(hour){
	if (!isNaN(hour) && hour >= 8 && hour <= 21) return hour-8
	else return -1
}

function check_pairs_and_odd(args, message){
	if (args.length != 1 && args.length%2 == 1){
		return true
	}
	else{
		message.channel.send("Comando inválido - Recuerda enviar los días y horas a pares")
		return false
	}
}

function save_calendar(){
	fs.writeFile("./data/calendar.json", JSON.stringify(calendar), function(err) {
		if (err) console.log(err)
	})
}

function add_delete(args, message, addition){
	if (check_pairs_and_odd(args, message)){
		var msgToSend_fails = ""
		var msgToSend_exis = ""
		var msgToSend = ""
		for (var i = 1; i<args.length; i+=2){
			var dia = validate_day(args[i])
			var hora = validate_hour(args[i+1])
			if (hora >= 0 && dia >= 0){
				var found = false
				for (var j = 0; j < calendar.hor[dia][hora].length && !found; ++j){
					if (calendar.hor[dia][hora][j] == message.author.id){
						found = true
						if (!addition){
							calendar.hor[dia][hora].splice(j,1)
							if(!msgToSend.length) msgToSend = "Se han borrado del horario los siguientes días y horas:"
							msgToSend = msgToSend.concat("\n **-** ",args[i]," ",args[i+1])
						}
					}
				}
				if (addition){
					if (!found){
						calendar.hor[dia][hora].push(message.author.id)
						if(!msgToSend.length) msgToSend = "Se han añadido al horario los siguientes días y horas:"
						msgToSend = msgToSend.concat("\n **-** ",args[i]," ",args[i+1])
					}
					else{
						if (!msgToSend_exis.length) msgToSend_exis = "Ya tienes asignados los siguientes días y horas:"
						msgToSend_exis = msgToSend_exis.concat("\n **-** ",args[i]," ",args[i+1])
					}
				}
				if (!addition){
					if (!found){
						if (!msgToSend_exis.length) msgToSend_exis = "No tenías asignados los siguientes días y horas:"
						msgToSend_exis = msgToSend_exis.concat("\n **-** ",args[i]," ",args[i+1])
					}
				}
			}
			else {
				if (!msgToSend_fails.length) msgToSend_fails = "Los siguientes días y horas no son válidos:"
				msgToSend_fails = msgToSend_fails.concat("\n **-** ",args[i]," ",args[i+1])
			}
		}
		msgToSend = msgToSend.concat("\n\n",msgToSend_exis,"\n\n",msgToSend_fails)
		message.channel.send(msgToSend)
		save_calendar(calendar)
	}
}

function check_day(dia, message){
	var msgToSend = ""
	for (var i = 0; i < calendar.hor[dia].length; ++i){
		if (calendar.hor[dia][i].length == 1){
			msgToSend = msgToSend.concat("A las ",i+8,": ", calendar.hor[dia][i].length, " persona\n")
		}
		else if (calendar.hor[dia][i].length > 1){
			msgToSend = msgToSend.concat("A las ",i+8,": ", calendar.hor[dia][i].length, " personas\n")
		}
	}
	if (!msgToSend.length) message.channel.send("Este día no hay nadie")
	else message.channel.send(msgToSend)
}

function check_dia_hora(dia, hora, message, client){
	var count = 0
	var i = 0
	var msgToSend = ""
	for (i = 0; i < calendar.hor[dia][hora].length; ++i){
		client.users.fetch(String(calendar.hor[dia][hora][i])).then(usr =>{
			msgToSend = msgToSend.concat("\n",usr.username)
			++count
			if (count == calendar.hor[dia][hora].length) message.channel.send(msgToSend)
		})
	}
	if (i == 0) message.channel.send("Ese día a esa hora no hay nadie")
}

function check(args, message, client){
	switch(args.length){
		case 2:
			var dia = validate_day(args[1])
			if (dia >= 0) check_day(dia, message)
			else message.channel.send(args[1] + " no es un día válido.")
			break
		case 3:
			var dia = validate_day(args[1])
			var hora = validate_hour(args[2])
			if (dia >= 0 && hora >= 0) check_dia_hora(dia, hora, message, client)
			else message.channel.send(args[1] + " " + args[2] + " no son un día y hora válidos")
			break
		default:
			message.channel.send("Por favor, envía un único día, y opcionalmente una hora")
			break
	}
}

module.exports = {
	name: 'horario',
	description: 'guarda y genera el horario de diversos usuarios',
	execute(message, args, client) {
		if (!args.length){
			help_message(message)
		}
		else{
			switch (args[0]){
				case "add":
					add_delete(args, message, true)
					break

				case "remove":
					add_delete(args, message, false)
					break

				case "check":
					check(args, message, client)
					break

				case "wipe":
					if (args.length == 2 && args[1] == "--confirm"){
						if (message.author.id == config.owner1 || message.author.id == config.owner2){
							for (var i = 0; i < calendar.hor.length; ++i){
								for (var j = 0; j < calendar.hor[i].length; ++j){
									calendar.hor[i][j].splice(0,calendar.hor[i][j].length)
								}
							}
							save_calendar()
							message.channel.send("Base de datos borrada con éxito")
						}
						else message.channel.send("Esta acción solo la pueden hacer los propietarios del bot")
					}
					else{
						message.channel.send("Borra toda la base de datos. Usa `horario wipe --confirm`. **Esta acció no se puede deshacer**")
					}
					break

				default:
					help_message(message)
					break
			}
		}
	}
}
