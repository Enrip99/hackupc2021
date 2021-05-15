module.exports = {
	name: '7f',
	description: 'Help command',
	execute(message, args) {
		if (!args.length) message.channel.send('** **- `horario` para ver las funcionalidades de los horarios.\n - Para apagar el bot utiliza el comando `shut off`\n - `Ping` para ver el tiempo de respuesta.\n - Este bot ha sido desarrollado y mantenido por un gilipollas - https://github.com/Enrip99/hackupc2021');
	},
};
