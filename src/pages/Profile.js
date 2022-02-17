import React, { useContext, useEffect } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
import Result from '../components/Result';
import Column from '../components/Column';
import RowResults from '../components/RowResults';
import Button from '../components/Button';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import backgroundImage from '../res/images/background-img-5.jpg'

const Profile = () => {
    const { logout, readDocumentOnSnapshot, readDocumentWoId, profileSavedData, setProfileSavedData, isLoading, setIsLoading } = useContext(Context);
    
    useEffect(async () => {
        setIsLoading(true);
        const currentUser = await readDocumentWoId('users');
        readDocumentOnSnapshot('users', currentUser[0].id, setProfileSavedData);
        setIsLoading(false);
    }, [])

    return <Page extraClasses='justify-evenly space-y-20 py-20' backgroundImage={backgroundImage}>
        {
            isLoading || Object.keys(profileSavedData).length < 0 ?
            <Loading/> :
            <>
                <Column extraClasses='w-full'>
                    <h1 className='text-white'>All Saved Jobs</h1>
                    <RowResults extraClasses='w-full'>
                        {
                            profileSavedData.savedJobs?.length > 0 ?
                            profileSavedData.savedJobs.map((curr, index) => 
                                <Result
                                    key={index}
                                    data={curr}
                                />
                            ) :
                            <NoData text='No saved jobs found...' extraClasses='unset'/>
                        }
                    </RowResults>
                </Column>
                <Button onClick={logout}>Logout</Button>
            </>  
        }
    </Page>
};

export default Profile;