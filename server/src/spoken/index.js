let spokenInstancePromise;

(async () => {
    const { default: Spoken } = await import('spoken');

    class SpokenInterface {
        constructor() {
            if (typeof Spoken.init === 'function') {
                Spoken.init();
            } else {
                console.error('Spoken.init is not a function');
            }
        }

        findComand(voiceToTextResponse, lang) {
            console.log('[server.src.Spoken.findCommand] Warn: Ignoring other matches!');
            return findComand(voiceToTextResponse, lang);
        }

        list() {
            return Spoken.modules;
        }
    }

    function findComand(voiceToTextResponse, language) {
        const text = sanitizePonctuation(voiceToTextResponse.text);
        const result = Spoken.recognizePhrase(text.toLocaleLowerCase(), language);

        if (result != null) {
            result.extra._rawVoiceToTextResponse = voiceToTextResponse;
            result.extra.phrase = text;
        }

        return result;
    }

    function sanitizePonctuation(text) {
        return text.replace(/(?<! )(:|\*|,|\.|\?|\!)/gi, ' $1');
    }

    // Create the instance
    const spokenInterfaceInstance = new SpokenInterface();

    // Resolve the promise with the initialized instance
    spokenInstancePromise = Promise.resolve(spokenInterfaceInstance);
})();

export default async function getSpokenInstance() {
    if (!spokenInstancePromise) {
        throw new Error('Spoken instance is not initialized');
    }
    return spokenInstancePromise;
}