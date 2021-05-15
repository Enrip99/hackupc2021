module.exports = {
	name: 'ping',
	description: 'Bot response time',
	execute(message, args) {
		if (!args.length) message.channel.send(Date.now() - message.createdTimestamp + ' milisegundos');
	},
};
