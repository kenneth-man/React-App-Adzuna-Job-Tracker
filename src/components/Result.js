import React, { useContext } from 'react';
import { Context } from '../Context';
import Column from './Column';
import { Link } from 'react-router-dom';

const Result = ({ data, index }) => {
    const { formatSalary, formatDate, setJobPageData, setJobsSearchExtra, setJobPageIndex } = useContext(Context);

    const resultOnClick = () => {
        setJobPageData(data);
        setJobPageIndex(index);
        setJobsSearchExtra({ category: data.category.tag })
    }
    
    return <Link to={`/JobPage/${data.id}`} onClick={resultOnClick} className='mx-8 mb-16'>
        <Column extraClasses='justify-evenly bg-slate-300/30 min-h-result min-w-result w-result hover:bg-slate-300/60 hover:scale-105 active:hover:scale-95'>
            <h1 className='text-white w-result-h1 whitespace-nowrap overflow-hidden overflow-ellipsis'>{data.title}</h1>
            <h2 className='text-white'>
                Salary: {
                    data.salary_min === data.salary_max ? 
                    formatSalary(data.salary_min) : 
                    `${formatSalary(data.salary_min)} - ${formatSalary(data.salary_max)}`
                }
            </h2>
            <h2 className='text-white'>Date Posted: {formatDate(data.created)}</h2>  
            <h2 className='text-white'>Location: {data.location.display_name}</h2>
        </Column>
    </Link>
};

export default Result;