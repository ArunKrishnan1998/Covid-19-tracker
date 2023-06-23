import { useEffect, useState } from 'react';
import './App.css';
import {FormControl, Select, MenuItem, Card, CardContent} from '@mui/material'
import Infobox from './components/Infobox';
import Map from './components/Map';
import Table from './components/Table.js';
import {sortData} from './util.js';
import Linegraph from './components/Linegraph';
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util.js'
function App() {

  const [countries, setCountries] = useState([]);
  const [activeCountry, setActiveCountry] = useState('worldwide');
  const [activeCountryData, setDctiveCountryData] = useState({});
  const [topCountriesData, setTopCountriesData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: '34.80746', lng: '-40.4796 '});
  const [mapZoom, setMapZoom] = useState(3);
  const [caseType, setCaseType] = useState('cases');

  const onCountryChange = async (event) => {
    const code = event ? event.target.value : 'worldwide';
    const getCountryData = async() => {
        await fetch(code === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${code}`)
              .then((response) => response.json())
              .then((data) => {
                setActiveCountry(code);
                setDctiveCountryData(data);
                setMapCenter([data.countryInfo?.lat, data.countryInfo?.long])
                console.log("selected.... ", code, data)
              })
    }
    getCountryData();
  }

  useEffect(() => {
    const getData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => (
                  {
                    name: country.country,
                    value: country.countryInfo.iso2
                  }
                ));
                const sortedData = sortData(data);
                setTopCountriesData(sortedData)
                setCountries(countries);
            })
    }
    getData();
    onCountryChange();
  }, []);

  const changeCaseType = (type) => {
    setCaseType(type);
  };

  return (
    <div className="app">

      <div className='app_left'>
          <div className='app_header'>
            <h1>COVID-19 TRACKER</h1>
            <FormControl className='app_dropdown'>
                <Select variant='outlined' value={activeCountry} onChange={onCountryChange}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map(country => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
            </FormControl>
          </div>

          <div class="app_stats">
            <Infobox 
              active={caseType === 'cases'}
              title="Corona Virus cases"
              cases={prettyPrintStat(activeCountryData.todayCases)}
              total={prettyPrintStat(activeCountryData.cases)}
              onClick={e => changeCaseType('cases')}
              caseType={caseType}
            />
            <Infobox 
              active={caseType === 'recovered'}
              title="recovered"
              cases={prettyPrintStat(activeCountryData.todayRecovered)}
              total={prettyPrintStat(activeCountryData.recovered)}
              onClick={e => changeCaseType('recovered')}
              caseType={caseType}

            />
            <Infobox 
              active={caseType === 'deaths'}
              title="Deaths"
              cases={prettyPrintStat(activeCountryData.todayDeaths)}
              total={prettyPrintStat(activeCountryData.deaths) }
              onClick={e => changeCaseType('deaths')}
              caseType={caseType}
            />
          </div>

          <Map center={mapCenter} zoom={mapZoom} countries={topCountriesData} caseType={caseType}  />
      </div>

      <Card className='app_right'>
         <CardContent>
            <h3>Live cases</h3>
            <Table countriesData={topCountriesData}/>
            <h3 className='app_worldwide_new'>Worldwide new {caseType}</h3>
            <Linegraph className='app_graph' caseType={caseType}/>
         </CardContent>

      </Card>
    </div>
  );
}

export default App;
