'use client'
import Link from 'next/link'
import { Oleo_Script } from '@next/font/google'
import { AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai'

const oleo = Oleo_Script({
  subsets: ['latin', 'latin-ext'],
  weight: '400'
})

export const Header = () => {
  return (
    <header className={`w-full flex md:hidden items-center bg-white dark:bg-black dark:text-white px-5 border-b dark:border-b-0 py-2`}>
      <div className='w-full flex justify-between items-center space-x-2'>
        <div className='w-full'>
          <Link href='/' className={`text-xl md:text-2xl ${oleo.className}`}>
            <h1>Instafams</h1>
          </Link>
        </div>
        <div className='bg-gray-100 dark:bg-black dark:border-b rounded-sm'>
          <div className='flex w-full items-center p-1'>
            <button>
              <AiOutlineSearch size={25} />
            </button>
            <input
              className='w-full text-xs px-3 focus:outline-none bg-transparent'
              type="search"
              name="search"
              id=""
              placeholder='search'
            />
          </div>
        </div>
        <button>
          <AiOutlineHeart size={25} />
        </button>
      </div>
    </header>
  )
}