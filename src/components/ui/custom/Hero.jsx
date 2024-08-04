import React, { useState } from 'react'
import { Button } from '../button'
import { useGoogleLogin } from '@react-oauth/google';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '../dialog';
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Hero() {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const login = useGoogleLogin({
        onSuccess: (codeRes) => getUserProfile(codeRes),
        onError: (err) => { throw err; }
    })

    const getUserProfile = (tokenInfo) => {
        console.log(tokenInfo);
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo.access_token}`,
                Accept: 'Application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('user', JSON.stringify(res.data))
                setOpenDialog(false);
                navigate("/dashboard");
            })
    }

    return (
        <div className='flex flex-col items-center mx-56 gap-6'>
            <h1 className='font-extrabold text-[50px] text-center mt-16'><span className='text-black'>Pantry Tracker </span></h1>
            <p className='text-xl text-gray-500 text-center'>Revolutionize the way you track your pantries.</p>
            <Button className="mt-20" onClick={() => user ? navigate('/dashboard') : setOpenDialog(true)}>Get Started</Button>

            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div className='text-xl font-bold text-gray-600'>Pantry Tracker</div>
                            <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
                            <p>Sign in to the App with Google Authentication Securly.</p>
                            <Button
                                onClick={login}
                                className='w-full mt-5 font-bold flex gap-4 items-center'>

                                <FcGoogle className='h-7 w-7' />
                                Sign in with Google

                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Hero