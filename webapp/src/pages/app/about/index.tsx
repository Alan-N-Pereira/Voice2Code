import React from 'react'

export default function About() {
    return (
        <main className="about">
            <div className="wrapper">
                <div className="title">
                    <h2>About</h2>
                    <div className="sub">Some information about Speech2Code</div>
                </div>
                <div className="body">
                    Voice2Code is an application developed by me, <a rel="noreferrer" href="https://github.com/Alan-N-Pereira" target="_blank">Pedro Augusto</a>,
                    as part of my Masters dissertation in computer science at Queen Mary University London.
                    The purpose of this application is to help programmers suffering from
                    RSI (repetitive strain injury) to continue exercising their main activity: programming.<br/><br/>
                    You can read all about my <ThesisLink>dissertation here</ThesisLink>.<br/><br/>
                    Big thanks to everyone involved in the development of the following open source projects ({'❤︎'}):
                    Graphviz, Visual Studio Code, Graphviz (DOT) for VSCode, Graphlib, Graphlib-DOT, @hpcc-js/wasm,
                    svg2img, jest and node-ipc.<br/><br/>

                    Again, if you wanna know how this works read <ThesisLink>my dissertation</ThesisLink>{' '}
                    or watch <RickLink>this <b>simple</b> video</RickLink>.<br/><br/>

                    Github: <a rel="noreferrer" target="_blank" href="https://github.com/Alan-N-Pereira/Voice2Code"><small>https://github.com/pedrooaugusto/speech-to-code</small></a><br/><br/>

                    That is all, I guess. <br/><br/>
                </div>
            </div>
        </main>
    )
}

const ThesisLink = (props: { children: any }) => (
    <a
        rel="noreferrer"
        href="https://github.com/Alan-N-Pereira/Voice2Code/blob/main/230768637_ECS750P_Dissertation%20Research%20Paper.pdf"
        target="_blank"
    >
        {props.children}
    </a>
)

const RickLink = (props: { children: any }) => (
    <a
        rel="noreferrer"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
    >
        {props.children}
    </a>
)