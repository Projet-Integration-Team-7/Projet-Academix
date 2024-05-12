import React, { useState } from 'react';
import axios from 'axios';
import { FaThumbtack } from 'react-icons/fa'; 
import './FileUpload.css'

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const response = await axios.post('https://academixbackend-b7d3e8ece074.herokuapp.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
      
  return (
    <div className="file-upload-container">
      <form onSubmit={handleFileSubmit}>
        <label htmlFor="file-upload-input" className="file-upload-label">
          <FaThumbtack />
        </label>
        <input id="file-upload-input" type="file" className="file-upload-input" onChange={handleFileChange} multiple />
        <button type="submit"></button>
      </form>
    </div>
  );
};

export default FileUpload;
