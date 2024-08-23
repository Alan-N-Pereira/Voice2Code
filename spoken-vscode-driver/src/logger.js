const { window } = require('./vscode');

const out = window.createOutputChannel('Spoken');

function log(obj) {
	out.appendLine('[' + new Date().toISOString() + ']' + obj);
}

module.exports = log;
