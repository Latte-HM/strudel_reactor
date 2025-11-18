import '../bootstrapStyling.css'

/**
 * Returns a range slider to manage the volume of the Studel Music
 * @param {onSlide}  
 * @returns Volume Rocker
 */

function MusicControls({onSlide}) {
    return (
        <>
            <label htmlFor="volumeSlider" className="form-label">Volume Control</label>
            <input type="range" className="form-range" min="1" max="100" id="volumeControls" onMouseUp={onSlide}></input>

        </>
    )
}

export default MusicControls;