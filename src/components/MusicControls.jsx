function MusicControls({onSlide}) {
    return (
        <>
            <div className="input-group mb-3">
                <span className="input-group-text" id="cpm_label">CPM</span>
                <input type="text" className="form-control" placeholder="e;g 60" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>

            <label htmlFor="customRange1" className="form-label">Volume Control</label>
            <input type="range" className="form-range" min="1" max="100" id="volumeControls" onChange={onSlide}></input>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    s1
                </label>
            </div>
            
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    d1
                </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    d2
                </label>
            </div>


        </>
    )
}

export default MusicControls;