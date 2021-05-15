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
					for (i = 1; i<args.length; i+=2){
						message.channel.send(args[i])
					}
				}
			}



		}
	}
}
