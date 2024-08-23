const vscode = require('./vscode');
const Log = require('./logger');

class RobotVscode {
	getEditor() {
		const editor = vscode.window.activeTextEditor;

		if (editor == null) return [ null, new Error('No active text editor') ];

		return [ editor, null ];
	}

	write = (text) =>
		new Promise((res, rej) => {
			Log('[vscode-driver.robot-vscode.write]: Executing write(' + text + ')');

			const [ editor, e ] = this.getEditor();

			if (editor == null) return rej(e);

			editor
				.edit((editBuilder) => {
					editBuilder.replace(editor.selection, '');
					editBuilder.insert(editor.selection.active, text);
				})
				.then((ok) => {
					if (!ok) return rej(new Error('Something went wrong!'));
					res();
				});
		});

	remove = (selection) =>
		new Promise((res, rej) => {
			Log('[vscode-driver.robot-vscode.write]: Executing remove(' + selection + ')');

			const [ editor, e ] = this.getEditor();

			if (editor == null) return rej(e);

			vscode.commands.executeCommand('editor.action.deleteLines').then(() => res());
		});

	newLine = (pos) =>
		new Promise(async (res, rej) => {
			Log('[vscode-driver.robot-vscode.newLine]: Executing newLine');

			const [ editor, e ] = this.getEditor();

			if (editor == null) return rej(e);

			if (pos === 0) {
				await this.goToLine(String(editor.selection.active.line), 'END');
			}

			editor
				.edit((editBuilder) => {
					editBuilder.insert(editor.selection.active, '\n');
				})
				.then((ok) => {
					if (!ok) return rej(new Error('Something went wrong!'));
					res();
				});
		});

