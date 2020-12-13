import React, { useState, useEffect } from 'react'
import axios from 'axios'

const countryUrl = 'https://restcountries.eu/rest/v2/all'
const api_key = process.env.REACT_APP_API_KEY

const Filter = ({ filterInput, filterHandler }) => {
  return (
    <div>
      find countries 
      <input
        value={filterInput}
        onChange={filterHandler}>
      </input>
    </div>
  )
}

const CountryList = ({ countryList }) => {  
  if (countryList === null) {
    return (
      <div></div>
    )
  }
  else if (countryList.length === 1) {
    console.log('one country matched')
    return (
      <div>
        <Country country={countryList[0]}></Country>
      </div>
    )
  }
  else if (countryList.length <= 10) {
    console.log('between 1 and 10 countries matched')
    return (
      <div>
        {countryList.map(country => <CountryListItem key={country.name} name={country.name} handler={() => showCountry()}></CountryListItem>)}
      </div>
    )
  }
  else {
    console.log('too many countries matched')
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
}

const CountryListItem = ({name, handler}) => {
  return (
    <div>
      {name} <button onClick={handler}>show</button>
    </div>
  )
}

const CountryWeather = ({capital}) => {
  const [ weather, setWeather ] = useState({
    temperature: 0,
    wind_speed: 0,
    wind_dir: 'S'
  })

  const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
  axios.get(url)
    .then(response => {
      console.log('weather data received')
      setWeather(response.data)
    })

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p><b>temperature: </b>{weather.temperature} Celcius</p>
      <p><b>wind: </b>{weather.wind_speed} {weather.wind_dir}</p>
    </div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>
        capital: {country.capital}
        <br></br>
        population: {country.population}
      </p>

      <h2>languages</h2>
      <ul>
        {country.languages.map(language => 
          <li key={language.name}>
            {language.name}
          </li>
        )}
      </ul>

      <img src={country.flag} alt={`${country.name}'s flag`} height={100} width={175}></img>
      
      <br></br>

      <CountryWeather name={country.capital}></CountryWeather>
    </div>
  )
}

const showCountry = (event) => {
  console.log(event)
}

const App = () => {
  const [ filterInput, setFilter ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    console.log('effect triggered')
    axios.get(countryUrl)
      .then(response => {
        console.log('countries received')
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = filterInput.length > 0
    ? countries.filter(country => country.name.toLowerCase().includes(filterInput.toLowerCase()))
    : null

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filterInput={filterInput} filterHandler={handleFilterChange}></Filter>
      <br></br>
      <CountryList countryList={countriesToShow}></CountryList>
    </div>
  )
}

export default App;
