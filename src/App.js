
import React, { useState} from "react";
// import OneFacialExpression from "./oneFacialExpression.js"
import WelcomePage from './welcomePage';
import LoadOneImage from "./loadOneImage.js";
import ShowImage from './showImage2.js';

function App() {

  const [data, setData] = useState(null)

  const [showWelcomePage, setShowWelcomePage] = useState(true)

  const [showLoadOneFacialExpression, setShowLoadOneFacialExpression] = useState(false)
  const [showLoadTwoFacialExpressions, setShowLoadTwoFacialExpressions] = useState(false)
  const [showLoadSevenFacialExpressions, setShowLoadSevenFacialExpressions] = useState(false)
  
  const [showOneFacialExpression, setShowOneFacialExpression] = useState(false);
  const [showTwoFacialExpressions, setShowTwoFacialExpressions] = useState(false);
  const [showSevenFacialExpressions, setShowSevenFacialExpressions] = useState(false);


  // page selector function, this function makes sure to show the correct page after being called
  function updateViewParent(view, data=null){
    switch (view) {

      case 'welcomePage':
        setShowWelcomePage(true);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      case 'loadOneExpression':
        setShowWelcomePage(false);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(true);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      case 'loadTwoExpressions':
        setShowWelcomePage(false);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(true);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      case 'loadSevenExpressions':
        setShowWelcomePage(false);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(true);

        setData(data)

        break;

      case 'oneExpression':
        setShowWelcomePage(false);

        setShowOneFacialExpression(true);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      case 'twoExpressions':
        setShowWelcomePage(false);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(true);
        setShowSevenFacialExpressions(false);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      case 'sevenExpressions':
        setShowWelcomePage(false);

        setShowOneFacialExpression(false);
        setShowTwoFacialExpressions(false);
        setShowSevenFacialExpressions(true);

        setShowLoadOneFacialExpression(false);
        setShowLoadTwoFacialExpressions(false);
        setShowLoadSevenFacialExpressions(false);

        setData(data)

        break;

      default:
        break;
    }
  }
  return (<>

    {showWelcomePage ? < WelcomePage updateViewParent={updateViewParent} /> : null}
    {showLoadOneFacialExpression ? <LoadOneImage updateViewParent={updateViewParent}/> : null }
    {showOneFacialExpression ? <ShowImage updateViewParent={updateViewParent}
                                          data = {data}
                                          /> : null }
        
  </>

  );
}

export default App;
