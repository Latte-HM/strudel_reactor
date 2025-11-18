import '../App.css'

/**
 * class that handles the text area input, styling is done in here 
 * as it misbehaves in the other styling sheets
 * @param {defaultvalue, onChange}
 * @returns textarea
 */

function TextArea({ defaultValue, onChange}) {
    return (
        <>
            <textarea 
                className="form-control" 
                spellcheck="false" 
                defaultValue={defaultValue} 
                onChange={onChange} 
                rows="15"
                id="proc"
                style={{
                    background: '#222222',
                    color: '#abababff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderColor: '#222222',
                }}
            >
            </textarea>
        </>
    )
}

export default TextArea