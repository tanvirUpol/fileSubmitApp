import { useState } from "react";
import * as XLSX from 'xlsx/xlsx.mjs';
import csvtojson from 'csvtojson';

const FileDragDrop = () => {

    const [files, setFiles] = useState(null);
    const [jsonFile, setJsonFile] = useState(null);
    const [error, setError] = useState(null);
    const [highlight, setHighlight] = useState(false);
  

    // Handle drag events
    const handleDragEnter = (event) => {
      event.preventDefault();
      setHighlight(true);
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
      setHighlight(true);
    };
  
    const handleDragLeave = (event) => {
      event.preventDefault();
      setHighlight(false);
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      setHighlight(false);
      const newFiles = [...event.dataTransfer.files];
      setFiles(newFiles);
      handleFileUpload(newFiles);
    };
  

    const handleFileUpload =  (files) => {
   
    const file = files[0]
    setFiles(files)
    const extension = file.name.split('.').pop().toLowerCase();
   

    if (extension === 'csv') {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        csvtojson()
          .fromString(fileReader.result)
          .then((json) => {
            setJsonFile(json);
          });
      };
      
    }
    else if (extension === 'xls' || extension === 'xlsx') {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        let json;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        json = XLSX.utils.sheet_to_json(sheet);
        setJsonFile(json);
      }
    }
    else {
      console.error('Unsupported file type.');
    }

    
    };

    const removeFile = ()=>{
      setFiles(null)
      setJsonFile(null)
      setError(false)
    }

    const handleSubmit = (event) =>{
      event.preventDefault();
      const labels = ['id','image','name','price','quantity']

      

      if(jsonFile){
        const dataLabel = Object.keys(jsonFile[0])
        const isValid = labels.every((item,index)=> ( item === dataLabel[index]) ? true : false )

        if(isValid){
          console.log('file Uploaded!');
          setError(false)
        }else{
          setError(true)
        }
      }

    

      // console.log(isValid);

    }

    return (
        <div> 
            <h1>Drag & Drop Files</h1>

            <form onSubmit={handleSubmit} >
            {files ?
                <div className="uploadedFile">
                <h2>{files[0].name}</h2> 
                <button onClick={removeFile}>Remove</button>
                {error && <h3>Wrong file format!!</h3>}
                </div>  :
                <label  id="drop-area"
                className={`file-input-with-drag-and-drop ${highlight ? 'highlight' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                name="fileUp"
                >
                <div>Drag and drop files here or click to select files</div>
                <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    name="fileUp"
                    onChange={(e)=>{handleFileUpload(e.target.files);}}
                    hidden
                />
                </label>
            }
            <input type="submit"  value="Submit" />
            </form>

        </div>
    )
}
export default FileDragDrop