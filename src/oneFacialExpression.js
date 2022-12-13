import logo from './Home_logo.jpeg';
import './App.css';

function OneFacialExpression() {
  return (
    <div className="App">
      <header className="main-header">

      <div className= "brand-name">Emotrics +</div>
        
      <nav className="main-nav">
      <ul>
        <li><a href="discover.html">Log In</a></li>
        <li><a href="join.html">About Us</a></li>
      </ul>
    </nav>
      </header>
    <div className='wrapper'>
      <div className = "center-image">
        <img width={"400"} src={logo}></img>
      </div>

    </div>
        
    </div>
  );
}

export default OneFacialExpression;