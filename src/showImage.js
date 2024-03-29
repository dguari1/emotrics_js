import React, { Component, createRef, useRef, useLayoutEffect } from 'react';
import panzoom from 'panzoom';
// import image from './visa.jpeg';
import data from './landmarks.json';
import image from './IMG_0295.jpeg'
import './showImage.css'
import { FACEMESH_CONTOURS } from '@mediapipe/face_mesh';
import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';

// const panzoom = require('./showImage.js')

const FACEMESH_LIPS = [61,146,91,181,84,17,314,405,321,375,291,185,40,39,37,
    0,267,269,270,409,291,95,88,178,87,14,317,402,318,324,308,191,80,81,
    82,415,308]

const FACEMESH_LEFT_EYE = [263,249,390,373,374,380,381,382,362,466,388,387,386,385,384,398,362]

const FACEMESH_LEFT_IRIS = [474,475,476,477,474]

const FACEMESH_LEFT_EYEBROW = [276,283,282,295,285,300,293,334,296,336]

const FACEMESH_RIGHT_EYE = [33,7,163,144,145,153,154,155,133,246,161,160,159,158,157,173,133]

const FACEMESH_RIGHT_EYEBROW = [46,53,52,65,55,70,63,105,66,107]

const FACEMESH_RIGHT_IRIS = [469,470,471,472,469]


class ShowImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom : 0,
        }

        this.imageRef = createRef();
        this.canvasRef = createRef();
        this.panZoomRef = createRef();
        this.panZoomCanvasRef = createRef();
        this.divPanZoomRef = createRef();
        this.elementRef = createRef();
        this.landmarks = []
        this.iris = []
    }

    componentDidMount = () => {


        this.panZoomRef.current = panzoom(this.imageRef.current, {
            minZoom: .5,
            maxZoom: 3,
            
        });
        // this.panZoomCanvasRef.current = panzoom(this.canvasRef.current, {
        //     minZoom: .5,
        //     maxZoom: 3,
        //     bounds: true,
        //     boundsPadding: 0.1
        // });

        this.panZoomRef.current.on('pan', () => this.updateCanvasInView()); 
        this.panZoomRef.current.on('zoom', () => this.updateCanvasInView()); 
        this.panZoomRef.current.on('paned', () => this.updateCanvasInView()); 
        this.panZoomRef.current.on('zoomed', () => this.updateCanvasInView()); 


        // this.ctx = this.canvasRef.current.getContext('2d')
        // this.ctx.drawImage(this.imageRef.current,0,0)
        this.canvasRef.current.width = this.imageRef.current.width;
        this.canvasRef.current.height = this.imageRef.current.height;

        // var img = new Image()
        // img.onload = function () {
        //     this.ctx.drawImage(img,0,0)
        //     console.log(img.width)
        // }
        // img.onerror = function (e) {
        //     // console.log('error')
        // }
        // img.src = './visa.jpeg';

        // this.landmarks  data[0]
        if (data) {
            this.getUsefulLandmakrs(data[0])
            this.drawLandmakrs()
        }
        // 

    }

    updateCanvasInView = () => {
        let rect = this.imageRef.current.getBoundingClientRect()
        this.canvasRef.current.width = rect.width;
        this.canvasRef.current.height = rect.height;
        const initx = rect.left
        const inity = rect.top 
        this.canvasRef.current.style.left = `${initx}px`
        this.canvasRef.current.style.top = `${inity}px`

    }
 
    getUsefulLandmarks = (data) => {

        FACEMESH_LIPS.forEach(item => {
            this.landmarks.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })
        FACEMESH_LEFT_EYE.forEach(item => {
            this.landmarks.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })
        
        FACEMESH_LEFT_EYEBROW.forEach(item => {
            this.landmarks.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })

        FACEMESH_RIGHT_EYE.forEach(item => {
            this.landmarks.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })

        FACEMESH_RIGHT_EYEBROW.forEach(item => {
            this.landmarks.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })

        

        FACEMESH_LEFT_IRIS.forEach(item => {
            this.iris.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })
        FACEMESH_RIGHT_IRIS.forEach(item => {
            this.iris.push({x: data.keypoints[item].x, 
                                 y: data.keypoints[item].y})
        })

    }

    componentWillUnmount = () => {
        this.panZoomRef.current.dispose();
    }

    drawLandmarks = () =>{
        this.ctx = this.canvasRef.current.getContext('2d')
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red'
        this.landmarks.forEach(item =>{
            this.ctx.fillRect(item.x, item.y, 3,3)
        }) 

        this.ctx.fillStyle = 'green'
        this.iris.forEach(item =>{
            this.ctx.fillRect(item.x, item.y, 3,3)
        })

    }

    handleClick = (event) => {
        switch (event.target.id) {
            case 'resetZoom':
                this.panZoomRef.current.moveTo(0, 0);
                this.panZoomRef.current.zoomAbs(0, 0, 1);
                this.panZoomCanvasRef.current.moveTo(0, 0);
                this.panZoomCanvasRef.current.zoomAbs(0, 0, 1);
                break;
            default:
                break;
        }
    }

    getMousePosition = (event,canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width/rect.width
        const scaleY = canvas.height/rect.height

        return {
            x: (event.clientX - rect.left)*scaleX,
            y: (event.clientY - rect.top)*scaleY
        }
    }

    handleMouseDown = (event) => {
        //get the current mouse position in the canvas if there is no rectangle 
        event.preventDefault();
        event.stopPropagation();


        var pos = this.getMousePosition(event, this.canvasRef.current)
        console.log(pos)

    }

    render() {
        return (
            <div>
                <div className='wrapperPage' >
                    <div className='container' ref={this.elementRef}>
                        <canvas className='landmarks-canvas' 
                        ref={this.canvasRef}
                        onMouseDown = {this.handleMouseDown}
                        />
                        <img className='landmarks-image' ref={this.imageRef} src={image}/>

 
                    </div>
                
                    <div className="patient-info">
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
                    </div>
                    <div className='menu-div'>
                        <button className='btn-measures' id='measures' title='Facial Measures' onClick={this.handleClick} ></button>
                    </div>
                    <div className='back-button'>
                        <button className='btn-reset' id='resetZoom' onClick={this.handleClick}>Reset Zoom</button>
                        <button className='btn-return' id='return' onClick={this.handleClick}>Previous Page</button>

                    </div>
                </div>
            </div>
        );
    }
}

export default ShowImage ;
