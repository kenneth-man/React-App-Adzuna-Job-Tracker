import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
import Column from '../components/Column';
import Button from '../components/Button';
import LinkComponent from '../components/LinkComponent';
import Input from '../components/Input';
import Loading from '../components/Loading';
import backgroundMp4 from '../res/videos/background-vid-1.mp4';
import { ReactComponent as GoogleIcon } from '../res/icons/google3.svg';
import { ReactComponent as EmailIcon } from '../res/icons/login.svg';
import logo from '../res/images/logo.png';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const { auth, loginWithGoogle, clearInputs, isLoading, setIsLoading } = useContext(Context);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState(undefined);

    const loginOnSubmit = async event => {
        try {
            event.preventDefault();
            setIsLoading(true);

            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        } catch(error){
            setLoginError({ msg: error.message, code: error.code });
        }
    }
    
    useEffect(() => {
        if(loginError){
            clearInputs([setLoginEmail, setLoginPassword]);
            setIsLoading(false);
            setLoginError(undefined);
            alert(`Login Error: ${loginError.msg}, Error Code: ${loginError.code}`);
        }
    }, [loginError])

    return <Page backgroundVideo={backgroundMp4} extraClasses='login justify-evenly' backgroundExtraClasses='fixed'>
        {
            isLoading ?
            <Loading/> :
            <>
                <Column extraClasses='fixed top-0 left-0 w-full justify-evenly h-64 bg-adzuna/30 z-10'>
                    <img src={logo} alt='adzuna-logo'/>
                    <h1 className='text-white'><span className='font-medium'>Adzuna Job Tracker</span>&nbsp; &ndash; &nbsp;Search for jobs, then save and track them!</h1>
                </Column>
                <Column extraClasses='space-y-6 z-10 mt-64'>
                    <h1 className='text-white'>Log in or Register via a pre-existing Google Account</h1>
                    <Button 
                        extraClasses='fill-white text-white' 
                        onClick={loginWithGoogle}
                        isRow={true}
                    >
                        Google Login
                        &nbsp;
                        <GoogleIcon/>
                    </Button>
                </Column>

                <form className='flex flex-col items-center space-y-10 z-10' onSubmit={e => loginOnSubmit(e)}>
                    <h1 className='text-white'>Login in with Email and Password</h1>
                    <Input 
                        type='text' 
                        placeHolder='Type in your email adress...'
                        state={loginEmail}
                        setState={setLoginEmail}
                    />
                    <Input
                        type='password' 
                        placeHolder='Type in your password...'
                        state={loginPassword}
                        setState={setLoginPassword}
                    />
                    <Button 
                        extraClasses='fill-white text-white' 
                        type='submit'
                        isRow={true}
                    >
                        Email login
                        &nbsp;
                        <EmailIcon/>
                    </Button>
                </form>

                <LinkComponent to='/Register' extraClasses='text-white z-10'>Not already registered with Email and Password? Click here...</LinkComponent>
            </>
        }
    </Page>
};

export default Login;