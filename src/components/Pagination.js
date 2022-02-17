import React,  { useContext, useEffect, useRef } from 'react';
import { Context } from '../Context';
import Row from './Row';
import Button from './Button';
import { ReactComponent as LeftArrowIcon } from '../res/icons/keyboard_arrow_left.svg';
import { ReactComponent as RightArrowIcon } from '../res/icons/keyboard_arrow_right.svg';

const Pagination = () => {
    const { fetchJobData, jobsPageNum, setJobsPageNum, jobsSearch, setJobsData } = useContext(Context);
    const isInitialRender = useRef(true);

    const paginationOnClick = isNext => {
        if(isNext){
            setJobsPageNum(jobsPageNum => jobsPageNum + 1)
        } else {
            jobsPageNum !== 1 && setJobsPageNum(jobsPageNum => jobsPageNum - 1);
        }
    }

    useEffect(async () => {
        if(isInitialRender.current){
            isInitialRender.current = false;
        } else {
            const { searchString, searchWhere, searchSalMin, searchSalMax, searchJobType, searchSortBy } = jobsSearch;
            await fetchJobData(setJobsData, jobsPageNum, searchString, searchWhere, searchSalMin, searchSalMax, searchJobType, searchSortBy);
        }
    }, [jobsPageNum])

    return <Row extraClasses='w-full justify-evenly pb-10'>
        <Button 
            isRow={true} 
            onClick={() => paginationOnClick(false)}
            extraClasses='fill-white'
        >
            <LeftArrowIcon/>
            Previous
        </Button>

        <h1 className='text-white'>Page {jobsPageNum}</h1>

        <Button 
            isRow={true} 
            onClick={() => paginationOnClick(true)}
            extraClasses='fill-white'
        >
            Next
            <RightArrowIcon/>
        </Button>
    </Row>
};

export default Pagination;