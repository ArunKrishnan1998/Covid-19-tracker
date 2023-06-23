import React from 'react';
import numeral from 'numeral'
import {Circle, Popup} from 'react-leaflet'

const casesTypeColors = { 
    cases: {
        hex: "#CC1034",
        multiplier: 80,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 120,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 200,
    }
};


export const sortData = (data) => {
    if (data.length) {
        const sortedData = data;
        return sortedData.sort((a,b) => (a.cases > b.cases) ? -1 : 1);
    }
}

export const prettyPrintStat = (stat) => {
    return stat ? `+${numeral(stat).format('0.0a')}` :'+0' 
}
export const showDataOnMap = (data, caseType) => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat,country.countryInfo.long] }
            fillOpacity={0.4}
            color= {casesTypeColors[caseType].hex}
            fillColor= {casesTypeColors[caseType].hex}
            radius={
                Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
            }
        >
            <Popup>
                <div className=' info_container'>
                    <div
                        className='info_flag'
                        style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                    ></div>
                    <div className='info_name'>{country.country}</div>
                    <div className='info_cases'>Cases: {numeral(country.cases).format('0,0')}</div>
                    <div className='info_recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                    <div className='info_death'>Deaths: {numeral(country.deaths).format('0,0')}</div>
 
                </div>
            </Popup>
        </Circle>
    ))
)