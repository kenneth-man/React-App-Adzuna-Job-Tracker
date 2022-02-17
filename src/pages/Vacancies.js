import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
//https://www.chartjs.org/docs/3.3.0/getting-started/integration.html#bundlers-webpack-rollup-etc
import { Chart, CategoryScale, DoughnutController, ArcElement, Tooltip, Legend, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import NoData from '../components/NoData';
import Loading from '../components/Loading';
import backgroundImage from '../res/images/background-img-7.jpg';
import { doughnutOptions, options, chartColors } from '../data/chartOptions';
import Column from '../components/Column';

const Vacancies = () => {
    const { fetchSalaryData, jobsSearch, jobsSearchExtra, jobPageData, isLoading, setIsLoading } = useContext(Context);
    const [geoData, setGeoData] = useState(undefined);
    const [companiesData, setCompaniesData] = useState(undefined);
    Chart.register(CategoryScale, DoughnutController, ArcElement, Tooltip, Legend, BarElement);

    useEffect(async () => {
        if(Object.keys(jobsSearchExtra).length > 0){
            setIsLoading(true);
            const location = jobsSearch.searchWhere ? jobsSearch.searchWhere : 'UK';
            await fetchSalaryData('geodata', setGeoData, location, jobsSearchExtra.category, false, false);
            await fetchSalaryData('top_companies', setCompaniesData, location, jobsSearchExtra.category, jobsSearch.searchString, false);
            setIsLoading(false);
        }
    }, [jobsSearchExtra])
    
    return <Page backgroundImage={backgroundImage} extraClasses={`space-y-32 py-24 px-20 ${isLoading || (!geoData && !companiesData) && 'justify-center'}`}>
        {
            isLoading ?
            <Loading/> :
            (
                geoData && companiesData ?
                <>
                    <h1 className='text-white'>Vacancies Data for <span className='italic'>'{jobPageData.title}'</span></h1>
                    <Column extraClasses='h-chart w-full space-y-10'>
                        <h2 className='text-white'>Vacancies per area</h2>
                        <Doughnut
                            data={{
                                labels: geoData.map(curr => curr.location.display_name),
                                datasets: [{
                                    label: 'Geographical Data',
                                    data: geoData.map(curr => curr.count),
                                    backgroundColor: chartColors,
                                    borderColor: chartColors,
                                    borderWidth: 1,
                                }],
                            }}
                            options={doughnutOptions}
                            style={{height: '100%'}}
                        />
                    </Column>
                    <Column extraClasses='h-96'>
                        <h2 className='text-white'>Current vacancies by top 5 companies</h2>
                        <Bar
                            data={{
                                labels: companiesData.map(curr => curr.canonical_name),
                                datasets: [{
                                    label: 'Companies Data',
                                    data: companiesData.map(curr => curr.count),
                                    backgroundColor: chartColors
                                }],
                            }}
                            options={options}
                            style={{height: '100%'}}
                        />
                    </Column>  
                </> :
                <NoData text='No vacancies data found. Please select a job than click on the "View Vacancies Info" button'/>
            )
        }
    </Page>
};

export default Vacancies;