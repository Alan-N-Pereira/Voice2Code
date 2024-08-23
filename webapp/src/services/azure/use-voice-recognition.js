import { useState, useEffect, useContext } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import Spoken from 'spoken';
import MyRecognizer from './voice-recognizer';
import IpcRenderer from '../electron-ipc';
import { GlobalContext } from '../global-context';

const useAzureVoiceRecognition = () => {
	const [ results, setResults ] = useState(null);
	const [ error, setError ] = useState(null);
	const { language = 'pt-BR', executeInternalCommand } = useContext(GlobalContext);
	const recognizer = MyRecognizer.getRecognizer();

	useEffect(() => {
		IpcRenderer.on('Spoken:executeCommandResult', (result) => {
			console.log('[webapp.services.azure-voice-recognition.onResult]: Execute command result: ' + result);
		});

		return () => {
			IpcRenderer.removeAllListeners('Spoken:executeCommandResult');
		};
	}, []);

	useEffect(
		() => {
			console.log('[webapp.services.azure-voice-recognition]: Initializing');

			recognizer
				.on('results', (result, isFinal) => {
					if (!result.text || result.text.trim() === '') return;

					const attempt = {
						text: sanitizePonctuation(result.text, language),
						isFinal,
						id: Date.now(),
						recognized: false,
						command: undefined
					};

					if (isFinal) {
						const match = findComand(result, language);

						attempt.recognized = !!match;
						attempt.command = match && match.id;

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
						mainTitle: 'Could not connect to Azure Speech to Text',
						title: "Azure STT doesn't seem to be working",
						subTitle: 'Try switching STT provider to Chrome',
						body: `This project is powered by Azure Speech to Text, which is a paid service, so maybe my free credits are over.
                        If you are in the demo page try switching the STT provider to Chrome (free, works on Chrome and Edge).<br/><br/>
                        <b>You can switch the STT provider to Chrome on the topbar menu or use the debug option to issue voice
                            commands in text.</b>`
					});
					console.error('[webapp.services.azure-voice-recognition.onResultError]: Error', err.toString());
				})
				.init(language);

			return () => {
				recognizer.destroy();
			};
		},
		[ language ]
	);

	const start = async () => {
		console.log('start');
		recognizer.start();
	};

	const stop = async () => {
		console.log('stop');
		recognizer.stop();
	};

	const analyzeSentence = async (phrase, timeout = 3000) => {
		const w = { text: sanitizePonctuation(phrase, language) };
		const match = findComand(w, language);

		const attempt = {
			text: phrase,
			isFinal: true,
			id: Date.now(),
			recognized: !!match,
			command: match && match.id
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

	if (language === 'pt-BR') {
		return text.replace(/aspa(s|)/gi, '*');
	} else {
		return text.replace(/quote(s|)/gi, '*');
	}
}

export default useAzureVoiceRecognition;
