function DownloadFile() {

    function downloadFile () {
        var textToConvert = document.getElementById('proc').value
        var stringData = "data:text/json;charset=utf-8," + 
            encodeURIComponent(JSON.stringify(textToConvert));
        var downloadButton = document.getElementById('downloadStrudel');
        downloadButton.setAttribute("href", stringData);
        downloadButton.setAttribute("download", "strudel.json")
        
    }

    function importFile () {
        var files = document.getElementById('selectFile').files;
        if (files.length <= 0) {
            return false;
        }
        var fr = new FileReader();
        console.log(files.item(0))

        fr.onload = function(e) {
            var test = JSON.parse(e.target.result)
            document.getElementById('proc').value = test
        }

        fr.readAsText(files.item(0))
    }

    return (
        <>
            <a id="downloadStrudel" href="/#" className="btn btn-success me-1" onClick={downloadFile}>Save File</a>
            <div class="mb-3">
                <label htmlFor="formFileMultiple" class="form-label">Upload Saved Project Here</label>
                <input className="form-control" type="file" id="selectFile" multiple></input>
                <button id="importFile" className="btn btn-success me-1" onClick={importFile}>Import File</button>
            </div>
        </>
    )
}

export default DownloadFile;