'use client'
import { FC, useState } from "react"
import { NavbarList } from "./Lists";

export const Navbar: FC = () => {
  const [extraListOpen, setExtraListOpen] = useState(false)
  return (
    <nav className="fixed h-14 bottom-0 flex left-0 w-full bg-white z-50 md:hidden">
      <NavbarList
        extraListOpen={extraListOpen}
        setExtraListOpen={setExtraListOpen}
      />
    </nav>
  )
};
