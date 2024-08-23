const { State } = require('./recognizer/automata');
const { TransitionsTypes } = require('./recognizer/transition');

class SpokenCommand {
	constructor(command, path = []) {
		this.id = command.id;
		this.label = command.label;
		this.lang = command.lang;
		this.langName = command.langName;
		this.title = command.title;
		this.desc = command.desc;
		this.impl = command.impl;
		this.path = path;
		this.args = SpokenCommand.extractArgs(path);
		this.args.extra = { lang: command.lang };
		this.extra = {};

		if (command.extraArgs) {
			this.args.extra = { ...this.args.extra, ...JSON.parse(command.extraArgs) };
		}
	}

	static extractArgs(path) {
		// Keep only {store: 'value to be stored'}
		const args = path.filter((item) => item != null && typeof item !== 'string' && Object.keys(item).length === 1);

		return args.reduce((acc, el) => {
			const key = Object.keys(el)[0];
			const val = SpokenCommand.maybeParseArgs(el[key]);

			if (Array.isArray(acc[key])) {
				acc[key].push(val);
			} else if (false && typeof acc[key] === 'string') {
				acc[key] += ' ' + val;
			} else if (acc[key] !== undefined) {
				acc[key] = [ acc[key], val ];
			} else {
				acc[key] = val;
			}

			return acc;
		}, {});
	}

	static maybeParseArgs(automata) {
		if (!automata.id || !automata.lang || !automata.impl || !automata.path) return automata;

		return new SpokenCommand(automata, automata.path);
	}
}

module.exports = SpokenCommand;
