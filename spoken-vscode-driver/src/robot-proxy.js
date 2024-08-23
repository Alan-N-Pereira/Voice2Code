const ipc = require('node-ipc');
const fs = require('fs');
const { Socket } = require('net');
const RobotVscode = require('./robot-vscode');
const Log = require('./logger');

const DEBUG_LIVE_RELOAD = false;

class RobotVSCodeProxy {
	async proxy(request, socket) {
		try {
			Log('[vscode-driver.robot-vscode.proxy]: Received request to process:\n\t' + JSON.stringify(request));

			let response = null;

			if (DEBUG_LIVE_RELOAD) {
				response = await this.liveRelodingTestingOnly(request);
			} else {
				response = await RobotVscode[request.type](...request.extra.args);
			}

			Log('[vscode-driver.robot-vscode.proxy]: Emitting response for ' + request.id);

			ipc.server.emit(socket, 'runCommand/response', {
				id: request.id,
				err: false,
				response
			});
		} catch (err) {
			Log('[vscode-driver.robot-vscode.proxy]: Error executing ' + request.type + '\n' + err);
			ipc.server.emit(socket, 'runCommand/response', {
				id: request.id,
				err: err || true,
				response: null
			});
		}
	}

	async liveRelodingTestingOnly(request) {
		if (this.vscodeRobotInstance == null) {
			const str = fs.readFileSync(__dirname + '/robot-vscode.js', 'utf-8');
			const createInstance = eval(str);

			this.vscodeRobotInstance = createInstance();
		}

		return await this.vscodeRobotInstance[request.type](...request.extra.args);
	}
}

module.exports = new RobotVSCodeProxy();
