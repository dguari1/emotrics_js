import React, { Component, createRef } from 'react';
import panzoom from 'panzoom';

import { circleFromPoints } from './utils';

import dataLandmarks from './samples/Normal1_1.txt';
import image from './samples/Normal1_1.jpg';
// import image from './IMG_0295.jpeg'
import './showImage.css'
import { FACEMESH_CONTOURS } from '@mediapipe/face_mesh';

// const panzoom = require('./showImage.js') 
// const lineByLine = require('n-readlines');
// import LineReader from 'n-readlines';

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
        this.canvasLandmarksRef = createRef();
        this.panZoomRef = createRef();
        this.panZoomCanvasRef = createRef();
        this.divPanZoomRef = createRef();
        this.elementRef = createRef();
        this.landmarks = []
        this.iris = []
    }

    componentDidMount = () => {

        this.elementRef.current.height = window.innerHeight
        this.panZoomRef.current = panzoom(this.canvasRef.current, {
            minZoom:0.01,
            maxZoom: 10,
        });
        // this.panZoomCanvasRef.current = panzoom(this.canvasImageRef.current, {
        //     minZoom: 1,
        //     maxZoom: 10,
        // });

        // this.panZoomRef.current.on('pan', () => this.updateCanvasInView()); 
        // this.panZoomRef.current.on('zoom', () => this.updateCanvasInView()); 
        // this.panZoomRef.current.on('panend', () => this.updateCanvasInView()); 
        // this.panZoomRef.current.on('zoomend', () => this.updateCanvasInView()); 
        // this.panZoomRef.current.on('transform', () => this.updateCanvasInView()); 

        this.ctx = this.canvasRef.current.getContext('2d')
        this.ctxLandmarks = this.canvasLandmarksRef.current.getContext('2d',{willReadFrequently:true})
        

        this.panZoomRef.current.on('transform', () => {

            //adjust the size and position of the canvas used to draw landmarks, 
            //such that the canvas only appears in the visible area of the screen

            //the idea behind this, is to prevent the canvas from being too large. 
            //Drawing on large canvas has a very poor performance and consumes too many resources 


            let rectImage = this.canvasRef.current.getBoundingClientRect()
            let rect = this.elementRef.current.getBoundingClientRect()

            var visibleWidth = rect.width;
            var visibleHeight = rect.height;

            var leftImage = rectImage.left;
            var rightImage = rectImage.right;
            var topImage = rectImage.top;
            var bottomImage = rectImage.bottom

            var leftCanvasLandmarks = 0;
            var topCanvasLandmarks = 0;
            var widthCanvasLandmarks = 0;
            var heightCanvasLandmarks = 0; 

            // make sure that visible canvas doesn't go above the visible screen
            if (leftImage>=0) {
                leftCanvasLandmarks = leftImage;
            } else {
                leftCanvasLandmarks = 0 
            }
            if (rightImage<=visibleWidth){
                if (leftImage>=0){
                    widthCanvasLandmarks = rightImage-leftImage
                } else {
                    widthCanvasLandmarks = rightImage
                }   
            } 
            else if (rightImage>visibleWidth){
                if (leftImage>=0){
                    widthCanvasLandmarks = visibleWidth-leftImage
                } else {
                    widthCanvasLandmarks = visibleWidth
                }
            }

            
            if (topImage>=0) {
                topCanvasLandmarks = topImage;
            } else {
                topCanvasLandmarks = 0
            }
            if (bottomImage<=visibleHeight){
                if (topImage>=0){
                    heightCanvasLandmarks = bottomImage-topImage
                } else {
                    heightCanvasLandmarks = bottomImage
                }

            } else if (bottomImage > visibleHeight) {
                if (topImage >=0){
                    heightCanvasLandmarks = visibleHeight-topImage;
                } else {
                    heightCanvasLandmarks = visibleHeight
                }
            }

            //if the desired canvas dimensions are negative then these must be converted to zero to 
            //prevent a canvas from showing on the screen
            if (widthCanvasLandmarks < 0) {
                widthCanvasLandmarks = 0
            }

            if (heightCanvasLandmarks < 0) {
                heightCanvasLandmarks = 0
            }


            this.canvasLandmarksRef.current.style.left = leftCanvasLandmarks.toString() +'px'
            this.canvasLandmarksRef.current.style.top = topCanvasLandmarks.toString() +'px'
            this.canvasLandmarksRef.current.width = widthCanvasLandmarks;
            this.canvasLandmarksRef.current.height= heightCanvasLandmarks;

            console.log(this.canvasLandmarksRef.current.width, this.canvasLandmarksRef.current.height)

            this.drawLandmarks(leftImage, topImage)
        }
        )


        this.processInitialData()
        this.drawLandmarks(0,0)

    }

    handleLoadImage = () => {

        var img = new Image()
        img.onload = () => {
            
            this.canvasRef.current.width = img.width;
            this.canvasRef.current.height = img.height;
            this.ctx.drawImage(img,0,0,this.canvasRef.current.width,this.canvasRef.current.height)
            this.elementRef.current.height = window.innerHeight

            var ratio = window.innerHeight/img.height
            this.panZoomRef.current.zoomAbs(this.elementRef.current.getBoundingClientRect().width/2 - (this.canvasRef.current.width*ratio)/2, 0, ratio);
        }
        img.onerror  = (e) => {
            console.log('error loading the image', e)
        }
        if (this.props.data) {
            img.src = this.props.data.image
        } 
        else {
            img.src = image
        }

    }

    handleLoadLandmarks = () => {
        var p1 = [2648,1822];
        var p2 = [2756,1729];
        var p3 = [2549,1714];
        var p4 = [2657,1622];
        console.log(circleFromPoints(p1,p2,p3,p4))
        

        if (this.props.data) {
            //check if landmarks are provided
            if (this.props.data.landmarks) {
                //landmarks are provided

            } else if (dataLandmarks) {
                //sample image
            } else {
                //run the data in the model 
                console.log('run data in online model :)')
            }

        }

    }

    processInitialData = () => {

        this.handleLoadImage()
        this.handleLoadLandmarks()

        // get image from props or file
        

        // var lines = this.props.data.landmarks.split('\n');
        // for (var line = 0; line < lines.length; line++) {
        // console.log(lines[line]);
        // }

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

    drawCircle = (ctx, x, y, radius, fill, stroke, strokeWidth) => 
    {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        if (fill) {
          ctx.fillStyle = fill
          ctx.fill()
        }
        if (stroke) {
          ctx.lineWidth = strokeWidth
          ctx.strokeStyle = stroke
          ctx.stroke()
        }
      }

    drawLandmarks = (xTranslate, yTranslate) =>{
        //change the position of the landmarks if these image is larger than the screen size
        if (xTranslate>0) {xTranslate=0}
        if (yTranslate>0) {yTranslate=0}

        var x = 2645
        var y = 1712
        const scale = this.panZoomRef.current.getTransform().scale
        const dim = (0.005)*(this.canvasRef.current.width)// 1% of image width scaled to current zoom level
        if  (dim>20) {dim=20} 

        this.drawCircle(this.ctxLandmarks, x*scale +xTranslate, y*scale +yTranslate , dim*scale, 'red','red',1)

    }

    handleClick = (event) => {
        switch (event.target.id) {
            case 'resetZoom':
                // this.panZoomRef.current.moveTo(0, 0);
                // this.panZoomRef.current.zoomAbs(0, 0, 1);
                // this.panZoomCanvasRef.current.moveTo(0, 0);
                // this.panZoomCanvasRef.current.zoomAbs(0, 0, 1);

                // var ratio = window.innerHeight/img.height
                // console.log(ratio)
                // this.panZoomRef.current.zoomAbs(this.elementRef.current.getBoundingClientRect().width/2 - (this.canvasRef.current.width*ratio)/2, 0, ratio);

                var ratio = window.innerHeight/this.canvasRef.current.height
                this.panZoomRef.current.moveTo(this.elementRef.current.getBoundingClientRect().width/2- (this.canvasRef.current.width*ratio)/2, 0);
                this.panZoomRef.current.zoomAbs(this.elementRef.current.getBoundingClientRect().width/2 - (this.canvasRef.current.width*ratio)/2, 0, ratio);

                break;
            case 'return':
                this.props.updateViewParent('welcomePage')
                break
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

        if (event.button === 0)
            {console.log('left')}
        else if (event.button === 2) 
        {console.log('right')}

    }
 
    render() {
        return (
            <div>
                <div className='wrapperPage' >
                    <div className='container' ref={this.elementRef}>
                        <canvas className='canvas-image' 
                        ref={this.canvasRef}
                        onMouseDown = {this.handleMouseDown}
                        onContextMenu={(e)=> e.preventDefault() }
                        />
                        <canvas className='canvas-landmarks' 
                        ref={this.canvasLandmarksRef}
                        onMouseDown = {this.handleMouseDown}
                        onContextMenu={(e)=> e.preventDefault()}
                        />
                        {/* <img className='landmarks-image' alt='' ref={this.imageRef} src={image} onContextMenu={(e)=> e.preventDefault()} />  */}
                    </div>
                
                    <div className="patient-info">
                    <form className="information-form">
                        <div className="input-group">
                            <label htmlFor='subjectID' >Subject ID:</label>
                            <input id='subjectID' className='subject-id' type="text"/>
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
                        <button className='btn-return' id='return' onClick={this.handleClick}>Main Page</button>

                    </div>
                </div>
            </div>
        );
    }
}

export default ShowImage ;
