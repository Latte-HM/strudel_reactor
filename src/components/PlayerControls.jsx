import '../App.css'

function PlayerControls({ onPlay, onStop }) {
    return (
        <>
            <button id="play" className="btn btn-success me-1" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-success" onClick={onStop}>Stop</button>
        </>
    )
}

export default PlayerControls;