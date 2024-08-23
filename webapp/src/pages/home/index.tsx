import React from 'react'
import Nav from '../@components/header'
import './style.scss'

const url_spoken = 'https://github.com/Alan-N-Pereira/speech-to-code/tree/main/spoken-vscode-driver#vscode-spoken-driver'

export default React.memo(function Webapp(props: { lang: 'en-US' | string }) {
    const i18n = i18n_[props.lang as ('en-US')]

    return (
        <React.Fragment>
            <Nav />
            <main className="home">
                <div className="content">
                    <h1>Voice2Code</h1>
                    {/*<p>
                        Voice2Code is a web application that converts speech to code (<u><i><small>copilot suggested that</small></i></u>).
                    </p>*/}
                    <p>
                        {i18n['desc']}
                    </p>
                    <p>
                        {i18n['extension']}
                    </p>
                    <p>
                        {i18n['limit']}
                    </p>
                    <p>
                        {i18n['source']}
                    </p>
                </div>
            </main>
        </React.Fragment>
    )
})

const i18n_ = {
    'en-US': {
        'desc': <>
            Voice2Code is an application developed to help programmers suffering from Repetitive Strain Injury
            to continue exercising their main activity by using voice commands instead of hands to type code.
            The idea is that instead of typing <code>let value = 7;</code> in the IDE you can just say&nbsp;
            <span>“new variable value equals number 7”</span>.
        </>,
        'extension': <>
            Voice2Code also comes with a companion VSCode extension called {' '}
            <a target='_blank' rel='noreferrer' href={url_spoken}>Spoken</a>{' '}, 
            is through that extension that it can communicate with and control VSCode.
        </>,
        'limit': <>
            Currently, it only has support for the JavaScript programming language and the Visual Studio Code Editor.
        </>,
        'source': <>
            Check out the <a rel='noreferrer' href={process.env.PUBLIC_URL + '/en/webapp'}>demo</a> to see it working or read more about it at&nbsp;
            <a target='_blank' rel='noreferrer' href={'https://github.com/Alan-N-Pereira/Voice2Code/blob/main/230768637_ECS750P_Dissertation%20Research%20Paper.pdf'}>article</a>.
        </>
    }
}
