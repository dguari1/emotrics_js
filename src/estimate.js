import React from 'react';
import image from './visa.jpeg';

// Register WebGL backend.
import '@mediapipe/face_mesh'
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

class Estimate extends React.Component {
    state = {
        landmarks: null, // Estimated facial landmarks
    }

    imageRef = React.createRef();

    async componentDidMount() {
        // Load the facemesh model
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
            //runtime: 'mediapipe', // or 'tfjs'
            runtime: 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
            refineLandmarks: true,
            }
        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

        // Estimate the facial landmarks in the photograph
        const landmarks = await detector.estimateFaces(this.imageRef.current);
        this.setState({landmarks});

        var blob = new Blob([JSON.stringify(landmarks)], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        //a.style.display = 'none';
        a.target = '_blank';
        a.type = 'button';
        a.href = url; 
        document.body.appendChild(a);
        a.click(function (event){
            event.preventDefault();
        });
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    render() {
        return (
            <div>
                <img ref={this.imageRef} src={image} alt="My Photo" />
                <div>
                    Estimated facial landmarks:
                    {JSON.stringify(this.state.landmarks)}
                </div>
            </div>
        );
    }
}

export default Estimate;
