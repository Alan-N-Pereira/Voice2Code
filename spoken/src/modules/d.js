/**
 * @typedef {Object} ParsedPhrase
 * @property {string} phrase
 * @property {string} [parent]
 * @property {Record<string, string>} [extra]
 */

/**
 * @typedef {Object} WildCard
 * @property {string} value
 * @property {boolean} wildCard
 */

const PositionEnum = {
	ABOVE: 0,
	BELOW: 1
};

/**
 * List of interactions supported by this editor
 * 
 * This serves as a reference for what methods an Editor object should implement.
 * In JavaScript, this is represented as a JSDoc comment with a @typedef annotation.
 */

/**
 * @typedef {Object} Editor
 * @property {function(string): Promise<void | Error>} write - Writes something in the current text input.
 * @property {function(number | [[number, number], [number, number]]): Promise<void | Error>} remove - Removes the provided selection/line.
 * @property {function(0 | 1): Promise<void | Error>} newLine - Creates a new line above or below the current line.
 * @property {function(string, 'END' | 'BEGIN'=): Promise<string | Error>} goToLine - Moves the cursor to a different line.
 * @property {function('END_LINE' | 'BEGIN_LINE' | 'SYMBOL' | null, string=, number=): Promise<void | Error>} moveCursorTo - Finds the position of a given token in the current line.
 * @property {function(RegExp | string, number=, number=): Promise<number[][] | Error>} findPositionOf - Finds the range of a term in a given line.
 * @property {function(number, number, boolean): Promise<string | Error>} select - Select a piece of text in the editor.
 * @property {function(number=): Promise<{lineNumber: number, text: string, _text: string, _line: number, character: number} | Error>} getLine - Retrieves the content of the provided line.
 * @property {function([string, string]=, [string, string]=): Promise<void | Error>} indentSelection - Indents the provided selection or the active one.
 * @property {function(string): Promise<void | Error>} writeOnTerminal - Writes something in the terminal and press enter.
 * @property {function(string=): Promise<Record<string, any> | Error>} fileInfo - Retrieves information about a file.
 * @property {function(): Promise<void | Error>} undo - Undo the last operation - CTRL+Z.
 * @property {function(): Promise<void | Error>} redo - Redo the last operation - CTRL+Y.
 * @property {function(...args: any): Promise<unknown | Error>} [key] - Everything else - custom editor may choose to implement custom methods.
 */

module.exports = {
	PositionEnum
};
