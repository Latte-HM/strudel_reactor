import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope} from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import MusicControls from './components/MusicControls'
import PlayerControls from './components/PlayerControls'
import TextArea from './components/TextArea'
import { Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './tabs.css'

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
    const [player, playerState] = useState("stop")

    const handlePlay = (editor) => {
        editor.evaluate();
    }

    const handleStop = (editor) => {
        editor.stop();
    }

    const handleVolume = (e) => {
        if (player == "play") {
            setEditorText(editorText);
            var volume = e / 100
            var test = editorText
            test = test + `\nall(x => x.gain(`+volume+`))`
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
                canvas.width = canvas.width * 2;
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
        soundBite.setCode(`// Test out sounds here!\ns("bd sd,hh*16").bank("RolandTR808")\n\n\n\n\n`);
    }, [editorText]);

    return (
        <div>
            <main>
                <h2>Strudel: Music with code!</h2>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col" style={{ maxHeight: '50vh', overflowY: 'auto', maxWidth: 'auto' }}>
                            <Tabs>
                                <TabList>
                                    <Tab>Strudel Environment</Tab>
                                </TabList>
                                <TabPanel>
                                    <div>
                                        <div id="editor" />
                                        <div id="output" />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <div className="col" style={{ maxHeight: '50vh', overflowY: 'hidden', maxWidth: 'auto' }}>
                            <Tabs>
                                <TabList>
                                    <Tab>Strudel Editor</Tab>
                                    <Tab>Player Controls</Tab>
                                </TabList>
                                <TabPanel>
                                    <TextArea 
                                        defaultValue={editorText} 
                                        onChange={(e) => setEditorText(e.target.value)} 
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <div style={{
                                        background: '#222222',
                                        padding: '10px'
                                    }}>
                                        <div className="col-md-4">
                                            <MusicControls
                                                onSlide={(e) => handleVolume(e.target.value)}
                                            />
                                        </div>
                                        <nav>
                                            <label>Player Controls</label>
                                            <br></br>
                                            <PlayerControls 
                                                onPlay={() => {playerState("play"); handlePlay(globalEditor)}} 
                                                onStop={() => {playerState("stop"); handleStop(globalEditor)}}
                                            />
                                            {/* <ProcControls/> */}
                                            <br />
                                        </nav>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col">
                            <Tabs>
                                <TabList>
                                    <Tab>Audio Visualiser</Tab>
                                </TabList>
                                <TabPanel>
                                    <div style={{background: '#222222'}}>
                                        <canvas id="roll"></canvas>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <div className="col">
                            <Tabs>
                                <TabList>
                                    <Tab>Testing Suite</Tab>
                                </TabList>
                                <TabPanel>
                                    <div className="row">
                                        <div className="col" style={{maxWidth:'50vh', maxHeight: '32vh' ,overflowY: 'auto'}}>
                                            <div id="sample" />
                                            <div id="output" />
                                        </div>
                                        <div className="col" style={{background: '#222222', maxWidth:'50vh', padding:'10px'}}>
                                            <label> Music Controls for Testing</label>
                                            <nav>
                                                <PlayerControls 
                                                    onPlay={() => {playerState("play"); handlePlay(soundBite)}} 
                                                    onStop={() => {playerState("stop"); handleStop(soundBite)}}
                                                />
                                            </nav>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );


}