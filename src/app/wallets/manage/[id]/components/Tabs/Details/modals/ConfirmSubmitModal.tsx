import CButton from '@/components/shared/CButton';
import DialogWrapper from '@/components/shared/DialogWrapper';
import React from 'react'

type ModalProps = {
    isOpen: boolean;
    setIsOpen:(data?:any)=>void;
    onSubmit:(data?:any)=>void;
}
export default function ConfirmSubmitModal({isOpen, setIsOpen, onSubmit}:ModalProps) {

    const handleCloseDialog = ()=> {
        setIsOpen(false);
    }

    return (
        <DialogWrapper
        open={isOpen}
        handleClose={handleCloseDialog}
        >
        <div>
            {`Confirmez vous la modification des informations de cet utilisateur ?`}
            <div className="flex gap-5 mt-3">
            <CButton 
            text={`Annuler`} 
            btnStyle={"outlineDark"}
            onClick={()=>{handleCloseDialog()}}
            width={'100%'}
            height={"35px"}
            />
            <CButton 
            text={`Oui, je confirme`} 
            btnStyle={"green"}
            onClick={()=>onSubmit()}
            width={'100%'}
            height={"35px"}
            />
            </div>
        </div>
        </DialogWrapper>
    )
}
