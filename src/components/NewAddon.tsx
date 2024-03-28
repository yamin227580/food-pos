import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewAddon = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClick={() => setOpen(false)}>
      <DialogTitle>New Addon </DialogTitle>
      <DialogContent>
        <h1>New addon form..</h1>
      </DialogContent>
    </Dialog>
  );
};
export default NewAddon;
