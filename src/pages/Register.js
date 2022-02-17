import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import Page from '../components/Page';
import Column from '../components/Column';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import backgroundMp4 from '../res/videos/background-vid-2.mp4';
import { ReactComponent as RegisterIcon } from '../res/icons/send.svg';
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    const { auth, clearInputs, isLoading, setIsLoading, checkValidEmail, checkValidPassword } = useContext(Context);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
    const [registerError, setRegisterError] = useState(undefined);

    const registerOnSubmit = async event => {
        try {
            event.preventDefault();
            setIsLoading(true);
        
            if(checkValidEmail(registerEmail) && checkValidPassword(registerPassword, registerPasswordConfirm)){ 
                await createUserWithEmailAndPassword(auth, registerEmail, registerPassword); 
            } else {
                setRegisterError({ msg: 'Invalid Email or Password (passwords must be longer than 8 characters)', code: '403' });
            }
        } catch(error){
            setRegisterError({ msg: error.message, code: error.code });
        }
    }

    useEffect(() => {
        if(registerError){
            clearInputs([setRegisterEmail, setRegisterPassword, setRegisterPasswordConfirm]);
            setIsLoading(false);
            setRegisterError(undefined);
            alert(`Register Error: ${registerError.msg}, Error Code: ${registerError.code}`);
        }
    }, [registerError])

    return <Page backgroundVideo={backgroundMp4} extraClasses='justify-evenly' backgroundExtraClasses='fixed'>
        {
            isLoading ?
            <Loading/> :
            <>
                <Column extraClasses='z-10 space-y-10'>
                    <h1 className='text-white'>Register a new account</h1>
                    <h2 className='text-white w-1/2'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    </h2>
                </Column>

                <form onSubmit={e => registerOnSubmit(e)} className='flex flex-col items-center space-y-10 z-10'>
                    <Input 
                        type='text'
                        placeHolder='Type in your email address...'
                        state={registerEmail}
                        setState={setRegisterEmail}
                    />
                    <Input 
                        type='password'
                        placeHolder='Type in your password...'
                        state={registerPassword}
                        setState={setRegisterPassword}
                    />
                    <Input 
                        type='password'
                        placeHolder='Retype in your password...'
                        state={registerPasswordConfirm}
                        setState={setRegisterPasswordConfirm}
                    />
                    <Button
                        extraClasses='fill-white text-white' 
                        type='submit'
                        isRow={true}
                    >
                        Register
                        &nbsp;
                        <RegisterIcon/>
                    </Button>
                </form>
            </>
        }
    </Page>
};

export default Register;