	goToLine = (number, cursorPosition = 'BEGIN') =>
		new Promise(async (res, rej) => {
			try {
				const [ editor, e ] = this.getEditor();

				if (editor == null) return rej(e);

				const destLine = parseInt(number);

				editor.selection = new vscode.Selection(editor.selection.active, editor.selection.active);

				const line = editor.selection.active.line + 1;
				const to = destLine > line ? 'down' : 'up';
				const value = to === 'down' ? destLine - line : line - destLine;

				if (value === 0) return res(editor.document.lineAt(line - 1).text);

				vscode.commands.executeCommand('cursorMove', { to, value, by: 'line' }).then(() => {
					vscode.commands.executeCommand('revealLine', { lineNumber: destLine, at: 'center' }).then(() => {
						const text = editor.document.lineAt(destLine - 1).text;

						if (cursorPosition === 'END') {
							return vscode.commands
								.executeCommand('cursorMove', { to: 'wrappedLineEnd' })
								.then(() => res(text));
						}

						const index = text.length - text.trimLeft().length;

						vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineStart' }).then(() => {
							if (index <= 0) return res(text);

							vscode.commands
								.executeCommand('cursorMove', { to: 'right', value: index, by: 'character' })
								.then(() => res(text));
						});
					});
				});
			} catch (err) {
				rej(err);
			}
		});

	lineBoundaries(line, withWhiteSpace = false) {
		const rStart = withWhiteSpace ? 'wrappedLineStart' : 'wrappedLineFirstNonWhitespaceCharacter';
		const rEnd = withWhiteSpace ? 'wrappedLineEnd' : 'wrappedLineLastNonWhitespaceCharacter';
		const aStart = withWhiteSpace ? 0 : line.firstNonWhitespaceCharacterIndex;
		const aEnd = line.text.length;

		return {
			relative: [ rStart, rEnd ],
			absolute: [ aStart, aEnd ]
		};
	}

	stringMatchAll(text, regex) {
		const indices = [];
		let match = null;

		while ((match = regex.exec(text)) != null) {
			indices.push([ match.index, match.index + match[0].length ]);
		}

		return indices;
	}

	findAllOccurrences(lineNumber, regex, pad = 0) {
		const [ editor, e ] = this.getEditor();

		if (editor == null) return [];

		const line = editor.document.lineAt(lineNumber);
		const text = line.text.substr(pad);

		return this.stringMatchAll(text, regex);
	}

	moveCursorTo = (to, symbol, leapSize) =>
		new Promise((res, rej) => {
			const [ editor, e ] = this.getEditor();

			if (editor == null) return rej(e);

			function moveCursor(options) {
				if (options.value === 0) return res();

				return vscode.commands.executeCommand('cursorMove', options).then(() => res());
			}

			const currentLine = editor.document.lineAt(editor.selection.active.line);

			if (to === 'BEGIN_LINE' || to === 'END_LINE') {
				const { relative } = this.lineBoundaries(currentLine);

				return moveCursor({ to: relative[to === 'BEGIN_LINE' ? 0 : 1] });
			}

			if (to === null) {
				return moveCursor({ to: 'right', value: leapSize, by: 'character' });
			}

			if (to === 'SYMBOL' && symbol != undefined) {
				const { line, character } = editor.selection.active;

				const indices = this.findAllOccurrences(line, new RegExp(symbol, 'gi'), character);

				if (leapSize === -1) leapSize = indices.length;
				else if (leapSize == null) leapSize = 1;

				const range = indices[leapSize - 1];

				if (range == null) return rej('Match not found for symbol: ' + symbol);

				return moveCursor({ to: 'right', value: range[0], by: 'character' });
			}

			return rej(new Error('Unknown operation!'));
		});

	async findPositionOf(term, line, pad) {
		const [ editor, e ] = this.getEditor();

		if (editor === null) throw e;

		line = line || editor.selection.active.line;

		if (typeof term === 'string') {
			if (term === 'LINE_BOUNDARIES' || term === '') {
				return [ this.lineBoundaries(editor.document.lineAt(line), true).absolute ];
			}

			term = new RegExp(term, 'gi');
		}

		return this.findAllOccurrences(line, term, pad);
	}

	select = (from, to, line) =>
		new Promise((res, rej) => {
			const editor = vscode.window.activeTextEditor;

			if (editor == null) return rej(new Error('No active text editor'));

			try {
				if (line) {
					const lastCharacter = editor.document.lineAt(to - 1).text.length;
					editor.selection = new vscode.Selection(from - 1, 0, to - 1, lastCharacter);

					return res(editor.document.getText(editor.selection));
				}

				const currentLine = editor.selection.start.line;

				editor.selection = new vscode.Selection(currentLine, from, currentLine, to + 1);

				return res(editor.document.getText(editor.selection));
			} catch (err) {
				Log(err.toString());
				rej(err);
			}
		});

	async getLine(number) {
		try {
			const [ editor, e ] = this.getEditor();

			if (editor == null) throw e;

			number = number != null ? number : editor.selection.active.line;

			const d = editor.document.lineAt(number);
			return {
				_line: d.lineNumber,
				lineNumber: d.lineNumber,
				_text: d.text,
				text: d.text,
				character: editor.selection.active.character
			};
		} catch (err) {
			Log(err.toString());

			throw err;
		}
	}

	indentSelection = (p1, p2) =>
		new Promise((res, rej) => {
			try {
				const editor = vscode.window.activeTextEditor;

				if (editor == null) return rej(new Error('No active text editor'));

				if (p1 == null || p2 == null) {
					return vscode.commands.executeCommand('editor.action.formatDocument', {}).then(() => {
						res();
					});
				}

				p1[0] = p1[0] || editor.selection.active.line;
				p2[0] = p2[0] || editor.selection.active.line;

				const sp1 = p1.map((a) => parseInt(a, 10));
				const sp2 = p2.map((a) => parseInt(a, 10));

				sp1[0] = Math.max(0, sp1[0]);
				sp2[0] = Math.min(editor.document.lineCount, sp2[0]);

				editor.selection = new vscode.Selection(sp1[0], sp1[1], sp2[0], sp2[1]);

				vscode.commands.executeCommand('editor.action.reindentselectedlines', {}).then(() => {
					editor.selection = new vscode.Selection(editor.selection.end, editor.selection.end);
					res();
				});
			} catch (err) {
				rej(err);
			}
		});

	async writeOnTerminal(text) {
		try {
			await vscode.window.activeTextEditor.document.save();
			vscode.window.activeTerminal.show();
			vscode.window.activeTerminal.sendText(text);

			return;
		} catch (err) {
			throw err;
		}
	}

	async fileInfo(text) {
		try {
			const [ editor, err ] = this.getEditor();

			if (err) throw err;

			return {
				fileName: editor.document.fileName
			};
		} catch (err) {
			throw err;
		}
	}

	async undo() {
		try {
			return vscode.commands.executeCommand('undo');
		} catch (err) {
			throw err;
		}
	}

	async redo() {
		try {
			return vscode.commands.executeCommand('redo');
		} catch (err) {
			throw err;
		}
	}
}

module.exports = new RobotVscode();

module.exports.createInstance = function() {
	return new RobotVscode();
};
