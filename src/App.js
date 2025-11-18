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
import DownloadFile from './components/DownloadFile'
import { Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import './tabs.css'
import './bootstrapStyling.css'
import StereoMono from './components/StereoMono'
import MusicModifiers from './components/MusicModifiers'
import MusicCPM from './components/MusicCPM'

let globalEditor = null;
let soundBite = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false);
    const [editorText, setEditorText] = useState(stranger_tune)
    const [player, playerState] = useState("stop")

    // starts the music for the selected editor
    const handlePlay = (editor) => {
        editor.evaluate();
    }

    // stops the music for the selected editor
    const handleStop = (editor) => {
        editor.stop();
    }

    // changes the volume of the song depending on the value of the range slider
    const handleVolume = (e) => {
        // check for the current player state to be "play"
        if (player == "play") {
            setEditorText(editorText);
            // gain is controlled from 0 to 1, downscale range from 1 to 100 to 0 to 1
            var volume = e / 100
            // set the modifier to be equal to the editor text
            var modifier = editorText
            // add a new line to the editor to control volume
            modifier = modifier + `\nall(x => x.gain(`+volume+`))`
            // update the editor with the new line, and then evaluate to start the song
            globalEditor.setCode(modifier)
            globalEditor.evaluate();
        }
    }

    // changes between mono and stereo audio
    const handleStereo = (e) => {
        // check for the current player state to be "play"
        if (player == "play") {
            setEditorText(editorText);
            var modifier = editorText
            // if Stereo is selected, change the value to 1, else set it to 0 for mono
            if (e == '1') {
                modifier = modifier + `\nall(x => x.juxBy(1, rev))`
            }
            else {
                modifier = modifier + `\nall(x => x.juxBy(0, rev))`
            }

            // update the editor with the new line, and then evaluate to start the song
            globalEditor.setCode(modifier)
            globalEditor.evaluate();
        }
    }

    // changes the song based on the modifier selected
    const handleModifiers = (e) => {
        // check for the current player state to be "play"
        if (player == "play") {
            setEditorText(editorText);
            var modifier = editorText
            // if LPF is selected, add the LPF modifier
            if (e == 1) {
                modifier = modifier + '\nall(x => x.lpf(500))'
            }
            // if HPF is selected, add the HPF modifier
            else if (e == 2) {
                modifier = modifier + '\nall(x => x.hpf(1000))'
            }

            // update the editor with the new line, and then evaluate to start the song
            globalEditor.setCode(modifier)
            globalEditor.evaluate();
        }
    }

    // changes the CPM of the song based on the value passed in
    const handleCPM = (e) => {
        // check for the current player state to be "play"
        if (player == "play") {
            setEditorText(editorText);
            var modifier = editorText
            // adds a new line for the CPM passed in with the value provided
            modifier = modifier + `\nsetcpm(`+e+`)`

            // update the editor with the new line, and then evaluate to start the song
            globalEditor.setCode(modifier)
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
                // another environment for the testing space
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
        // add a test sample to the testing space
        soundBite.setCode(`// Test out sounds here!\ns("bd sd,hh*16").bank("RolandTR808")\n\n\n\n\n`);
    }, [editorText]);

    return (
        <div>
            <main>
                <h2>Strudel: Music with code!</h2>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col" style={{ maxHeight: '50vh', overflowY: 'auto', maxWidth: 'auto' }}>
                            {/* Tab for the Main Strudel Environment */}
                            <Tabs>
                                <TabList>
                                    <Tab>Strudel Environment</Tab>
                                </TabList>
                                <TabPanel>
                                    <div id="editor" />
                                    <div id="output" />
                                </TabPanel>
                            </Tabs>
                        </div>
                        <div className="col" style={{ maxHeight: '50vh', overflowY: 'hidden', maxWidth: 'auto' }}>
                            {/* Tabs for the Main Editing Area */}
                            <Tabs>
                                <TabList>
                                    <Tab>Strudel Editor</Tab>
                                    <Tab>Player Controls</Tab>
                                    <Tab>Saving/Exporting</Tab>
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
                                            <br />
                                            <label> Switch between Mono and Stereo!</label>
                                            <br></br>
                                            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                <StereoMono
                                                    onCheck={(e) => handleStereo(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                            <br></br>
                                            <label>Music Modifiers</label>
                                            <div style={{maxWidth: '50vh'}}>
                                                <MusicModifiers
                                                    onCheck={(e) => handleModifiers(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                            <label>Change the CPM of the song here</label>
                                            <div class="input-group mb-3" style={{maxWidth: '50vh'}}>
                                                <MusicCPM
                                                    onInput={(e) => handleCPM(e.target.value)}
                                                />
                                            </div>
                                            <br></br>
                                        </nav>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <TextArea 
                                                defaultValue={editorText} 
                                                onChange={(e) => setEditorText(e.target.value)} 
                                            />
                                        </div>
                                        <div className="col" style={{background: '#222222', maxWidth:'28vh', padding:'10px'}}>
                                            <label>Download your Strudel Project</label>
                                            <DownloadFile/>
                                        </div>
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
                                        <div className="col-md-5" style={{background: '#222222', maxWidth:'50vh', padding:'10px'}}>
                                            <div>
                                                <label> Player Controls for Testing</label>
                                                <nav>
                                                    <PlayerControls 
                                                        onPlay={() => {playerState("play"); handlePlay(soundBite)}} 
                                                        onStop={() => {playerState("stop"); handleStop(soundBite)}}
                                                    />
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main >
            <br></br>
        </div >
    );


}