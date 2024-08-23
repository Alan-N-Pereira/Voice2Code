import { useState, useCallback, useEffect } from 'react';
import socket from '../socket-io';
import IpcRenderer from '../electron-ipc';

/**
 * @deprecated Now we use Azure voice recognition service, maybe in the future
 * we can make google STT work again.
 * @returns VoiceRecognitionHook
 */
export const useVoiceRecognition = () => {
	const [ results, setResults ] = useState('');
	const [ error, setError ] = useState(null);
	const myRecorder = MyRecorder.getRecorder();

	useEffect(() => {
		console.log('[server.webapp.main.useVoiceRecognition] Initialization');

		myRecorder.init((data) => {
			socket.emit('VoiceRecognitionSession:data', { data });
		});

		socket.on('VoiceRecognitionSession:error', (err) => {
			console.error(err);
		});

		socket.on('VoiceRecognitionSession:results', (data) => {
			setTimeout(() => IpcRenderer.send('Spoken:analyze', data), 3000);
		});

		// Inter-process communication: listen to node context requests
		IpcRenderer.on('Spoken:analysisResults', (data) => {
			setResults(data.phrase);
		});
	}, []);

	const start = useCallback(async () => {
		socket.emit('VoiceRecognitionSession:start', {}, () => {
			myRecorder.start();
		});
	}, []);

	const stop = useCallback(async () => {
		myRecorder.stop().then(() => {
			setTimeout(() => socket.emit('VoiceRecognitionSession:stop'), 750);
		});
	}, []);

	const analyzeSentence = useCallback(async (phrase) => {
		const w = {
			results: [
				{
					alternatives: [
						{
							transcript: phrase
						}
					]
				}
			]
		};
		socket.emit('VoiceRecognitionSession:byPass', w);
	}, []);

	return {
		results,
		start,
		stop,
		error,
		setError,
		analyzeSentence
	};
};

class MyRecorder {
	static recorder = null;
	audioContextWrapper = null;
	rawStream = null;

	static getRecorder() {
		if (MyRecorder.recorder == null) {
			MyRecorder.recorder = new MyRecorder();
		}

		return MyRecorder.recorder;
	}

	// Turns on the physical microphone
	// Also, asks for permission to use it
	async init(onAudioProcess) {
		this.rawStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: false,
				autoGainControl: false
			},
			video: false
		});

		const audioContext = new AudioContext();

		// For some reason it starts 'running' (so we suspend as soon as we create)
		audioContext.suspend();

		// Reverse engineering the source of Google 'Try it' page (speech-to-text)
		const streamSource = audioContext.createMediaStreamSource(this.rawStream);
		const processor = audioContext.createScriptProcessor(4096, 1, 1);

		processor.connect(audioContext.destination);
		streamSource.connect(processor);

		processor.addEventListener('audioprocess', (data) => {
			// I got that code from Google speech-to-text 'Try it' page
			const channelData = data.inputBuffer.getChannelData(0) || new Float32Array(4096);

			for (var b = channelData.length, d = new Int16Array(b); b--; ) {
				d[b] = 32767 * Math.min(1, channelData[b]);
			}

			onAudioProcess(channelData.buffer);
		});

		this.audioContextWrapper = {
			audioContext,
			streamSource,
			processor,
			mediaTrack: this.rawStream.getTracks()[0]
		};

		console.log('[MyRecorder.init] Microphone is on');
	}

	// Start recording
	async start() {
		console.log('[MyRecorder.start] Recording started');
		return this.audioContextWrapper.audioContext.resume();
	}

	// Stop recording
	async stop() {
		console.log('[MyRecorder.stop] Recording stopped');
		return this.audioContextWrapper.audioContext.suspend();
	}
}
