import { net } from 'electron';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

export function isDev() {
	return (
		process &&
		process.mainModule &&
		process.mainModule.filename &&
		process.mainModule.filename.indexOf('app.asar') === -1
	);
}

// Assuming the package.json file is in the root directory
export const appVersion = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8')).version;

export function tryAndGetGrammarFromNetwork(url) {
	return new Promise((res, rej) => {
		const request = net.request(url + '/grammar.json');

		request.on('response', (response) => {
			const result = [];

			response.on('data', (chunk) => {
				result.push(new TextDecoder().decode(chunk));
			});

			response.on('end', () => {
				const g = result.join('');

				if (!g) return res(null);

				try {
					const p = JSON.parse(g);

					console.log('Using spoken grammar provided by webapp!');

					res(p);
				} catch (e) {
					res(null);
				}
			});
		});

		request.on('error', () => res(null));

		request.end();
	});
}