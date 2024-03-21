import React from "react";
import { ComboboxDemo } from "./ComboboxDemo";

export const MenuDropdown = ({ hidden }) => {
  const translateClasses = hidden ? "-translate-x-full" : "translate-x-0";

  return (
    <div className='flex '>
      <div hidden={hidden} className='bg-zinc-300 h-screen p-5 pt-8 w-76 transition-transform duration-700 ease-in-out'>
        <h1>filtre</h1>

          <div className="mb-20">
            <ComboboxDemo/>
          </div>
          <div>
            <ComboboxDemo/>
          </div>
      </div>
    </div>
  );
};
