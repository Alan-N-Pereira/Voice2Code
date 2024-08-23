import React from 'react';
import Spoken from 'spoken';
import IpcRenderer from './electron-ipc';

// Define the GlobalContext using React.createContext
export const GlobalContext = React.createContext({});

export default function GlobalContextProvider(props) {
    const [state, setState] = React.useState({
        language: props.lang || 'pt-BR',
        shadeIsOpen: false,
        __debug: true,
        spokenIsLoaded: false,
        connectedToVSCode: false,
        changingLanguage: false,
        editorState: []
    });

    const changeEditor = (t) => {
        IpcRenderer.send('Config:changeEditor', t);
    };

    const toggleShade = (t) => {
        setState((sstate) => ({
            ...sstate,
            shadeIsOpen: t !== undefined ? t : !state.shadeIsOpen
        }));
    };

    const toggleDebug = () => {
        setState((sstate) => ({
            ...sstate,
            __debug: !sstate.__debug
        }));
    };

    const changeLanguage = (lang) => setState((s) => ({ ...s, language: lang }));

    const executeInternalCommand = (command) => {
        if (command.id === '__change_lang') {
            setState((sstate) => ({ ...sstate, changingLanguage: true }));
            IpcRenderer.send('VoiceRecognition:setRecording', false);
            setTimeout(() => changeLanguage(command.lang === 'pt-BR' ? 'en-US' : 'pt-BR'), 1500);
            setTimeout(() => {
                IpcRenderer.send('VoiceRecognition:setRecording', true);
                setState((sstate) => ({ ...sstate, changingLanguage: false }));
            }, 3000);
        }
    };

    React.useEffect(() => {
        Spoken.init().then(() => {
            setState((state) => ({ ...state, spokenIsLoaded: true }));
        });

        IpcRenderer.on('Config:onChangeEditorState', (editorState) => {
            const connected = editorState?.find(({ name }) => {
                const d = name.toLowerCase();
                return d === 'vscode' || d === 'codemirror';
            })?.status === 'ON';

            if (!connected) IpcRenderer.send('VoiceRecognition:setRecording', false);

            setState((sstate) => ({
                ...sstate,
                editorState: editorState,
                connectedToVSCode: connected
            }));
        });

        // Request the current editor
        IpcRenderer.send('Config:changeEditor', null);
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                ...state,
                changeEditor,
                changeLanguage,
                toggleShade,
                toggleDebug,
                executeInternalCommand,
                mode: props.mode,
                onOpen: props.onOpen,
                onClose: props.onClose,
                onToggleRecording: props.onToggleRecording
            }}
        >
            {state.spokenIsLoaded ? props.children : (<div>Loading...</div>)}
        </GlobalContext.Provider>
    );
}