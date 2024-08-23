declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
        SpeechGrammarList: typeof SpeechGrammarList;
        webkitSpeechGrammarList: typeof SpeechGrammarList;
    }

    var SpeechRecognition: {
        prototype: SpeechRecognition;
        new (): SpeechRecognition;
    };

    var SpeechGrammarList: {
        prototype: SpeechGrammarList;
        new (): SpeechGrammarList;
    };

    interface SpeechRecognition {
        grammars: SpeechGrammarList;
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        maxAlternatives: number;
        onaudiostart: (() => void) | null;
        onaudioend: (() => void) | null;
        onend: ((event: Event) => void) | null;
        onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
        onnomatch: ((event: SpeechRecognitionEvent) => void) | null;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onsoundstart: (() => void) | null;
        onsoundend: (() => void) | null;
        onspeechend: ((event: Event) => void) | null;
        onstart: (() => void) | null;
        abort(): void;
        start(): void;
        stop(): void;
    }

    interface SpeechGrammarList {
        addFromString(grammar: string, weight: number): void;
        addFromURI(src: string, weight: number): void;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
    }

    interface SpeechRecognitionEvent extends Event {
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
        readonly length: number;
        isFinal: boolean;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }
}

export {};