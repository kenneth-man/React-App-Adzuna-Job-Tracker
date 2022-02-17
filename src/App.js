import React, { useState } from 'react';
import ContextProvider from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import JobPage from './pages/JobPage';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Salaries from './pages/Salaries';
import Vacancies from './pages/Vacancies';
import Navbar from './components/Navbar';

//firebase sdk; 
//1) create project on firebase.com, add the sign in methods you require
//2) enable firestore api and create firstore database on google cloud platform
//3) update database rules (permissions) https://stackoverflow.com/questions/46590155/firestore-permission-denied-missing-or-insufficient-permissions
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCyF0kEjeH7uT9SmB_l9KtOa04zQLmJFdE",
    authDomain: "adzuna-job-tracker.firebaseapp.com",
    projectId: "adzuna-job-tracker",
    storageBucket: "adzuna-job-tracker.appspot.com",
    messagingSenderId: "1095496417984",
    appId: "1:1095496417984:web:f1ce921ad9498185672325"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const App = () => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    //onAuthStateChanged parses a 'user' object in the callback function if signed in, otherwise 'user' is null; 'auth.currentUser' is same as 'user'
    onAuthStateChanged(auth, user => user ? setIsUserSignedIn(true) : setIsUserSignedIn(false));

    return (
        <div className='App flex flex-col justify-start relative overflow-y-scroll'>
            <BrowserRouter>
                <ContextProvider auth={auth} db={db}>
                    {isUserSignedIn && <Navbar/>}

                    <Routes>
                        <Route path='/' exact element={isUserSignedIn ? <Home/> : <Login/>}/>
                        <Route path='/Register' exact element={<Register/>}/>
                        <Route path='/Jobs' exact element={<Jobs/>}/>
                        <Route path='/Salaries' exact element={<Salaries/>}/>
                        <Route path='/Vacancies' exact element={<Vacancies/>}/>
                        <Route path='/JobPage/:jobName' element={<JobPage/>}/>
                        <Route path='/Profile/:userName' element={<Profile/>}/>
                    </Routes>
                </ContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;