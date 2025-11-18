import '../bootstrapStyling.css'

/**
 * Class that returns the input that controls the CPM of the music
 * @param {onInput} 
 * @returns CPM input
 */

function MusicCPM({onInput}) {
    return (
        <>
            <span class="input-group-text">CPM</span>
            <input type="number" class="form-control" onBlur={onInput} aria-label="Amount (to the nearest dollar)"></input>
        </>        
    )
}

export default MusicCPM