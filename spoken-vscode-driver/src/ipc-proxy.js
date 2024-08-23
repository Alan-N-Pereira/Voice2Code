const ipc = require('node-ipc');
const Log = require('./logger');
const { Proxy } = require('./index');

ipc.config.id = 'speechtocodechannel';
ipc.config.retry = 1500;
ipc.config.silent = true;

class IpcProxy {
	constructor() {
		this.map = new Map();
	}

	on(mainChannel, proxyTo) {
		this.map.set(mainChannel, proxyTo);
	}

	init() {
		ipc.serve(() => {
			Log('[vscode-driver.ipc-proxy.init]: Server is listening on hostname "speechtocodechannel"');
			for (const [ key, value ] of this.map.entries()) {
				ipc.server.on(key, value.proxy.bind(value));
			}
		});

		ipc.server.start();
	}

	close() {
		ipc.server.stop();
	}
}

module.exports = new IpcProxy();
