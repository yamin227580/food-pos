import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewMenuCategory = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClick={() => setOpen(false)}>
      <DialogTitle>New Menu Category</DialogTitle>
      <DialogContent>
        <h1>New menu category form..</h1>
      </DialogContent>
    </Dialog>
  );
};
export default NewMenuCategory;
