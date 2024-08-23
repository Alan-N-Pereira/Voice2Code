export interface Problem {
    id: string;
    index?: number;
    title: {
        'en-US': string;
    };
    placeholder: {
        'en-US': string;
    };
    statement: {
        'en-US': string;
    };
    solution: {
        'en-US': string[];
    };
    code: {
        'en-US': string;
    };
}

const welcome: Problem = {
    id: 'welcome',
    title: {
        'en-US': 'Hello World'
    },
    placeholder: {
        'en-US': `Speech2Code is a desktop application that enables you to code using just voice commands, 
        it achieves that by connecting to your favorite IDE and issuing commands to it. This page is a demo
        of said application <u>ported to the web</u>, here you can learn how to use this tool by solving simple 
        programming problems using just voice commands. <b>You may change the input language to pt-BR.</b> <br/><br/>
        The first problem is the classic "hello world" where you are meant to write "hello world" to
        the standard output.`
    },
    statement: {
        'en-US': 'Write the string "hello world" to the standard output in JavaScript.'
    },
    solution: {
        'en-US': [
            'Click on the microphone to start recording.',
            'Click on the first line of the code editor.',
            'Say the phrase: "go to line number 4."',
            'Say the phrase: "execute function print with one argument".',
            'Say the phrase: "text hello world text".',
            `Say the phrase: "please the run current file" or click on the green icon above the code editor.`,
            '<i>Check the program output in the section below the code editor.</i>',
            'Done.'
        ]
    },
    code: {
        'en-US': `const print = console.log\n\n`
    }
}

const avg: Problem = {
    id: 'avg',
    title: {
        'en-US': 'Mean'
    },
    placeholder: {
        'en-US': `Calculate the mean between two numbers.<br/><br/>
            <i class="fa fa-info-circle"></i> It's possible to say "remove line" to remove the current line.<br/>
            <i class="fa fa-info-circle"></i> Say "undo that" or "redo that" to undo or redo the last command.`
    },
    statement: {
        'en-US': 'Write a function to compute the average of two numbers.'
    },
    solution: {
        'en-US': [
            'Click on the microphone to start recording.',
            'Click on the first line of the code editor.',
            'Say the phrase: "go to line number 2."',
            'Say the phrase: "new function mean with 2 arguments returning gap".',
            'Say the phrase: "variable b".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "variable c".',
            'Say the phrase: "line 3".',
            'Say the phrase: "please create a line".',
            'Say the phrase: "line 3".',
            'Say the phrase: "new constant sum equals gap".',
            'Say the phrase: "expression variable b plus variable c".',
            'Say the phrase: "line 4".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "expression variable sum divided by number 2".',
            `Say the phrase: "run current file" or click on the green icon above the code editor.`,
            '<i>Check the program output in the section below the code editor.</i>',
            'Done.'
        ]
    },
    code: {
        'en-US': `\n\nconsole.log(mean(23, 7))`
    }
}

const perfectSquare: Problem = {
    id: 'perfectSquare',
    title: {
        'en-US': 'Perfect Square'
    },
    placeholder: {
        'en-US': 'Test if a number is a perfect square.<br/><br/><i class="fa fa-info-circle"></i> It\'s possible to say "write ..." to write anything in the current line.'
    },
    statement: {
        'en-US': `Write a function to check if a given number is a perfect square.
            Write to the standard output <i>'perfect square'</i> if yes and <i>'imperfect square'</i> if no.`
    },
    solution: {
        'en-US': [
            'Click on the microphone to start recording.',
            'Click on the first line of the code editor.',
            'Say the phrase: "go to line number 2."',
            'Say the phrase: "new function square with one argument".',
            'Say the phrase: "variable number".',
            'Say the phrase: "line 3".',
            'Say the phrase: "variable number equals gap".',
            'Say the phrase: "call function gap on namespace math with one argument".',
            'Say the phrase: "write SQRT".<br/><i>Just say the letters, you can try multiple times</i>.',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "variable number".',
            'Say the phrase: "pointer end of line".',
            'Say the phrase: "create a line".',
            'Say the phrase: "conditional statement if else expression gap equals number 0".',
            'Say the phrase: "expression variable number module number 1".',
            'Say the phrase: "line 5".',
            'Say the phrase: "call function print with the argument string perfect square string".',
            'Say the phrase: "line 7".',
            'Say the phrase: "execute function print with one argument".',
            'Say the phrase: "text imperfect square text".',
            `Say the phrase: "run current file" or click on the green icon above the code editor.`,
            '<i>Check the program output in the section below the code editor.</i>',
            'Done.'
        ]
    },
    code: {
        'en-US': '\n\nvar print = console.log\nsquare(4)\nsquare(13)'
    }
}

