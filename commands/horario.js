const config = require('../data/config.json');
var calendar = require('../data/calendar.json');
const fs = require('fs');

function help_message(message){
	message.channel.send("Para ver un listado de las horas a las que habrá gente en el despacho, escribe `horario check` seguido de un día de la semana. Por ejemplo, para ver la lista de los martes, escribe `horario check m`.\nPara ver la lista de personas que estarán en el despacho un día y a una hora determinados, escribe `horario check` seguido de un día de la semana y una hora. Por ejemplo, para ver qué personas habrá el jueves a las 9:00, escribe `horario check j 9`.\nPara añadir los días en que puedes estar por el despacho, escribe `despacho add` seguido de una lista de los días y horas en los que estás. Por ejemplo, para añadir que estarás el lunes a las 18:00, las 19:00 y el viernes a las 9:00, escribe `despacho add l 18 l 19 v 9`.\nPara quitar de la lista días en los que ya no puedes venir, escribe `despacho remove` seguido de una lista de los días y horas en los que estás. Por ejemplo, para quitar los miércoles a las 10:00 y los jueves a las 12, escribe `despacho remove x 10 j 12`.\nLas horas soportadas son de 8 a 21. Como día de la semana solo acepto las iniciales: **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
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
					break

				case "remove":
					break

				case "check":
					break

				default:
					help_message(message)
					break
			}
		}
	}
}
