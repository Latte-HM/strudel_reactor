import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { backgroundImage, evalScope} from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import MusicControls from './components/MusicControls'
import PlayerControls from './components/PlayerControls'
import ProcControls from './components/ProcControls'
import TextArea from './components/TextArea'
import backgroundImg from './images/prism.png'

let globalEditor = null;
let soundBite = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

// export function SetupButtons() {

//     document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
//     document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
//     document.getElementById('process').addEventListener('click', () => {
//         Proc()
//     }
//     )
//     document.getElementById('process_play').addEventListener('click', () => {
//         if (globalEditor != null) {
//             Proc()
//             globalEditor.evaluate()
//         }
//     }
//     )
// }



// export function ProcAndPlay() {
//     if (globalEditor != null && globalEditor.repl.state.started == true) {
//         console.log(globalEditor)
//         Proc()
//         globalEditor.evaluate();
//     }
// }

// export function Proc() {

//     let proc_text = document.getElementById('proc').value
//     let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
//     ProcessText(proc_text);
//     globalEditor.setCode(proc_text_replaced)
// }

// export function ProcessText(match, ...args) {

//     let replace = ""
//     // if (document.getElementById('flexRadioDefault2').checked) {
//     //     replace = "_"
//     // }

//     return replace
// }

export default function StrudelDemo() {

    const hasRun = useRef(false);
    const [editorText, setEditorText] = useState(stranger_tune)

    const handlePlay = () => {
        globalEditor.evaluate();
    }

    const handleStop = () => {
        globalEditor.stop();
    }

    const handleVolume = (e) => {
        if (globalEditor != null && globalEditor.repl.state.started == true) {
            setEditorText(editorText);
            var volume = e / 100
            var test = editorText
            test = test + `\n`
            test = test + `all(x => x.gain(`+volume+`))`
            globalEditor.setCode(test)
            globalEditor.evaluate();
        }
    }

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 4;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
                soundBite = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('sample'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
                
            document.getElementById('proc').value = stranger_tune
            // SetupButtons()
            // Proc()
        }
        globalEditor.setCode(editorText);
    }, [editorText]);

    return (
        <div>
            <main
            style={{
                backgroundImage: `url(${backgroundImg})`
            }}>
                <h2>Strudel: Music with code!</h2>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col" style={{ maxHeight: '50vh', overflowY: 'auto', maxWidth: 'auto' }}>
                            <div class="card text-bg-secondary">
                                <h5 class="card-header">Strudel Environment</h5>
                                <div class="card-text">
                                    <div id="editor" />
                                    <div id="output" />
                                </div>
                            </div>
                        </div>
                        <div className="col" style={{ maxHeight: '100vh', overflowY: 'hidden', maxWidth: 'auto' }}>
                            <div class="card text-bg-secondary">
                                <h5 class="card-header">Edit the Studel Here!</h5>
                                <div class="card-text">
                                    <TextArea 
                                        defaultValue={editorText} 
                                        onChange={(e) => setEditorText(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <div className="col" style={{ maxHeight: '60vh', overflowY: 'auto', maxWidth: 'auto' }}>
                                    <div id="sample" />
                                    <div id="output" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <MusicControls
                                        onSlide={(e) => handleVolume(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <nav>
                                        <PlayerControls 
                                            onPlay={handlePlay} 
                                            onStop={handleStop}
                                        />
                                        <ProcControls/>
                                        <br />
                                    </nav>
                                </div>
                            </div>
                            <div className="col">
                                <canvas id="roll"></canvas>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main >
        </div >
    );


}