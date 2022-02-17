import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
import Input from '../components/Input';
import InputNum from '../components/InputNum';
import Select from '../components/Select';
import Button from '../components/Button';
import Row from '../components/Row';
import RowResults from '../components/RowResults';
import Result from '../components/Result';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Pagination from '../components/Pagination';
import { ReactComponent as SearchIcon } from '../res/icons/send.svg';
import backgroundImage from '../res/images/background-img-4.jpg';

const Jobs = () => {
    const { fetchJobData, allSearchJobTypes, allSearchSortBy, jobsSearch, setJobsSearch, 
        jobsData, setJobsData, jobsPageNum, setJobsPageNum, isLoading, setIsLoading } = useContext(Context);
    //local states for search; their values are assigned to 'jobsSearch' object when search button onClick
    const [searchString, setSearchString] = useState('');
    const [searchWhere, setSearchWhere] = useState('');
    const [searchSalMin, setSearchSalMin] = useState('');
    const [searchSalMax, setSearchSalMax] = useState('');
    const [searchJobType, setSearchJobType] = useState('');
    const [searchSortBy, setSearchSortBy] = useState('');
    const allSetStates = [setSearchString, setSearchWhere, setSearchSalMin, setSearchSalMax, setSearchJobType, setSearchSortBy]; 

    const searchOnSubmit = async event => {
        try {
            event.preventDefault();

            let jobsSearchNewObj = {};
            const allStates = {
                searchString: searchString, 
                searchWhere: searchWhere, 
                searchSalMin: searchSalMin, 
                searchSalMax: searchSalMax, 
                searchJobType: searchJobType, 
                searchSortBy: searchSortBy
            };
            const allStateKeys = Object.keys(allStates);
            const allStateValues = Object.values(allStates);
            
            //fetching api data to update results on this page
            await fetchJobData(setJobsData, 1, searchString, searchWhere, searchSalMin, searchSalMax, searchJobType, searchSortBy);
        
            //filling 'jobsSearchNewObj' containing up to date values from inputs; any empty inputs will be assigned empty string
            //TEST WITH 'allStateValues'
            allStateKeys.forEach((curr, index) => 
                curr ? 
                jobsSearchNewObj[allStateKeys[index]] = allStateValues[index] : 
                jobsSearchNewObj[allStateKeys[index]] = '');

            setJobsSearch(jobsSearchNewObj);
            setJobsPageNum(1);
        } catch(error){
            console.log(error);
        }
    }

    useEffect(async () => {
        setIsLoading(true);
        const jobsSearchValues = Object.values(jobsSearch);

        //if every search value ('jobsSearch' object values) is falsy, fetch random data; otherwise repopulate input fields 
        jobsSearchValues.every(curr => curr === '') ?  
        await fetchJobData(setJobsData, jobsPageNum) :
        allSetStates.forEach((curr, index) => curr(jobsSearchValues[index]));

        setIsLoading(false);
    }, [])

    return <Page backgroundImage={backgroundImage}>
        <form 
            className='flex flex-col items-center justify-evenly w-full min-h-form bg-slate-300/30'
            onSubmit={e => searchOnSubmit(e)}
        >
            <h1 className='text-white'>Search for Jobs</h1>
            <Row extraClasses='space-x-14'>
                <Input 
                    type='text'
                    placeHolder='Type in the job title or related keywords...'
                    state={searchString}
                    setState={setSearchString}
                />
                <Input 
                    type='text'
                    placeHolder='Type in the location...'
                    state={searchWhere}
                    setState={setSearchWhere}
                />
                <Button 
                    extraClasses='fill-white text-white' 
                    isRow={true} 
                    type='submit'
                >
                    Search
                    &nbsp;
                    <SearchIcon/>
                </Button>
            </Row>
            <Row extraClasses='space-x-14'>
                <InputNum
                    label='Minimum Salary'
                    isMin={true}
                    number='0'
                    state={searchSalMin}
                    setState={setSearchSalMin}
                />
                <InputNum
                    label='Maximum Salary'
                    isMin={false}
                    number='300000'
                    state={searchSalMax}
                    setState={setSearchSalMax}
                />
                <Select
                    label='Job Type'
                    state={searchJobType}
                    setState={setSearchJobType}
                    options={allSearchJobTypes}
                />
                <Select
                    label='Sort By'
                    state={searchSortBy}
                    setState={setSearchSortBy}
                    options={allSearchSortBy}
                />
            </Row>
        </form>
        <RowResults>
            {    
                isLoading ?
                <Loading/> :
                (
                    jobsData.length > 0 ?
                    jobsData.map((curr, index) =>
                        <Result
                            key={index}
                            data={curr}
                            index={index}
                        />
                    ) :
                    <NoData text="Couldn't find any matching jobs"/>
                )
            }
        </RowResults>
        
        {!isLoading && jobsData.length > 0 && <Pagination/>}
    </Page>
};

export default Jobs;