import { Button } from '@/components/ui/button'
import React from 'react'
import { Camera } from 'react-camera-pro'
import { AiOutlineLoading3Quarters } from "react-icons/ai"

function CameraComponent({ camera, image, setImage }) {
    return (
        <div className='flex flex-col gap-3'>
            <Camera ref={camera} aspectRatio={16 / 9} />
            <Button onClick={() => setImage(camera.current.takePhoto())}>
                Take Photo
            </Button>
            <img src={image}/>
        </div>
    )
}

export default CameraComponent