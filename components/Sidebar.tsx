'use client'
import { useState } from 'react'
import { AiOutlineInstagram } from 'react-icons/ai'
import Link from 'next/link';
import { Oleo_Script } from '@next/font/google'
import { NavbarList } from './NavbarList'

const oleo = Oleo_Script({
  subsets: ['latin', 'latin-ext'],
  weight: '400'
})
export const Sidebar = () => {
  const [extraListOpen, setExtraListOpen] = useState(false)

  return (
    <aside
      className={`hidden md:block md:w-max lg:w-[320px] h-screen border-r dark:border-r-gray-600 transition-all ease duration-500`}>
      <nav className='w-full bg-white dark:bg-black dark:text-white p-3 h-full'>
        <header className='w-full flex flex-col pl-6 md:pl-4 py-5 '>
          <Link href='/' className={`text-3xl font-semibold ${oleo.className}`}>
            <h1 className='hidden lg:block'>Instafams</h1>
            <span className='block lg:hidden'>
              <AiOutlineInstagram size={30} />
            </span>
          </Link>
        </header>
        <NavbarList
          extraListOpen={extraListOpen}
          setExtraListOpen={setExtraListOpen}
        />
      </nav>
    </aside>
  )
}
