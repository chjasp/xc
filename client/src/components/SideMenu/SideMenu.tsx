import "./SideMenu.css";
import React from "react";
import { RiFolderUploadFill } from "react-icons/ri";

interface SideMenuProps {
  buttons: string;
  setOpenModal: (input: boolean) => void
}

/*
Menu for opening modals
*/
const SideMenu: React.FC<SideMenuProps> = ({ buttons, setOpenModal }) => {
  return (
    <div onClick={() => setOpenModal(true)} className="upload-btn">
      <RiFolderUploadFill className="upload-icon"/> {buttons === "report" ? <>Upload Report</> : <>Upload Result</>}  
    </div>
  );
};

export default SideMenu;
