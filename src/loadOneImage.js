import './App.css';
import './loadOneImage.css'
import imageButton from './button-move.png';

import React, {useCallback, useState} from 'react'

import Dropzone from "./Dropzone.js";

import {Estimate} from "./estimate.js"

function LoadOneImage () {

    const [imageFromUser, setImageFromUser] = useState('')

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            setImageFromUser(e.target.result)
          };
          reader.readAsDataURL(file);
          return file;
        });
      }, []);

    return (

    <div className="App">
      <header className="main-header">

      <div className= "brand-name">Emotrics +</div>
        
      <nav className="main-nav">
      <ul>
        <li><a href='#'>Log In</a></li>
        <li><a href="#">About Us</a></li>
      </ul>
    </nav>
      </header>
        <div className='center'>
            <Dropzone onDrop={onDrop} accept={ {
                'image/*': ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']
            }} />
            <div className='image-container'>
                <img className='preview-image' src={imageFromUser}></img>
            </div>
            <form className="information-form">
                <div className="input-group">
                    <label htmlFor='subjectID' >Subject ID:</label>
                    <input id='subjectID' type="text"/>
                </div>
                <div className="input-group">
                    <label htmlFor='expression'>Expression:</label>
                    <select className='select-form' id='expression'>
                    <option value="0">Rest</option>
                    <option value="1">Brow Raise</option>
                    <option value="2">Gentle Eye Closure</option>
                    <option value="3">Tight Eye Closure</option>
                    <option value="4">Big Smile</option>
                    <option value="5">eeeek</option>
                    <option value="6">oooo</option> 
                    <option value="6">other</option> 
                    </select>
                </div>
            </form>
            <div className='button-container'>
            <div className="button" id="button-back">
                <div className='slide-back' id="slide"></div>
                <a>Back</a>
            </div>

            <div className="button" id="button-next">
                <div className='slide-next' id="slide"></div>
                <a>Next</a>
            </div>


            </div>

        </div>


        

        </div>

    );
}

export default LoadOneImage