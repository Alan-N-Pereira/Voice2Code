import CodeMirror from 'codemirror';
import { Editor as SpokenEditor } from 'spoken';

interface RunCodeLifeCycle {
    before: () => void,
    success: (result: string) => void,
    error: (ex: Error) => void,
    after: () => void
}

// @ts-ignore
class CodeMirrorEditor implements SpokenEditor {
    // Infer the correct type using ReturnType<typeof CodeMirror>
    private editor: ReturnType<typeof CodeMirror> | null = null;
    private runCodeLifecycle: RunCodeLifeCycle | null = null;

    public getEditor(): [ReturnType<typeof CodeMirror> | null, Error | null] {
        const editor = this.editor;

        if (editor == null) return [null, new Error('No active text editor')];

        return [editor, null];
    }

    public setEditor(editor: ReturnType<typeof CodeMirror>) {
        this.editor = editor;
    }

    public onRunCode(lifecycle: RunCodeLifeCycle): void {
        this.runCodeLifecycle = lifecycle;
    }

    public runCode(): void {
        const { after, before, error, success } = this.runCodeLifecycle!;

        before();

        const code = this.getEditor()[0]!.getValue();

        this.runThisCode(code).then(success).catch(error).finally(after);
    }

    // The rest of the class methods remain unchanged
    async write(text: string = '') {
        console.log('[vscode-driver.robot-vscode.write]: Executing write(' + text + ')');

        const [editor, e] = this.getEditor();

        if (editor == null) throw e;

        if (editor.getSelection().length > 0) {
            const sel = editor.listSelections()[0];

            editor.replaceSelection(text);

            editor.setSelection(sel.anchor, { ...sel.head, ch: sel.anchor.ch + text.length });
        } else {
            editor.replaceRange(text, editor.getCursor());
        }
    }

    // ... and so on with the other methods ...

    private runThisCode(code: string) {
        return new Promise<string>((res, rej) => {
            try {
                // eslint-disable-next-line no-eval
                eval(`
                    console.defaultLog = console.log.bind(console);
                    console.logs = [];
                    console.log = function() {
                        console.defaultLog.apply(console, arguments);
                        console.logs.push(Array.from(arguments));
                    }
    
                    ${code}
                `);
    
                const text = console.logs!.map(item => item.join(' ')).join('\n');
    
                setTimeout(() => res(text), 1500);
            } catch (ex) {
                // Use type assertion to treat ex as Error
                const error = ex as Error;
                setTimeout(() => rej(error.toString()), 1500);
            } finally {
                if (console.defaultLog) {
                    console.log = console.defaultLog.bind(console);
                    delete console['defaultLog'];
                }
    
                delete console['logs'];
            }
        });
    }
}

const codeMirrorEditorInstance = new CodeMirrorEditor();
export default codeMirrorEditorInstance;