import logo from './Home_logo.jpeg';
import './App.css';
import { useState, useEffect } from "react";
import OneFacialExpression from "./oneFacialExpression.js"

function WelcomePage({updateViewParent}) {

 function handleClick (event) {

    switch (event.target.id) {
        case 'oneExpression':
            updateViewParent('oneExpression');
            break;
        default:
            break;
    }
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
    <div className='wrapper'>
      <div className = "center-image">
        <img width={"400"} src={logo}></img>
        <div className='title'> Welcome to Emotrics+</div>
      </div>
      
      
      <div className="col-sm-3 btn-group">
        <button  className='btn' id='oneExpression' onClick={handleClick}>Process One Facial Expression</button>
        <button className='btn'>Process Two Facial Expressions</button>
        <button className='btn'>Process Seven Facial Expressions</button>
      </div>

    </div>
        
    </div>
  );
}

export default WelcomePage;
