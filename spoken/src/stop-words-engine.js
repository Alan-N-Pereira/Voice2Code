class StopWordsEngine {
	constructor(stopWordList, stopExpressionList = []) {
		this.cache = new Map();
		this.stopWordList = stopWordList;
		this.stopExpressionList = stopExpressionList;
	}

	removeStopWords(phrase) {
		const words = phrase.trim().split(' ');
		const nwords = [];

		let i = 0;
		while (i < words.length) {
			const skip = this.skipStopWords(i, words);

			if (skip !== 0) {
				i += skip;
				continue;
			}

			nwords.push(words[i]);

			i += 1;
		}

		return nwords.join(' ');
	}

	sanitizeStopExpressions(phrase) {
		for (const exp of this.stopExpressionList) {
			phrase = phrase.replace(new RegExp('\\b' + exp + '\\b', 'gi'), exp.replace(/ /gi, ''));
		}

		return phrase;
	}

	skipStopWords(currentWordIndex, words) {
		const word = words[currentWordIndex];

		// simple stop word
		if (this.stopWordList.includes(word)) return 1;

		// stop expression (more than one word)
		for (const expression of this.stopExpressionList) {
			const slice = words.slice(currentWordIndex, currentWordIndex + expression.split(' ').length);

			if (expression === slice.join(' ')) return slice.length;
		}

		// complex stop word (depends on the context)
		for (const exp of this.stopWordList) {
			if (!exp.match(/ -> | !> /)) continue;

			if (this.test(word, this.parse(exp, words, currentWordIndex))) return 1;
		}

		return 0;
	}

	test(word, expression) {
		if (word.toLowerCase() !== expression.root.toLowerCase()) return false;

		for (const c of expression.clauses) {
			if (c.op === 1) {
				if (typeof c.left === 'string' && c.right.includes(c.left)) continue;
				if (Array.isArray(c.left) && c.right.find((b) => c.left.includes(b))) continue;

				return false !== expression.negative;
			}

			if (c.op === -1) {
				if (typeof c.left === 'string' && !c.right.includes(c.left)) continue;
				if (Array.isArray(c.left) && !c.right.find((b) => c.left.includes(b))) continue;

				return false !== expression.negative;
			}
		}

		return true !== expression.negative;
	}

	parse(exp, words, index) {
		const [ root, tmp ] = exp.split(/ -> | !> /);
		const clauses = tmp.split(' & ').map((item) => {
			const [ left, right ] = item.split(/ [\!=]= /);
			const [ op ] = item.match(/[\!=]=/gi);

			return {
				left: this.parseOperand(left, words, index),
				right: this.parseOperand(right, words, index),
				op: op === '==' ? 1 : -1
			};
		});

		return {
			root,
			clauses,
			negative: exp.includes('!>')
		};
	}

	parseOperand(exp, words, i) {
		if (/(P|N)\d/gi.test(exp)) {
			const result = exp.match(/(P|N)(\d+)/);
			const step = parseInt(result[2], 10) * (result[1] === 'N' ? 1 : -1);

			return words[i + step] || '';
		} else if (exp.trim() === 'S') {
			return words;
		} else if (/\((.*?)\)/.test(exp)) {
			return exp.match(/\((.*?)\)/)[1].split('|');
		}

		return exp;
	}
}

module.exports = StopWordsEngine;
