import CButton from '@/components/shared/CButton';
import DialogWrapper from '@/components/shared/DialogWrapper';
import Image from 'next/image';
import React from 'react'

type ModalProps = {
    isOpen: boolean;
    image: string;
    setIsOpen:(data?:any)=>void;
    // onSubmit:(data?:any)=>void;
}
export default function DisplayImageModal({isOpen, image, setIsOpen}:ModalProps) {

    const handleCloseDialog = ()=> {
        setIsOpen(false);
    }

    return (
        <DialogWrapper
        open={isOpen}
        handleClose={handleCloseDialog}
        >
        {/* <CButton 
        text={`Annuler`} 
        btnStyle={"outlineDark"}
        onClick={()=>{handleCloseDialog()}}
        width={'100%'}
        height={"35px"}
        /> */}
         <div className="mt-3" style={{width: 550, height: 1000, borderRadius:'20px', position: 'relative', overflow:'hidden'}}>
            <Image
                alt='vector background'
                src={image}
                layout='fill'
                objectFit='cover'
            />
        </div>
        </DialogWrapper>
    )
}
