const graphlib = require('./graphlib');
const Modules = require('./modules-loader');
const SpokenCommand = require('./spoken-command').default;
const PhraseRecognizer = require('./recognizer').default;
const LOG = require('./logger').default;

class Spoken {
	async init(val) {
		await Modules.load(val);
	}

	get modules() {
		return Modules.list;
	}

	get context() {
		return Modules.context;
	}

	recognizePhrase(phrase, lang) {
		if (!Modules || !Modules.list || !Modules.list.length) {
			throw new Error('Grammar is not loaded');
		}

		LOG.info('Looking for a match for: ', `"${phrase}"`);

		const result = PhraseRecognizer.recognize(phrase, lang);

		if (result == null) return null;

		LOG.info('Match found for:', `"${phrase}"`, 'ID:', result[0].graph().id, 'Path:', result[1].path);

		const [ graph, state ] = result;

		return new SpokenCommand(graph.graph(), state.path);
	}

	findById(id, lang) {
		if (!Modules || !Modules.list || !Modules.list.length) {
			throw new Error('Grammar is not loaded');
		}

		const result = Modules.findAutomataById(id, lang);

		if (result == null) return null;

		return new SpokenCommand(result.graph());
	}
}

module.exports = new Spoken();

module.exports.SpokenCommand = SpokenCommand;
module.exports.SpokenModule = Modules.SpokenModule;
module.exports.Editor = require('./modules/d').Editor;
