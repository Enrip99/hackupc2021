const config = require('../data/config.json');

module.exports = {
	name: 'horario',
	description: 'guarda y genera el horario de diversos usuarios',
	execute(message, args) {
		if (!args.lenght){
			//help command
			message.channel.send("content goes here")
		}
		else{

		}
	}
}
