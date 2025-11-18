/**
 * class that manages the download and upload of saved strudel music files
 * @returns File Download Button
 */

function DownloadFile() {

    // responsible for downloading the file
    function downloadFile () {
        // grab the value of the textarea
        var textToConvert = document.getElementById('proc').value
        // cconvert it to a json 
        var stringData = "data:text/json;charset=utf-8," + 
            encodeURIComponent(JSON.stringify(textToConvert));
        var downloadButton = document.getElementById('downloadStrudel');
        // set the attributes of the link to allow the download of the json file
        downloadButton.setAttribute("href", stringData);
        downloadButton.setAttribute("download", "strudel.json")
        
    }

    // responsible for importing json files and placing them into the text area
    function importFile () {
        // grab the file that has been imported
        var files = document.getElementById('selectFile').files;
        // ensure that the text file has content
        if (files.length <= 0) {
            return false;
        }
        // create a new filereader to read the contents of the json file
        var fr = new FileReader();

        // pass in the saved fille into the text area
        fr.onload = function(e) {
            var savedFile = JSON.parse(e.target.result)
            document.getElementById('proc').value = savedFile
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