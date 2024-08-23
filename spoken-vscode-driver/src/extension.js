const vscode = require('./vscode');
const Log = require('./logger');
const IpcProxy = require('./ipc-proxy');
const RobotVSCodeProxy = require('./robot-proxy');

function activate(context) {
	Log('Spoken VSCode driver is ready!');

	let disposable = vscode.commands.registerCommand('spoken.helloWorld', async () => {
		vscode.window.showInformationMessage('Hello World from VSCode!');
	});

	context.subscriptions.push(disposable);

	IpcProxy.on('runCommand', RobotVSCodeProxy);
	IpcProxy.init();
}

function deactivate() {
	IpcProxy.close();
}

module.exports = {
	activate,
	deactivate
};
