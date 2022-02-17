import React, { createContext, useState, useEffect, useRef } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, doc, query, addDoc, getDoc, getDocs, onSnapshot, updateDoc, deleteDoc, orderBy, limit, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

export const Context = createContext();

const ContextProvider = ({ children, auth, db }) => {
    const provider = new GoogleAuthProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [navbarName, setNavbarName] = useState('LOADING...');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [jobPageData, setJobPageData] = useState(undefined);
    const [jobPageIndex, setJobPageIndex] = useState(undefined);
    const [profileSavedData, setProfileSavedData] = useState({});
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    const allSearchJobTypes = ['full_time', 'part_time', 'contract', 'permanent'];
    const allSearchSortBy = ['hybrid', 'date', 'salary', 'relevance'];
    const navigate = useNavigate();
    //in react, environment variables must be prefixed with 'REACT_APP_' and file must be in top level directory; then restart server
    const { REACT_APP_APPLICATION_ID, REACT_APP_APPLICATION_KEY } = process.env;
    const isInitialRender = useRef(true);

    //putting these states in context so they retain even when clicking off the respective page
    //'jobsSearch' is used to repopulate the input fields if clicked off then back onto the page, because i'm using local state for input field values
    //otherwise I would have to pass an extra 12 state and setStates (6 inputs when searching) from context to child elements
    const [jobsSearch, setJobsSearch] = useState({ 
        searchString: '',
        searchWhere: '',
        searchSalMin: '',
        searchSalMax: '',
        searchJobType: '',
        searchSortBy: '',
    });
    //will be the shared query parameters as object properties for both 'Salaries' and 'Vacancies' pages, but aren't used in 'Jobs' page
    const [jobsSearchExtra, setJobsSearchExtra] = useState({})
    const [jobsData, setJobsData] = useState([]);
    const [jobsPageNum, setJobsPageNum] = useState(1);
    
    //check if valid email
    const checkValidEmail = inputEmail => inputEmail.match(validEmailRegex) ? true : false;

    //check if valid password
    const checkValidPassword = (inputPassword, inputPasswordConfirm) => inputPassword.length > 8 && inputPassword === inputPasswordConfirm ? true : false;
    
    //login account with google account
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch(error){
            console.log(error);
        }
    }

    //logout of account
    const logout = async () => {
        if(auth.currentUser){
            try {
                await signOut(auth);
            } catch(error) {
                console.log(error);
            }
        }
    }

    //check if a user already exist in the 'users' collection in firestore
    const checkUserAlreadyExists = async uid => {
        try {
            const allUsers = await readAllDocuments('users');
            const userAlreadyExists = allUsers ? allUsers.find(curr => curr.uid === uid) : false;
            return userAlreadyExists;
        } catch(error){
            console.log(error);
        }
    }

    //scroll to top of specified DOM element
    const scrollToTop = () => {
        //prevent .Page from being overlapped by .navbar; offset position from top by 100px (bc .navbar is 100px height); scrollIntoView() doesn't allow offset positioning
        document.querySelector('.App').scrollTo({
            top: document.querySelector('.Page').offsetTop - 100,
            behavior: 'smooth'
        });
    }

    //scroll to bottom of specified DOM element
    const scrollToBottom = () => {
        const element = document.querySelector('.App');

        //scrollTo after data updates; not immediately otherwise will scroll to just before added message/post
        setTimeout(() => {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth'
            });
        }, 500);
    }

    //clear all input elements
    const clearInputs = inputSetStateArray => inputSetStateArray.forEach(curr => curr(''));

    //replace 'spaces' with '%20' in a string
    const formatFetchString = inputString => inputString.replaceAll(' ', '%20');

    const formatSalary = salary => `£${Math.round(salary).toLocaleString()}`;

    const formatDate = date => date.slice(0,10);

    const formatJobType = type => type.replaceAll('_', ' ');

    //fetch adzuna api data 
    const fetchJobData = async (setState, pageNum, what, where, salary_min, salary_max, searchJobType, sort_by) => {
        try {
            //JavaScript Fetch with Request and Headers Objects (if you need to change some request options)...
            //https://www.youtube.com/watch?v=YJ7ZgGnhN5k&list=PLO62VgiN17mwp8h8nCkw6WPvQlHcEjRm1&index=45&t=695s
            //options: method, headers, body, mode 
            //methods: GET, POST, PUT, DELETE, OPTIONS 
            //headers: Content-Type, Content-Length, Accept, Accept-Language, X-Requested-with, User-Agent
            
            // const url = 'https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=953fe9b6&app_key=5e2d06354aecc2109f8266f309dbee55&results_per_page=3';

            // let h = new Headers();
            // h.append('Content-Type', 'application/json');
    
            // let req = new Request(url, {
            //     method: 'GET',
            //     headers: h,
            //     mode: 'cors'
            // });

            const allParams = {what, where, salary_min, salary_max, searchJobType, sort_by};

            //mapping out params into an array; don't have to use a super long url string in fetch function
            const allParamsStrings = Object.values(allParams).map((curr, index) => {
                const keyName = Object.keys(allParams)[index];

                if(curr){
                    if(keyName === 'searchJobType'){
                        return `${curr}=1&`
                    } else {
                        return `${keyName}=${keyName === 'what' || keyName === 'where' ? formatFetchString(curr) : curr}&`
                    }
                }
            });

            //joining all truthy elements into one string
            const allTruthyParamsAsString = Object.values(allParamsStrings).filter(curr => curr).join('');

            const response = await fetch(`https://api.adzuna.com/v1/api/jobs/gb/search/${pageNum}?app_id=${REACT_APP_APPLICATION_ID}&app_key=${REACT_APP_APPLICATION_KEY}&results_per_page=8&${allTruthyParamsAsString}`);
            const data = await response.json();
            
            setState(data.results);
        } catch(error){
            console.log(error);
        }
    }

    const fetchSalaryData = async (dataType, setState, location, category, what, months) => {
        try {
            const allDataTypes = [
                {
                    type: 'history',
                    dataProp: 'month'
                },
                {
                    type: 'histogram',
                    dataProp: 'histogram'
                },
                {
                    type: 'geodata',
                    dataProp: 'locations'
                },
                {
                    type: 'top_companies',
                    dataProp: 'leaderboard'
                }
            ];
            const dataTypeObj = allDataTypes.find(curr => curr.type === dataType);
            const specificQueryParam = dataType === 'history' ? `&months=${months}` : ( dataType === 'geodata' ? '' : `&what=${what}` );
            const response = await fetch(`http://api.adzuna.com/v1/api/jobs/gb/${dataType}?app_id=${REACT_APP_APPLICATION_ID}&app_key=${REACT_APP_APPLICATION_KEY}&location0=${location}&category=${category}${specificQueryParam}`);
            const data = await response.json();
            
            setState(data[dataTypeObj.dataProp]);
        } catch(error){
            console.log(error);
        }
    }



    ///////////////////////////
    //FIREBASE CRUD FUNCTIONS//
    ///////////////////////////

    //CREATE DOCUMENT (AND CREATE COLLECTION IF DOESN'T EXIST)
    const createDocument = async (collectionName, dataObj) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), dataObj);
            return docRef.id;
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT
    const readDocument = async (collectionName, documentId) => {
        try {
            const document = await getDoc(doc(db, collectionName, documentId));
            return document.data();
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT WITHOUT SPECIFYING DOC ID
    const readDocumentWoId = async collectionName => {
        try {
            const response = await readAllDocuments(collectionName);

            //if collection name is 'users', return the currently signed in user's object in an array
            if(collectionName === 'users') return response.filter(curr => curr.uid === auth.currentUser.uid);

            return response;
        } catch(error){
            console.log(error);
        }
    }

    //READ ALL DOCUMENTS
    const readAllDocuments = async (collectionName, orderedBy = false, limit = false, includeId = true) => {
        try {
            let allDocuments;
            let returnArray = [];

            orderedBy ?
            (
                limit ?
                allDocuments = await getDocs(query(collection(db, collectionName), orderBy(orderedBy), limit(limit))) :
                allDocuments = await getDocs(query(collection(db, collectionName), orderBy(orderedBy)))
            ) :
            (
                limit ?
                allDocuments = await getDocs(query(collection(db, collectionName), limit(limit))) :
                allDocuments = await getDocs(query(collection(db, collectionName)))
            )

            includeId ?
            allDocuments.forEach(doc => returnArray.push({ 
                ...doc.data(),
                id: doc.id
            })) :
            allDocuments.forEach(doc => returnArray.push({ 
                ...doc.data() 
            }));

            return returnArray;
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT ONSNAPSNOT
    const readDocumentOnSnapshot = (collectionName, documentId, setState) => {
        const firebaseQuery = query(collection(db, collectionName));

        onSnapshot(firebaseQuery, snapshot => {
            let returnArray = [];
            
            snapshot.forEach(doc => 
                documentId === doc.id && 
                returnArray.push({
                    ...doc.data(),
                    id: doc.id 
                })
            )

            setState(returnArray[0]);
        });
    }

    //READ ALL DOCUMENTS ONSNAPSHOT
    const readAllDocumentsOnSnapshot = (collectionName, orderedBy, setState = false, fieldKey = false, fieldValue = false) => { 
        //'query' method is used for specifying which documents you want to retrieve from a collection
        const messagesQuery = 
            fieldKey ? 
            query(collection(db, collectionName), where(fieldKey, '==', fieldValue), orderBy(orderedBy), limit(1000)) : 
            query(collection(db, collectionName), orderBy(orderedBy), limit(1000));

        //attaching a permanent listener that listens for realtime updates
        onSnapshot(messagesQuery, snapshot => {
            let returnArray = [];
        
            snapshot.forEach(doc => returnArray.push({
                ...doc.data(),
                id: doc.id 
            }))

            if(setState){
                setState(returnArray);
            } else {
                return returnArray;
            }
        });
    }

    //UPDATE DOCUMENT
    const updateDocument = async (collectionName, documentId, key, value, overwriteField = true) => {
        try {
            let field = {};
            const existingDocumentData = await readDocument(collectionName, documentId);

            //assigning the 'key' parameter of this function, as the key for updating a field in the specified firestore document;
            //https://stackoverflow.com/questions/4244896/dynamically-access-object-property-using-variable
            overwriteField ?
            field[key] = value :
            field[key] = [...existingDocumentData[key], value];

            await updateDoc(doc(db, collectionName, documentId), field);
        } catch(error){
            console.log(error);
        }
    }

    //DELETE DOCUMENT
    const deleteDocument = async (collectionName, documentId) => {
        try {
            await deleteDoc(doc(db, collectionName, documentId));
        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => 
        onAuthStateChanged(auth, async user => {
            if(user){
                const { uid, displayName, email } = auth.currentUser;
                const doesUserAlreadyExist = await checkUserAlreadyExists(uid);

                //used for new email and password registrations
                const generateNameFromEmail = inputEmail => inputEmail.split('@')[0];
                
                // updating auth and firebase
                if(!doesUserAlreadyExist){
                    //if registered via email, update the user a 'diplayName' and 'photoURL' in firebase auth; these properties already come with google accounts 
                    if(!displayName){
                        //doesn't cause state change of 'auth' object
                        await updateProfile(auth.currentUser, {
                            displayName: generateNameFromEmail(email)
                        });
                        setNavbarName(generateNameFromEmail(auth.currentUser.email));
                    } else {
                        setNavbarName(displayName);
                    }

                    //add new user's document data in firebase to easily maniplute data using firebase CRUD operations (auth data is only currently signed in user)
                    const docRefId = await createDocument('users', {
                        uid,
                        displayName: auth.currentUser.displayName,
                        email,
                        savedJobs: []
                    });

                    //adding the document id to newly created user document; if field key doesn't exist, 'updateDoc' creates one
                    await updateDocument('users', docRefId, 'id', docRefId, true);
                } else {
                    setNavbarName(displayName);
                }
            } 

            isInitialRender.current ? isInitialRender.current = false : navigate('/');
            setIsLoading(false);
        })
    , [])

    return <Context.Provider value={
        {
            auth, db, isLoading, navbarName, isDarkMode, allSearchJobTypes, allSearchSortBy, jobsData, jobsPageNum, jobsSearch, jobPageData, jobsSearchExtra, profileSavedData, jobPageIndex, 
            setIsLoading, setNavbarName, setIsDarkMode, checkValidEmail, checkValidPassword, loginWithGoogle, logout, scrollToTop, scrollToBottom, clearInputs, createDocument, 
            readDocument, readDocumentWoId, readAllDocuments, readDocumentOnSnapshot, readAllDocumentsOnSnapshot, updateDocument, deleteDocument, fetchJobData, 
            setJobsData, setJobsPageNum, setJobsSearch, formatSalary, formatDate, setJobPageData, formatJobType, fetchSalaryData, setJobsSearchExtra, setProfileSavedData, setJobPageIndex
        }
    }>
        {children}
    </Context.Provider>
}

export default ContextProvider;