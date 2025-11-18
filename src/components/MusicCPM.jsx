import '../bootstrapStyling.css'

function MusicCPM({onInput}) {
    return (
        <>
            <span class="input-group-text">CPM</span>
            <input type="number" class="form-control" onBlur={onInput} aria-label="Amount (to the nearest dollar)"></input>
        </>        
    )
}

export default MusicCPM