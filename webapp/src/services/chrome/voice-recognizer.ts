export default class MyRecognizer {
    static instance: MyRecognizer | null = null;
    public recognizing = false;
    private recognizer: SpeechRecognition | null = null;
    private handlers = new Map<string, Function>();
    private isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    static getRecognizer(): MyRecognizer {
        if (MyRecognizer.instance == null) {
            MyRecognizer.instance = new MyRecognizer();
        }

        return MyRecognizer.instance;
    }

    async init(lang: string) {
        try {
            this.recognizer = new window.webkitSpeechRecognition();
        } catch (err) {
            return this.handlers.get('error')?.(err);
        }

        try {
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString('#JSGF V1.0; grammar one; public <gap> = gap;', 1);
            speechRecognitionList.addFromString('#JSGF V1.0; grammar one; public <string> = string;', 1);

            this.recognizer!.grammars = speechRecognitionList;
        } catch (err) {
            console.info('Safari does not implement webkitSpeechGrammarList.');
        }

        this.recognizer!.continuous = true;
        this.recognizer!.lang = lang;
        this.recognizer!.interimResults = false;
        this.recognizer!.maxAlternatives = 1;

        this.recognizer!.onresult = (event: SpeechRecognitionEvent) => {
            console.log('[Chrome Recognizer] Results', event.results);

            const fn = this.handlers.get('results');
            fn?.(event.results, true);
        };

        this.recognizer!.onspeechend = (event: Event) => {
            console.log('[Chrome Recognizer] SpeechEnd', event);
        };

        this.recognizer!.onend = (event: Event) => {
            console.log('[Chrome Recognizer] End', event);

            if (this.isAndroid && this.recognizing) {
                console.log('[Buggy Android Chrome Recognizer] Premature ending! We are still talking.');
                this.start();
            }
        };

        this.recognizer!.onnomatch = (event: SpeechRecognitionEvent) => {
            console.log('Could not recognize that!');
        };

        this.recognizer!.onerror = (event: SpeechRecognitionErrorEvent) => {
            const fn = this.handlers.get('error');
            fn?.(event.error);
        };
    }

    start() {
        if (!this.recognizer) {
            console.error('[webapp.services.chrome-voice-recognition]: Session is closed!');
            return;
        }

        this.recognizer.start();
        this.recognizing = true;

        console.info('[webapp.services.chrome-voice-recognition]: Started');
    }

    stop() {
        this.recognizing = false;

        if (!this.recognizer) {
            console.error('[webapp.services.chrome-voice-recognition]: Session is closed!');
            return;
        }

        this.recognizer.stop();
        console.info('[webapp.services.chrome-voice-recognition]: Stopped');
    }

    destroy() {
        console.info('[webapp.services.chrome-voice-recognition]: Destroyed');
        this.recognizer?.stop();
        this.recognizer?.abort();

        this.recognizer = null;
        this.handlers.clear();
    }

    on(event: string, fn: (...args: any) => void) {
        this.handlers.set(event, fn);
        return this;
    }
}