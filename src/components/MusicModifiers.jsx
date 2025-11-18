import '../bootstrapStyling.css'

/**
 * Class that houses the different filtering options for the Studel
 * @param {onCheck} 
 * @returns MusicModifiers
 */

function MusicModifiers({onCheck}) {
    return (
        <>
            <select class="form-select" id="MusicModifiers" onChange={onCheck}>
                <option value="0">None</option>
                <option value="1">Low Pass Filter</option>
                <option value="2">High Pass Filter</option>
            </select>
        </>
    )
}

export default MusicModifiers;