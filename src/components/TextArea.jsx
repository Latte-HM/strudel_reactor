import '../App.css'

function TextArea({ defaultValue, onChange}) {
    return (
        <>
            <textarea 
                className="form-control" 
                rows="15" 
                defaultValue={defaultValue} 
                onChange={onChange} 
                id="proc"
                style={{
                    background: '#222222',
                    color: '#abababff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderColor: '#222222',
                    resize: 'none',
                    height: 'auto'
                }}
            >
            </textarea>
        </>
    )
}

export default TextArea