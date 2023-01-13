import './App.css';
import './loadOneImage.css'
import imageButton from './button-move.png';

import React, {useCallback, useState} from 'react'

import Dropzone from "./Dropzone.js";
import image from './icons/person.png';
import imageColor from './icons/person-color.png';

import {Estimate} from "./estimate.js"
import ShowImage from './showImage2.js';

function LoadOneImage ({updateViewParent}) {

    const [borderColor,setBorderColor] = useState('#0587AB')

    const [imageFromUser, setImageFromUser] = useState(image)
    const [landmarksFromUser, setLandmarksFromUser] = useState(null)
    const [loadedImage, setLoadedImage] = useState(false)

    const [expressionImageOne, setExpressionImageOne] = useState('Rest')
    const [subjectID, setSubjectID] = useState('')

    const onDropImage = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            setImageFromUser(e.target.result)
            setLoadedImage(true)
          };
          reader.readAsDataURL(file);
          return file;
        });
      }, []);

      const onDropLandmarks = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            setLandmarksFromUser(e.target.result)
          };
          reader.readAsDataURL(file);
          return file;
        });
      }, []);

     const nextButton = () => {

      var data = {
        image : imageFromUser,
        landmarks : landmarksFromUser,
        expressionImageOne: expressionImageOne,
        subjectID : subjectID,
      }


      if ((String(data.image).includes('person.32ce') === true) || (String(data.image).includes('person-color.7b8a') === true))
      {
        // no image was provided, we will highlight the loading area
        setImageFromUser(imageColor)

      }
      else {
        console.log(data)
        updateViewParent('oneExpression', data)
      }
     }

     const backButton = () =>{
      console.log('hi')
     }

     const handleSelectExpression = (event) => {
      setExpressionImageOne(event.target.value)
     }

     const handleInputID = (event) => {
      setSubjectID(event.target.value)
     }

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
            <Dropzone 
            onDrop={onDropImage} 
            accept={ {'image/*': ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']}} 
            text={'Drop Image Here'}
            />

            <div className='image-container'>
                <img className='preview-image' src={imageFromUser}></img>
            </div>
            <Dropzone 
            onDrop={onDropLandmarks} 
            accept={ {'text/*': ['.txt']}} 
            text = {'Drop Landmarks Here'}
            hideList = {false}
            />
            <form className="information-form">
                <div className="input-group">
                    <label htmlFor='subjectID' >Subject ID:</label>
                    <input id='subjectID' type="text" onChange={handleInputID}/>
                </div>
                <div className="input-group">
                    <label htmlFor='expression'>Expression:</label>
                    <select className='select-form' id='expression' onChange={handleSelectExpression}>
                    <option value="Rest">Rest</option>
                    <option value="Brow Raise">Brow Raise</option>
                    <option value="Gentle Eye Closure">Gentle Eye Closure</option>
                    <option value="Tight Eye Closure">Tight Eye Closure</option>
                    <option value="Big Smile">Big Smile</option>
                    <option value="eeeek">eeeek</option>
                    <option value="oooo">oooo</option> 
                    <option value="other">other</option> 
                    </select>
                </div>
            </form>
            <div className='button-container'>
            <div className="button" id="button-back" onClick={backButton}>
                <div className='slide-back' id="slide"></div>
                <a>Back</a>
            </div>

            <div className="button" id="button-next" onClick={nextButton} >
                <div className='slide-next' id="slide"></div>
                <a>Next</a>
            </div>


            </div>

        </div>

        </div>


      


    );
}

export default LoadOneImage