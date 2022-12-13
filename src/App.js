
import { useState, useEffect } from "react";
import OneFacialExpression from "./oneFacialExpression.js"
import WelcomePage from './welcomePage';
import LoadOneImage from "./loadOneImage.js";

function App() {

  const [showWelcomePage, setShowWelcomePage] = useState(true)
  const [showOneFacialExpression, setshowOneFacialExpression] = useState(false);
  const [showTwoFacialExpressions, setshowTwoFacialExpressions] = useState(false);
  const [showSevenFacialExpressions, setshowSevenFacialExpressions] = useState(false);


  function updateViewParent(view){
    switch (view) {
      case 'oneExpression':
        setShowWelcomePage(false);
        setshowOneFacialExpression(true);
        setshowTwoFacialExpressions(false);
        setshowSevenFacialExpressions(false);
        break;
      case 'twoExpressions':
        setShowWelcomePage(false);
        setshowOneFacialExpression(false);
        setshowTwoFacialExpressions(true);
        setshowSevenFacialExpressions(false);
        break;
      case 'sevenExpressions':
        setShowWelcomePage(false);
        setshowOneFacialExpression(false);
        setshowTwoFacialExpressions(false);
        setshowSevenFacialExpressions(true);
        break;
      default:
        break;
    }
  }
  return (<>

    {showWelcomePage ? < WelcomePage updateViewParent={updateViewParent} /> : null}
    {showOneFacialExpression ? <LoadOneImage/> : null }
        
  </>

  );
}

export default App;
