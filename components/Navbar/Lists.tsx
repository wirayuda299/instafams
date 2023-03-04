import { useSession } from "next-auth/react";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react"
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart, AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { ExtraMenus } from "./ExtraMenus";
import Image from "next/image";
import { ExtraMenuBtn } from "../Card/Post/ExtraMenuBtn";

interface IProps {
  extraListOpen: boolean
  setExtraListOpen: Dispatch<SetStateAction<boolean>>
}
interface INavProps {
  id: number
  title: string
  path: string
  icon: JSX.Element | string,
}

export const NavbarList: FC<IProps> = () => {
  const { data: session } = useSession()

  const navList: INavProps[] = [
    {
      id: 1,
      title: 'Home',
      path: '/',
      icon: <AiOutlineHome size={30} className='text-black dark:text-white' />
    },
    {
      id: 2,
      title: 'Search',
      path: '/search',
      icon: <AiOutlineSearch size={30} className='text-black dark:text-white' />
    },
    {
      id: 3,
      title: 'Explore',
      path: '/explore',
      icon: <MdOutlineExplore size={30} className='text-black dark:text-white' />
    },
    {
      id: 4,
      title: 'Messages',
      path: '/messages',
      icon: <RiMessengerLine size={30} className='text-black dark:text-white' />
    },
    {
      id: 5,
      title: 'Notifications',
      path: '/notifications',
      icon: <AiOutlineHeart size={30} className='text-black dark:text-white' />
    },
    {
      id: 6,
      title: 'Create',
      path: '/create',
      icon: <AiOutlinePlusSquare size={30} className='text-black dark:text-white' />
    },
    {
      id: 7,
      title: 'Profile',
      path: '/profile',
      icon: <Image
        className='w-7 h-7 rounded-full'
        src={session?.user?.image || ''}
        width={30}
        height={30}
        alt={session?.user?.name || 'user profile'}
      />
    },
  ]
  return (
    <ul className='flex w-full dark:bg-black justify-center items-center sm:items-start flex-row md:flex-col px-1 transition-all ease duration-500'>
      {navList.map(list => (
        <li
          key={list.id}
          className={`font-light px-3 py-4 text-base hover:bg-gray-200  transition-all ease duration-300 rounded-full w-full dark:hover:bg-[#b9b9b917] hover:bg-[#a8a8a817] ${list.id === 2 || list.id === 4 ? 'hidden md:block' : ''}`}>
          <Link

            href={list.path}
            hrefLang='en'>
            <button className={`flex space-x-2 `} name={list.title}>
              {list.icon}
              <span className='hidden lg:block'>{list.title}</span>
            </button>
          </Link>
        </li>
      ))}
      <ExtraMenus />
      <ExtraMenuBtn />
    </ul>
  )
};
