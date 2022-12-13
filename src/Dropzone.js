//*Dropzone.js*//

import React from 'react'
import { useDropzone } from "react-dropzone";

function Dropzone({ onDrop, accept, open }) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept,
      onDrop,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">
            Drop file here
            </p>
          ) : (
            <p className="dropzone-content">
              Drop file here
            </p>
          )}
          <button type="button" onClick={open} className="btn">
            Select Files
          </button>
        </div>
      </div>
      {/* <aside>
        <ul>{files}</ul>
      </aside> */}
    </div>
  );
}

export default Dropzone;