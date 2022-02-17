import React, { useContext, useEffect, useState, useRef } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
import NoData from '../components/NoData';
import Column from '../components/Column';
import Row from '../components/Row';
import Button from '../components/Button';
import LinkButtonComponent from '../components/LinkButtonComponent';
import backgroundImage from '../res/images/background-img-5.jpg';
import { ReactComponent as SaveIcon } from '../res/icons/cloud_queue.svg';
import { ReactComponent as UnSaveIcon } from '../res/icons/cloud_off.svg';
import { ReactComponent as SalariesIcon } from '../res/icons/wallet.svg';
import { ReactComponent as VacanciesIcon } from '../res/icons/emoji_people.svg';
import { ReactComponent as LeftArrowIcon } from '../res/icons/keyboard_arrow_left.svg';
import { ReactComponent as RightArrowIcon } from '../res/icons/keyboard_arrow_right.svg';

const JobPage = () => {
    const { jobsData, jobPageData, setJobPageData, formatSalary, formatDate, formatJobType, 
        readDocumentOnSnapshot, readDocumentWoId, updateDocument, jobPageIndex, setJobPageIndex } = useContext(Context);
    const [currUserData, setCurrUserData] = useState({});
    const [isJobSaved, setIsJobSaved] = useState(false);
    const isInitialRender = useRef(true);

    const saveJobOnClick = async () => {
        if(isJobSaved){
            await updateDocument('users', currUserData.id, 'savedJobs', currUserData.savedJobs.filter(job => job.title !== jobPageData.title));
        } else {
            //to prevent firebase error: Document fields cannot begin and end with "__"
            const jobPageDataCopy = {...jobPageData};
            delete jobPageDataCopy['__CLASS__'];
            delete jobPageDataCopy.company['__CLASS__'];
            delete jobPageDataCopy.category['__CLASS__'];
            delete jobPageDataCopy.location['__CLASS__'];
            
            await updateDocument('users', currUserData.id, 'savedJobs', jobPageDataCopy, false);
        }
    }

    const updateJobPageIndex = isDecrement => {
        if(isDecrement){
            jobPageIndex > 0 && setJobPageIndex(jobPageIndex => jobPageIndex - 1);
        } else {
            const tempIndex = jobPageIndex + 1;
            jobsData[tempIndex] && setJobPageIndex(jobPageIndex => jobPageIndex + 1);
        }
    }

    useEffect(async () => {
        try {
            const currentUser = await readDocumentWoId('users');
            readDocumentOnSnapshot('users', currentUser[0].id, setCurrUserData);
        } catch(error){
            console.log(error);
        }
    }, [])

    useEffect(() => {
        if(Object.keys(currUserData).length !== 0) currUserData.savedJobs.find(job => job.id === jobPageData.id) ? setIsJobSaved(true) : setIsJobSaved(false);
    }, [currUserData, jobPageData])
    
    useEffect(() => {
        if(isInitialRender.current){
            isInitialRender.current = false;
        } else {
            setJobPageData(jobsData[jobPageIndex]);
        }
    }, [jobPageIndex])

    return <Page backgroundImage={backgroundImage} extraClasses='jobPage justify-evenly'>
        {
            jobPageData ?
            <>
                <Column extraClasses='space-y-10'>
                    <h1>{jobPageData.title}</h1>
                    <h2>Salary: {jobPageData.salary_min === jobPageData.salary_max ? formatSalary(jobPageData.salary_min) : `${jobPageData.salary_min} - ${jobPageData.salary_max}`}</h2>
                    <h2>Date Posted: {formatDate(jobPageData.created)}</h2>
                    <h2>Location: {jobPageData.location.display_name}, {jobPageData.location.area[0]}</h2>
                </Column>

                <Column extraClasses='bg-slate-300/30 space-y-10 p-16'>
                    <h2>{jobPageData.company.display_name} &ndash; {jobPageData.category.label}</h2>

                    <p className='text-xl font-light'>{jobPageData.description}</p>

                    <p className='text-lg font-light text-center'>
                        This job is a {jobPageData.contract_time && formatJobType(jobPageData.contract_time)} {jobPageData.contract_type && formatJobType(jobPageData.contract_type)} role.
                        If you would like to view this job on adzuna, please visit 
                        <br></br>
                        <a href={jobPageData.redirect_url} className='text-lg font-semibold'>{jobPageData.redirect_url}</a>
                    </p>
                </Column>

                <Row extraClasses='space-x-10'>
                    <Button onClick={saveJobOnClick} isRow={true} extraClasses='fill-white'>
                        {   
                            isJobSaved ? 
                            <>
                                <UnSaveIcon/>
                                Unsave this job
                            </> : 
                            <>
                                <SaveIcon/>
                                Save this job
                            </>
                        }
                    </Button>
                    <LinkButtonComponent to='/Salaries' isRow={true} extraClasses='fill-white'>
                        <SalariesIcon/>
                        View Salaries Info
                    </LinkButtonComponent>
                    <LinkButtonComponent to='/Vacancies' isRow={true} extraClasses='fill-white'>
                        <VacanciesIcon/>
                        View Vacancies Info  
                    </LinkButtonComponent>
                </Row>

                <button className='fill-white absolute left-5 jobPage__arrow' onClick={() => updateJobPageIndex(true)}>
                    <LeftArrowIcon/>
                </button>

                <button className='fill-white absolute right-5 jobPage__arrow' onClick={() => updateJobPageIndex(false)}>
                    <RightArrowIcon/>
                </button>
            </> :
            <NoData text='Could not find Job Details'/>
        }
    </Page>
};

export default JobPage;