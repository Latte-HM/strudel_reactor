import '../bootstrapStyling.css'
/**
 * This class returns the player control buttons to start and stop the Strudel Music
 * @param {onPlay, onStop}  
 * @returns Player Control buttons
 */

function PlayerControls({ onPlay, onStop }) {
    return (
        <>
            <button id="play" className="btn btn-success me-1" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-success" onClick={onStop}>Stop</button>
        </>
    )
}

export default PlayerControls;