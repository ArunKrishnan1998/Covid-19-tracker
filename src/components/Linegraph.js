import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const options = {
    plugins: {
        legend: {
            display: false
        },
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label : function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridlines: {
                    display: false
                },
                ticks: {
                    callback : function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
}
function Linegraph({caseType, className}) {

    const [data, setData] = useState([]);
    
    const buildChartData = (data) => {
        const chartData = [];
        let lastDataPoint = '';
        for(let date in data[caseType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[caseType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[caseType][date];
        }
        return chartData;
    }

    useEffect(() => {
        const getGraphData = async() => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                  .then((response) => response.json())
                  .then((resp) => {
                    const chartData = buildChartData(resp, 'cases ');
                    console.log(resp, chartData);
                    setData(chartData);
                  })
        }
        getGraphData();
    },[])
  return (
    <div className={className}>
        {data?.length> 0 && (
        <Line 
            options={options}
            data={{
                datasets:[
                    {
                        backgroundColor: "rgba(204, 16, 52, 0)",
                        borderColor: "#CC1034 ",
                        data: data
                    }
                ]
              }} 
        />
        )}
    </div>
  )
}

export default Linegraph