import CButton from '@/components/shared/CButton';
import DialogWrapper from '@/components/shared/DialogWrapper';
import React from 'react'

type ModalProps = {
    isOpen: boolean;
    status: string;
    setIsOpen:(data?:any)=>void;
    onSubmit:(data?:any)=>void;
}
export default function ConfirmStatusModal({isOpen, status, setIsOpen, onSubmit}:ModalProps) {

    const handleCloseDialog = ()=> {
        setIsOpen(false);
    }

    return (
        <DialogWrapper
        open={isOpen}
        handleClose={handleCloseDialog}
        >
        <div>
            
            {status==='SUCCESS' ? 
            `Confirmez vous que le paiement a réussi ?`
            :
            status==='FAILED' ? 
            `Confirmez vous que le paiement a échoué ? Si oui le client sera remboursé.`
            :''}

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
            btnStyle={status==='SUCCESS'?"green":status==='FAILED' ?"red":"dark"}
            onClick={()=>onSubmit()}
            width={'100%'}
            height={"35px"}
            />
            </div>
        </div>
        </DialogWrapper>
    )
}
