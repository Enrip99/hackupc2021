const config = require('../data/config.json');

module.exports = {
	name: 'horario',
	description: 'guarda y genera el horario de diversos usuarios',
	execute(message, args) {
		if (!args.length){
			//help command, TO DO
			message.channel.send("content goes here")
		}

		else{
			if (args[0] == "add"){
				if (args.length == 1 || args.length%2 == 0) {
					message.channel.send("Comando inválido - Recuerda enviar los días y horas a pares")
				}

				else{
					var i
					var hora
					for (i = 1; i<args.length; i+=2){
						if (args[i].length == 1 && args[i].match(/[lmxjvsd]/)){
							message.channel.send(args[i])

							hora = parseInt(args[i+1],10)
							if (!isNaN(hora) && hora < 22 && hora > 7){
								console.log("a")
							}

							else{
								message.channel.send(args[i+1] +" no es una hora válida")
							}

						}

						else{
							message.channel.send(args[i] + " no es un día válido. Solo acepto **l**unes, **m**artes, (**x**)miercoles, **j**ueves, **v**iernes, **s**ábado y **d**omingo.")
						}
					}
				}
			}



		}
	}
}
