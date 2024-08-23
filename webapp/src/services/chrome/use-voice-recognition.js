import { useState, useEffect, useContext } from 'react';
import Spoken from 'spoken';
import IpcRenderer from '../electron-ipc';
import MyRecognizer from './voice-recognizer';
import { GlobalContext } from '../global-context';

const useChromeVoiceRecognition = () => {
	const [ results, setResults ] = useState(null);
	const [ error, setError ] = useState(null);
	const { language = 'pt-BR', executeInternalCommand } = useContext(GlobalContext);
	const recognizer = MyRecognizer.getRecognizer();

	useEffect(() => {
		IpcRenderer.on('Spoken:executeCommandResult', (result) => {
			// console.log('[webapp.services.chrome-voice-recognition.onResultError]: Execute command result: ', result)
		});

		return () => {
			IpcRenderer.removeAllListeners('Spoken:executeCommandResult');
		};
	}, []);

	useEffect(
		() => {
			console.log('[webapp.services.chrome-voice-recognition]: Initializing');

			recognizer
				.on('results', (results, isFinal) => {
					const result = results[results.length - 1][0];

					if (!result.transcript || result.transcript.trim() === '') return;

					result.text = result.transcript.trim();

					const attempt = {
						text: sanitizePonctuation(result.text, language),
						isFinal,
						id: Date.now(),
						recognized: false
					};

					if (isFinal) {
						const match = findComand(result, language);

						attempt.recognized = !!match;
						attempt.command = match ? match.id : null;

						if (attempt.recognized) {
							if (match && match.id && match.id.startsWith('__')) {
								executeInternalCommand(match);
							} else {
								IpcRenderer.send('Spoken:executeCommand', match);
							}
						}
					}

					setResults(attempt);
				})
				.on('error', (err) => {
					setError({
						__error: err,
						mainTitle: 'Chrome STT provider is vendor specific',
						title: 'This browser does not support the SpeechRecognition API',
						subTitle: 'Try switching STT provider to Azure or accessing this website using Chrome or Edge',
						body: `Not all browsers support the <i>webkitSpeechRecognition</i> API which powers this project, currently only Google Chrome,
                    MS Edge and Safari* have support to it. Try viewing this website on a supported browser or change the STT provider to Azure on
                    top bar menu.<br/><br/>
                    <b>You can still use the debug option to write commands instead of saying them.</b>`
					});
					console.error('[webapp.services.chrome-voice-recognition.onResultError]: Error', err);
				})
				.init(language);

			return () => {
				recognizer.destroy();
			};
		},
		[ language ]
	);

	const start = async () => {
		recognizer.start();
	};

	const stop = async () => {
		recognizer.stop();
	};

	const analyzeSentence = async (phrase, timeout = 3000) => {
		const match = findComand({ text: sanitizePonctuation(phrase, language) }, language);

		const attempt = {
			text: phrase,
			isFinal: true,
			id: Date.now(),
			recognized: !!match,
			command: match ? match.id : null
		};

		const fn = () => {
			setResults(attempt);
			if (attempt.recognized) {
				if (match && match.id && match.id.startsWith('__')) {
					executeInternalCommand(match);
				} else {
					IpcRenderer.send('Spoken:executeCommand', match);
				}
			}
		};

		if (timeout) setTimeout(fn, timeout);
		else fn();
	};

	return {
		results,
		start,
		stop,
		error,
		setError,
		analyzeSentence
	};
};

function findComand(voiceToTextResponse, language) {
	const text = sanitizePonctuation(voiceToTextResponse.text, language);
	const result = Spoken.recognizePhrase(text.toLocaleLowerCase(), language);

	if (result != null) {
		result.extra._rawVoiceToTextResponse = voiceToTextResponse;
		result.extra.phrase = text;
	}

	return result;
}

function sanitizePonctuation(text, language) {
	text = text.replace(/(?<! )(:|\*|,|\.|\?|!)/gi, ' $1');

	// sorry...
	// TODO: FIXME
	if (language === 'pt-BR') {
		return text.replace(/aspa(s|)/gi, '*');
	} else {
		return text.replace(/quote(s|)/gi, '*');
	}
}

export default useChromeVoiceRecognition;