const multiplesOfSevenAndSix: Problem = {
    id: 'multipleSevenSix',
    title: {
        'en-US': 'Multiples of 6 or 7'
    },
    placeholder: {
        'en-US': `Use a <i>for loop</i> to list every multiple of 6 or 7.<br/><br/>
            <i class="fa fa-info-circle"></i> It's possible to say "select from line 3 to line 6" to select the interval between
            those lines or even "select from letter A to the letter T" to select the interval between those letters in the current line.`
    },
    statement: {
        'en-US': `Write a function to list every multiple of the number 6 or 7 in the inverval 0..256.`
    },
    solution: {
        'en-US': [
            'Click on the microphone to start recording.',
            'Click on the first line of the code editor.',
            'Say the phrase: "go to line number 4."',
            'Say the phrase: "repetition statement from number 0 to number 256".',
            'Say the phrase: "line 5".',
            'Say the phrase: "conditional statement expression gap or gap".',
            'Say the phrase: "expression gap module number 6 equals number 0".',
            'Say the phrase: "variable i".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "expression gap module number 7 equals number 0".',
            'Say the phrase: "variable i".',
            'Say the phrase: "line 6".',
            'Say the phrase: "call function print with the argument variable i".',
            `Say the phrase: "run current file" or click on the green icon above the code editor.`,
            '<i>Check the program output in the section below the code editor.</i>',
            'Done.'
        ]
    },
    code: {
        'en-US': 'var print = console.log\n\n'
    }
}

const happyNumber: Problem = {
    id: 'happyNumber',
    title: {
        'en-US': 'Happy Number'
    },
    placeholder: {
        'en-US': `Test if a given number <i>N</i> is a <a target="_blank" href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a>.<br/><br/>
            <i class="fa fa-info-circle"></i> It's possible to say "change language to portuguese" to change the input language to portuguese.`
    },
    statement: {
        'en-US': `Complete the function to test if a given natural number is a 
            <a target="_blank" href="https://en.wikipedia.org/wiki/Happy_number">Happy Number</a>. 
            <a target="_blank" href="https://www.youtube.com/watch?v=ee2If8jSxUo&t=19s">(happy primes)</a>`
    },
    solution: {
        'en-US': [
            'Click on the microphone to start recording.',
            'Click on the first line of the code editor.',
            'Say the phrase: "line 5".',
            'Say the phrase: "create line".',
            'Say the phrase: "line 5".',
            'Say the phrase: "conditional statement expression gap equals number 1".',
            'Say the phrase: "variable value".',
            'Say the phrase: "line 6".',
            'Say the phrase: "return true".',
            'Say the phrase: "line 7".',
            'Say the phrase: "pointer end of line"',
            'Say the phrase: "create a line".',
            'Say the phrase: "conditional statement".',
            'Say the phrase: "execute function has on variable visited with one argument".',
            'Say the phrase: "variable value".',
            'Say the phrase: "line 9".',
            'Say the phrase: "return false".',
            'Say the phrase: "line 11".',
            'Say the phrase: "create line".',
            'Say the phrase: "line 11".',
            'Say the phrase: "execute function add on variable visited with argument variable value".',
            'Say the phrase: "pointer end of line".',
            'Say the phrase: "create line".',

            'Say the phrase: "new variable sum equals number 0".',
            'Say the phrase: "create line".',
            'Say the phrase: "repetition statement for every item in gap".',
            // change to quote
            'Say the phrase: "execute function quote to string quote on variable value".',
            'Say the phrase: "line 14".',
            'Say the phrase: "variable sum equals expression variable sum plus gap times gap".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "variable item".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "variable item".',
            'Say the phrase: "line 16".',
            'Say the phrase: "select the word gap".',
            'Say the phrase: "call function happy with arguments variable sum and variable visited".',
            `Say the phrase: "run current file" or click on the green icon above the code editor.`,
            '<i>Check the program output in the section below the code editor.</i>',
            'Done.'
        ]
    },
    code: {
        'en-US':
            'var print = console.log\n\n' +
            'function happy(value, visited) {\n' +
            '    return gap\n' +
            '}\n' +
            '\n' +
            'print(23, happy(23, new Set()))\n' +
            'print(4, happy(4, new Set()))\n' +
            'print(440, happy(440, new Set()))\n' +
            'print(3, happy(3, new Set()))\n',
    }
}


const problems = [welcome, avg, perfectSquare, multiplesOfSevenAndSix, happyNumber]

export default problems

export const concretize = (index: number, lang: 'en-US') => ({
    get id() { return problems[index].id },
    get index() { return index },
    get title() { return problems[index].title[lang] },
    get placeholder() { return problems[index].placeholder[lang] },
    get statement() { return problems[index].statement[lang] },
    get solution() { return problems[index].solution[lang] },
    get code() { return problems[index]?.code?.[lang] ||'' },
})
