//*Dropzone.js*//

import React from 'react'
import { useDropzone } from "react-dropzone";

function Dropzone({ onDrop, accept, open, text, hideList=true}) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept,
      onDrop,
    });


  // const files = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} 
    </li>
  ));


  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">
            {text}{/* Drop Image here */}
            </p>
          ) : (
            <p className="dropzone-content">
              {text}{/* Drop Image here */}
            </p>
          )}

          <button type="button" onClick={open} className="btn">
            Select File
          </button>
        </div>
        <aside hidden={hideList}>
        <ul style={{fontSize:'0.6em', textAlign:'left'}}>{files}</ul>
      </aside> 
      </div>
      
    </div>
  );
}

export default Dropzone;