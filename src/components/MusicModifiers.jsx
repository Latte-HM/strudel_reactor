import '../bootstrapStyling.css'

function MusicModifiers({onCheck}) {
    return (
        <>
            <select class="form-select" id="exampleSelect1" onChange={onCheck}>
                <option value="0">None</option>
                <option value="1">Low Pass Filter</option>
                <option value="2">High Pass Filter</option>
            </select>
        </>
    )
}

export default MusicModifiers;