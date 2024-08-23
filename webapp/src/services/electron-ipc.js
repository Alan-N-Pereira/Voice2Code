// Define the ElectronIpc interface (in TypeScript, this would define the structure, but it's not needed in JavaScript)
class FakeIpc {
	constructor() {
		this.editors = [
			{
				name: 'VSCODE',
				status: 'ON',
				current: true
			},
			{
				name: 'DEFAULT',
				status: 'ON',
				current: false
			}
		];

		this.changeEditorCallback = () => {};
	}

	send(channel, editor) {
		console.warn('IPC not defined (this is a electron application!)');
		if (channel === 'Config:changeEditor') {
			this.changeEditor(editor);
		}
	}

	removeAllListeners(channel) {
		console.warn('IPC not defined (this is a electron application!)');
	}

	changeEditor(editor) {
		editor = editor || 'VSCODE';
		this.editors = this.editors
			.map((item) => ({ ...item, current: false }))
			.map((item) => ({ ...item, current: item.name === editor }));

		this.changeEditorCallback(this.editors);
	}

	on(channel, cb) {
		console.warn('IPC not defined (this is a electron application!)');
		if (channel === 'Config:onChangeEditorState') {
			this.changeEditorCallback = cb;
		}
	}
}

// Use the existing ipcRenderer from the window object, or fallback to the FakeIpc instance
const _ipcRenderer = window.ipcRenderer || new FakeIpc();

export default _ipcRenderer;
export { _ipcRenderer as ipcRenderer };
