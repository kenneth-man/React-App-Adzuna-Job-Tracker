import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
//https://www.chartjs.org/docs/3.3.0/getting-started/integration.html#bundlers-webpack-rollup-etc
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Page from '../components/Page';
import Column from '../components/Column';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import backgroundImage from '../res/images/background-img-6.jpg';
import { options, chartColors } from '../data/chartOptions';

const Salaries = () => {
    const { fetchSalaryData, jobsSearch, jobsSearchExtra, jobPageData, isLoading, setIsLoading } = useContext(Context);
    const [historicalData, setHistoricalData] = useState(undefined);
    const [histogramData, setHistogramData] = useState(undefined);
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement);

    useEffect(async () => {
        if(Object.keys(jobsSearchExtra).length > 0){
            setIsLoading(true);
            const location = jobsSearch.searchWhere ? jobsSearch.searchWhere : 'UK';
            await fetchSalaryData('history', setHistoricalData, location, jobsSearchExtra.category, false, 6);
            await fetchSalaryData('histogram', setHistogramData, location, jobsSearchExtra.category, jobsSearch.searchString, false);
            setIsLoading(false);
        }
    }, [jobsSearchExtra])

    return <Page backgroundImage={backgroundImage} extraClasses={`space-y-32 py-24 ${isLoading || (!historicalData && !histogramData) && 'justify-center'}`}>
        {
            isLoading ?
            <Loading/> :
            (
                historicalData && histogramData ?
                <> 
                    <h1 className='text-white'>Salary Data for <span className='italic'>'{jobPageData.title}'</span></h1>
                    <Column extraClasses='h-96'>
                        <h2 className='text-white'>Historical Salary Data (Last 6 months)</h2>
                        <Line
                            data={{
                                labels: Object.keys(historicalData),
                                datasets: [{
                                    label: 'Historical Data',
                                    data: Object.values(historicalData),
                                    backgroundColor: '#fff',
                                    color: '#fff'
                                }],
                            }}
                            options={options}
                            style={{height: '100%'}}
                        />
                    </Column>
                    
                    <Column extraClasses='h-96'>
                        <h2 className='text-white'>Salary Distribution Data (£10,000 - £70,000)</h2>
                        <Bar
                            data={{
                                labels: Object.keys(histogramData).map(salary => `£${Number(salary).toLocaleString()}`),
                                datasets: [{
                                    label: 'Histogram Data',
                                    data: Object.values(histogramData),
                                    backgroundColor: chartColors
                                }],
                            }}
                            options={options}
                            style={{height: '100%'}}
                        />
                    </Column>  
                </> :
                <NoData text='No salary data found. Please select a job than click on the "View Salaries Info" button'/>
            )
        }
    </Page>
};

export default Salaries;