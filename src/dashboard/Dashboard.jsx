import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator'
import { db } from '@/db/db';
import { imgToResponse } from '@/service/gemini';
import CameraComponent from '@/utils/CameraComponent';
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai"

function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [pantries, setPantries] = useState([]);
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const docId = user.id;
    const docRef = doc(db, 'Pantry', docId);

    const addPantry = async (pantry) => {
        setOpenDialog(false);
        setLoading(true);
        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const updatedData = {
                    pantry: arrayUnion(pantry)
                };
                await updateDoc(docRef, updatedData);
                console.log("Item added successfully");
            } else {
                await setDoc(docRef, {
                    pantry: [pantry]
                })
            }

            showPantris();
        } catch (error) {
            console.error("Error adding item:", error);
        }
        setLoading(false);
    }

    const showPantris = async () => {
        const querySnapshot = await getDoc(docRef);
        setPantries([]);
        setPantries(querySnapshot.data().pantry)
    }

    useEffect(() => {
        showPantris();
    })

    useEffect(() => {
        imgToResponse(image).then((res) => addPantry(res));
    }, [image])

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-4'>
                <div className='flex mt-12 gap-20'>
                    <h1 className='text-3xl font-semibold'>Your Pantries</h1>
                    <Button className="" onClick={() => {
                        setOpenDialog(true);
                    }}>{
                            loading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Add Pantry"
                        }</Button>
                </div>
                <Separator />
                <div className='mt-5 grid lg:grid-cols-3 gap-3 sm:grid-cols-1'>
                    {pantries.length == 0 ? <div className='text-2xl font-semibold'>No Pantries Added...</div> : pantries.map((pantry, index) => (
                        <div className={`border rounded-lg p-5 px-30 w-60 border-black font-semibold`} key={index}>{pantry}</div>
                    ))}
                </div>
            </div>
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)} >
                <DialogContent>
                    <DialogHeader>
                        <CameraComponent camera={camera} image={image} setImage={setImage} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Dashboard