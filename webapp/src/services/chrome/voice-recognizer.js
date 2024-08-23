export default class MyRecognizer {
	static instance = null;
	recognizing = false;
	recognizer = null;
	handlers = new Map();
	isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;

	static getRecognizer() {
		if (MyRecognizer.instance == null) {
			MyRecognizer.instance = new MyRecognizer();
		}

		return MyRecognizer.instance;
	}

	async init(lang) {
		try {
			this.recognizer = new webkitSpeechRecognition();
		} catch (err) {
			return this.handlers.get('error') != null ? this.handlers.get('error')(err) : null;
		}

		try {
			const speechRecognitionList = new webkitSpeechGrammarList();
			speechRecognitionList.addFromString('#JSGF V1.0; grammar one; public <gap> = gap;', 1);
			speechRecognitionList.addFromString('#JSGF V1.0; grammar one; public <string> = string;', 1);

			this.recognizer.grammars = speechRecognitionList;
		} catch (err) {
			console.info('Safari does not implement webkitSpeechGrammarList.');
		}

		this.recognizer.continuous = true;
		this.recognizer.lang = lang;
		this.recognizer.interimResults = false;
		this.recognizer.maxAlternatives = 1;

		this.recognizer.onresult = (event) => {
			console.log('[Chrome Recognizer] Results', event.results);

			const fn = this.handlers.get('results');

			if (fn != null) fn(event.results, true);
		};

		this.recognizer.onspeechend = (event) => {
			console.log('[Chrome Recognizer] SpeechEnd', event);
		};

		this.recognizer.onend = (event) => {
			console.log('[Chrome Recognizer] End', event);

			// Mobile Android Google Chrome does not respect continuous mode.
			// I don't know about other browsers.
			if (this.isAndroid && this.recognizing) {
				console.log('[Buggy Android Chrome Recognizer] Premature ending! We are still talking.');
				this.start();
			}
		};

		this.recognizer.onnomatch = (event) => {
			console.log('Could not recognize that!');
		};

		this.recognizer.onerror = (event) => {
			const fn = this.handlers.get('error');

			if (fn != null) fn(event.error);
		};
	}

	start() {
		if (this.recognizer == null) {
			return console.error('[webapp.services.chrome-voice-recognition]: Session is closed!');
		}

		this.recognizer.start();
		this.recognizing = true;

		console.info('[webapp.services.chrome-voice-recognition]: Started');
	}

	stop() {
		this.recognizing = false;

		if (this.recognizer == null) {
			return console.error('[webapp.services.chrome-voice-recognition]: Session is closed!');
		}

		this.recognizer.stop();

		console.info('[webapp.services.chrome-voice-recognition]: Stopped');
	}

	destroy() {
		console.info('[webapp.services.chrome-voice-recognition]: Destroyed');

		if (this.recognizer) {
			this.recognizer.stop();
			this.recognizer.abort();
		}

		this.recognizer = null;
		this.handlers.clear();
	}

	on(event, fn) {
		this.handlers.set(event, fn);
		return this;
	}
}
