import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
import { MdClose } from "react-icons/md";
import { height } from "@mui/system";
import Title from "./Title";

interface StyledDialogProps extends React.ComponentProps<typeof Dialog> {
    sx?: any, //React.SxProps<Theme>;
}

const StyledDialog = styled(Dialog)<StyledDialogProps>(({ theme, sx }) => ({
    "& .MuiPaper-root": {
        borderRadius: "20px",
    },
    "& .MuiDialogContent-root": {
        borderTop: "none",
        borderBottom: "none",
        overflowY: "unset",
    },
    ...sx,
}));


type DialogWrapperProps = {
    open:boolean,
    handleClickOpen?:() => void,
    handleClose:() => void,
    title?:string,
    titleLine2?:string,
    children:React.ReactNode,
    sx?:any,
}
export default function DialogWrapper({
  open,
  handleClickOpen,
  handleClose,
  title,
  titleLine2,
  children,
  sx,
}:DialogWrapperProps) {
//   if (open === undefined || !handleClickOpen || !handleClose) {
//     return (
//       <>
//         <div>Mui Dialog is not configured right</div>
//       </>
//     );
//   }
  return (
    <div style={{zIndex:'9000', background:'red'}}>
      <StyledDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={sx}
        maxWidth={"sm"}
        // fullWidth={true}
      >
        {/* <Box
          sx={{
            // display: "flex",
            background:'blue',
            // alignItems: "center",
            m: 0,
            // padding: "0.5rem",
            border: "none",
            position: "relative",
            // gap: "1rem"
          }}
        > */}
        <div className="ml-5 mt-3 pr-[100px]">
        <Title
          title={title ?? ""}
          titleLine2={titleLine2 ?? ""}
        />
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <MdClose size={24} />
        </IconButton>
          
        {/* </Box> */}
        <DialogContent>{children}</DialogContent>
        {/* <DialogContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</DialogContent> */}
      </StyledDialog>
    </div>
  );
}
