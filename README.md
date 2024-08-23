# Voice2Code <img alt="Toolkit audit status" src="client/icons/icon36x36.png/" />&nbsp;&nbsp;

> Code using your voice

### Overview

Voice2Code is an application that enables you to code using just voice comands, with Voice2Code instead of using the keyboard to write code in the code editor ~~like a caveman~~ you can just express in natural language what you wish to do and that will be automatically written, as code, in the code editor.

Using Voice2Code instead of using the mouse and keyboard to navigate to line 42 of a file, you can just say: _"line 42"_, _"go to line 42"_ or even _"please go to line 42"_. It's possible to say stuff like:

* _new variable answer equals the string john was the eggman string_
    * ```javascript
        let answer = "john was the eggman"
        ```

* _call function max with arguments variable answer and expression gap plus number 42 on namespace Math_
    * ```javascript
        Math.max(answer, gap + 42) // 'gap' can later be replaced later by an actual value
        ```

This project can be divided into 3 main modules:

1. [Webapp](/webapp), [Server](/server) and [Client](/client): are responsible for the application UI, capture audio and transform audio into text.

2. [Spoken](/spoken): is responsible for testing if a given phrase is a valid voice command and to extract important information out of it (parse).

3. [Spoken  VSCode Extension](/spoken-vscode-driver): is a Visual Studio Code extension able to receive commands to manipulate VSCode. Is through this extension that Speech2Code is able to control the Visual Studio Code.

**Those modules interact as follows:**

```mermaid

flowchart TB
    A[fab:fa-microsoft MS Azure Speech to Text] <-->|HTTP/Sockets| B(Server)

    B <--> |HTTP| C(Client)
    B --> |Serves| E(Webapp)
    C <--> |Inter Process-Communication| D(VS Code Extension)
    E --- |NPM Dependency| F(Spoken)
    C --- |NPM Dependency| F(Spoken)
    D <--> G(Visual Studio Code)

    style B fill:white,stroke:gold,stroke-width:2px
    style C fill:white,stroke:gold,stroke-width:2px
    style D fill:white,stroke:gold,stroke-width:2px
    style E fill:white,stroke:gold,stroke-width:2px
    style F fill:white,stroke:gold,stroke-width:2px

```

### Voice Commands

Voice commands are transformed into text using the [Azure Speech to Text](https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/?cdn=disable#features) service and later parsed by [Spoken](/spoken), which makes use of several pushdown automaton to extract information of the text.

Currently, Speech2Code only supports voice commands for the JavaScript language, a list of all those commands can be found [here](spoken/src/modules/typescript). All commands can be said in both english.

### Controlling Visual Studio Code

Speech2Code was designed to work with any IDE that implements its [interface]([https://github.com/Alan-N-Pereira/Voice2Code](https://github.com/Alan-N-Pereira/Voice2Code)/blob/main/spoken/src/modules/d.ts#L17), this is usually done through plugins and extensions. Currently, it has support for Visual Studio Code and CodeMirror.

For example, the voice command _"call function fish with two arguments"_ will eventually call  for [`editor.write(...)`](https://github.com/Alan-N-Pereira/Voice2Code/blob/main/spoken/src/modules/typescript/function_call/impl.ts#L30) where editor can be any IDE/Editor like vscode, codemirror and sublime and each will have a different implementation for `write(...)`. The only common thing is that calling that function will write something in the current open file, no matter the IDE. Here you have an example of different implementations of the same function: [VSCode.write(...)](https://github.com/Alan-N-Pereira/Voice2Code/blob/main/spoken-vscode-driver/src/robot-vscode.ts#L19) x [CodeMirror.write(...)](https://github.com/Alan-N-Pereira/Voice2Code/blob/main/webapp/src/services/chrome/editor.ts#L30)

The connection between VSCode and Speech2Code is done through a custom VSCode extension and Inter-Process Communication.

### Running this project

First, install all the  required dependencies with:

`node scripts.js install`

Then, you can start the server with:

`./run.sh`

A web based demo of *Speech2Code* will be accessible through: http://localhost:3000/webapp

Finnaly, if you wish to start the actual application run (make sure that VSCode is running before doing that):

`npm --prefix client start`

_Dont forget to edit `server/.env` with your azure speech-to-text API keys._

### Resources

Non code-like material produced in the creation of this project:

1. [Master dissertation on this project](https://github.com/Alan-N-Pereira/Voice2Code/blob/main/230768637_ECS750P_Dissertation%20Research%20Paper.pdf).
