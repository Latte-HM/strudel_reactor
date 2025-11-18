import '../bootstrapStyling.css'

/**
 * class that has buttons to change between mono and stereo audio
 * @param {onCheck}
 * @returns StereoMono controls
 */

function StereoMono({onCheck}) {
    return (
        <>
            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="0" checked="false" onClick={onCheck}></input>
            <label class="btn btn-success" htmlFor="btnradio1">Mono</label>
            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="1" checked="true" onClick={onCheck}></input>
            <label class="btn btn-success" htmlFor="btnradio2">Stereo</label>
        </>
    )
}

export default StereoMono;