import axios from "axios";
import React, {useState, useEffect} from "react";
import './styles.css'
const List = ({ display, setDisplay }) =>{

  if (display.length === 1) {
    return null;
  }
  return display.map( (country) => <div>
    <li key={country.name.official}>
      {country.name.official}   <button onClick={() => setDisplay([country])} >
      Show
      </button>
    </li>
    </div>
    );
};
const Footer = () => {
  return (
    <footer id="footer">
        <p >&copy; Copyright 2022 <br />
        Built with &#x2661; by <a className="link" href="https://github.com/makaylacodes/react-country-facts" target="_blank">
        Makayla Anderson-Tucker
        </a>
        </p>
      </footer>
  );
};

const Filter = ({ display, setDisplay }) => {

  const oneResult = display.length === 1
  ? <Country country={display[0]} />
  : null;

  const results = display.length >= 11
  ? "Too many results, be more specific"
  : <List display={display} setDisplay={setDisplay} />;

  return (
    <div>
      <h3>Search Results</h3>
      {oneResult}
      {results}
    </div>
  );    
};

const Search = ({ query, handleQuery }) =>{
  return (
    <div>
      <form>
        <h2> Enter country name: 
          <input value={query} placeholder="Search.." onChange={handleQuery} />
        </h2>
      </form>
    </div>
  );
};
   
const Country = ({ country }) => {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  console.log("Api key ", apiKey);
  const [weathers, setWeather] = useState([]);

  useEffect( () => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${apiKey}`)
    .then(response => {
      console.log("Weather data sucessfully retrieved", response.data)
      setWeather(response.data);  
    });
    console.log(weathers);
  }, []);

  const display = weathers.length === 0
  ? (
    <div className="card">
      <div className="row">
        <div className="col">
          <h3>Country: {country.name.official} </h3>
          <h4>Capital: {country.capital} </h4>
          <h4>Area: {country.area} km <sup>2</sup></h4>
          <h4>Languages: </h4>
          <ol>
            {Object.values(country.languages).map(language => <li key={language} >{language}</li> )}
              </ol> 
        </div>
        <div className="col">
              <h4>Flag <br /> <img src={country.flags.svg} height="200px" width="400px" alt= "Country flag" /></h4>
  
        </div>
      </div>
    </div>
  )
  : (
    <div className="card">
      <div className="row">
        <div className="col">
          <h3 className="item">Country: {country.name.official} </h3>
          <h4 className="item">Capital: {country.capital} </h4>
          <h4 className="item">Area: {country.area} km <sup>2</sup></h4>
          <h4 className="item">Languages: </h4>
          <ol>
            {Object.values(country.languages).map(language => <li key={language} >{language}</li> )}
          </ol> 
          <h4 className="item">Flag <br /> <img src={country.flags.svg} height="200px" width="400px" alt= "Country flag" /></h4>
        </div>
        <div className="col">
              
              <h4 className="item">Current weather conditions in {country.capital} : {weathers.weather[0].description} </h4>
              <img  className="img" src={`https://openweathermap.org/img/w/${weathers.weather[0].icon}.png`} alt="Weather icon" height={150} width={150}/>
              <h4 className="item" >Temperature is <span> {Math.round(weathers.main.temp - 273.15)} &deg;C / {Math.round(1.8* (weathers.main.temp - 273) + 32)} &deg;F </span></h4>
              <h4 className="item" >Wind is {weathers.wind.speed} mph</h4>
        </div>
      </div>
    </div>
  );

  return (
    <div>
     {display}
    </div>
  );
};


const App = () => {
  const [showAll, setShowAll] = useState(false);
  const [display, setDisplay] = useState([]);
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');

   useEffect(() => {
    axios
    .get("https://restcountries.com/v3.1/all")
    .then(response => {
      console.log("Promise fulfilled", response.data)
      setCountries(response.data);
    });
  }, []);

  const handleQuery = (event) => {
    setQuery(event.target.value);
    setDisplay(countries.filter( element => element.name.official.toLowerCase().includes(query.toLowerCase()) ) );
  };

  return (
    <>
      <Search query={query} handleQuery={handleQuery} />
        <ol>
          <Filter display={display} setDisplay={setDisplay} showAll={showAll} setShowAll={setShowAll} />
        </ol>
        <Footer />
    </>
  );
  }
export default App;