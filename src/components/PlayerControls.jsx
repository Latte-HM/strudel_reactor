import '../App.css'

function PlayerControls({ onPlay, onStop }) {
    return (
        <>
            <button id="play" className="btn btn-secondary" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-secondary" onClick={onStop}>Stop</button>
        </>
    )
}

export default PlayerControls;