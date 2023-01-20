import React, { Component, createRef } from 'react';
import panzoom from 'panzoom';

import { circleFromPoints, distanceToPoint } from './utils';

import fileLandmarks from './samples/Normal1_1.js' ; 
import image from './samples/Normal1_1.jpg';
import './showImage.css'


const greenColor = [36,37,38,39,42,43,44,45,60,61,62,63,64]
const yellowColor = [76,77,78,79,80,81,82,83]

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
        this.landmarks = null
        this.visible = null
        this.iris = []


        this.leftImage = 0
        this.topImage = 0

        this.modifyPoint = null
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

            this.leftImage = rectImage.left;
            var rightImage = rectImage.right;
            this.topImage = rectImage.top;
            var bottomImage = rectImage.bottom

            var leftCanvasLandmarks = 0;
            var topCanvasLandmarks = 0;
            var widthCanvasLandmarks = 0;
            var heightCanvasLandmarks = 0; 

            // make sure that visible canvas doesn't go above the visible screen
            if (this.leftImage>=0) {
                leftCanvasLandmarks = this.leftImage;
            } else {
                leftCanvasLandmarks = 0 
            }
            if (rightImage<=visibleWidth){
                if (this.leftImage>=0){
                    widthCanvasLandmarks = rightImage-this.leftImage
                } else {
                    widthCanvasLandmarks = rightImage
                }   
            } 
            else if (rightImage>visibleWidth){
                if (this.leftImage>=0){
                    widthCanvasLandmarks = visibleWidth-this.leftImage
                } else {
                    widthCanvasLandmarks = visibleWidth
                }
            }

            
            if (this.topImage>=0) {
                topCanvasLandmarks = this.topImage;
            } else {
                topCanvasLandmarks = 0
            }
            if (bottomImage<=visibleHeight){
                if (this.topImage>=0){
                    heightCanvasLandmarks = bottomImage-this.topImage
                } else {
                    heightCanvasLandmarks = bottomImage
                }

            } else if (bottomImage > visibleHeight) {
                if (this.topImage >=0){
                    heightCanvasLandmarks = visibleHeight-this.topImage;
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

            this.drawLandmarks(this.leftImage, this.topImage)
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
        const circle = circleFromPoints(p1,p2,p3,p4)
      
        if (this.props.data) {
            //check if landmarks are provided
            if (this.props.data.landmarks) {
                //landmarks are provided from file
                var lines = this.props.data.landmarks.split('\n');
                for (var line = 0; line < lines.length; line++) {
                console.log(lines[line]);
                }
            }

        } else if (fileLandmarks) {
                // //sample image
                // const reader = new FileReader();
                // reader.onload = function (e) {
                //     console.log(e)
                //   };
                // reader.readAsText(dataLandmarks);
                // // var lines = dataLandmarks.split('\n');
                // // for (var line = 0; line < lines.length; line++) {
                // // console.log(lines[line]);
                // // }

                var landmarks = []
                var visible = []
                var leftEyeCircle = []
                var rightEyeCircle = []
                var currentIndex = 0

                var lines = fileLandmarks.split('\n');
                for (var line = 0; line < lines.length; line++) {
                    if ((line>=4) && (line<=79)) {
                        var currentLine = lines[line].split(',')
                        landmarks[currentIndex] = [parseInt(currentLine[0]), parseInt(currentLine[1])]
                        visible[currentIndex] = [true]
                        currentIndex+=1
                    }
                    if ((line>=82) && (line<=84)) {
                        var currentLine = lines[line]
                        leftEyeCircle.push(parseInt(currentLine))
                    }
                    if ((line>=87) && (line<=89)) {
                        var currentLine = lines[line]
                        rightEyeCircle.push(parseInt(currentLine))
                    }
                }

                landmarks[currentIndex] = [leftEyeCircle[0] - leftEyeCircle[2],leftEyeCircle[1]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [leftEyeCircle[0],leftEyeCircle[1] - leftEyeCircle[2]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [leftEyeCircle[0] + leftEyeCircle[2],leftEyeCircle[1]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [leftEyeCircle[0],leftEyeCircle[1] + leftEyeCircle[2]]
                visible[currentIndex] = [true]
                currentIndex+=1

                landmarks[currentIndex] = [rightEyeCircle[0] - rightEyeCircle[2],rightEyeCircle[1]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [rightEyeCircle[0],rightEyeCircle[1] - rightEyeCircle[2]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [rightEyeCircle[0] + rightEyeCircle[2],rightEyeCircle[1]]
                visible[currentIndex] = [true]
                currentIndex+=1
                landmarks[currentIndex] = [rightEyeCircle[0],rightEyeCircle[1] + rightEyeCircle[2]]
                visible[currentIndex] = [true]
                currentIndex+=1


                
        } else {
                //run the data in the model 
                console.log('run data in online model :)')
            }

        this.landmarks = landmarks
        this.visible = visible

        

    }

    processInitialData = () => {

        this.handleLoadImage()
        this.handleLoadLandmarks()

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


        const scale = this.panZoomRef.current.getTransform().scale
        var dim = (0.005)*(this.canvasRef.current.width)// 1% of image width scaled to current zoom level
        if  (dim>20) {dim=20} 
        this.ctxLandmarks.clearRect(0, 0, this.ctxLandmarks.canvas.width, this.ctxLandmarks.canvas.height)

        this.landmarks.forEach((item, idx) => {

            var x = item[0]
            var y = item[1]
            var color = 'red'
            if (yellowColor.includes(idx)) {color = 'yellow'} 
            if (greenColor.includes(idx)) {color = 'green'} 
            //draw
            if (this.visible[idx]) {this.drawCircle(this.ctxLandmarks, x*scale +xTranslate, y*scale +yTranslate , dim*scale, color,color,1)}
        })


    }

    handleClick = (event) => {
        switch (event.target.id) {
            case 'resetZoom':
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

        if (event.button === 0)
            {console.log('left')}
        else if (event.button === 2) 
            {   
                //if there are no lifted points 
                if ((this.modifyPoint==null)) {
                    console.log('right')
                    if (this.landmarks != null){
                        const findDistance = distanceToPoint(this.landmarks, [pos.x, pos.y])
                        if (findDistance[0]<10) {
                            this.modifyPoint = findDistance[1]
                            this.visible[this.modifyPoint]=false
                            this.drawLandmarks(this.leftImage, this.topImage)
                        }
                    }
                } else {
                    if (this.landmarks != null){
                        
                        this.visible[this.modifyPoint] = true
                        this.landmarks[this.modifyPoint] = [Math.round(pos.x), Math.round(pos.y)]
                        this.drawLandmarks(this.leftImage, this.topImage)
                        this.modifyPoint = null
                    }
                }           
            }

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
