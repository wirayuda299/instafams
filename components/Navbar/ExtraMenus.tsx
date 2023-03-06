import { extraListToggler } from "@/store/extraListToggler";
import { signOut } from "next-auth/react";
import { FC } from "react"
import { AiOutlineWarning } from "react-icons/ai";
import { BsFillGearFill, BsBookmark, BsFillMoonStarsFill } from "react-icons/bs";
import { RxCountdownTimer } from "react-icons/rx";
import { useRecoilState } from "recoil";

interface INavProps {
  id: number
  title: string
  path: string
  icon: JSX.Element | string,
}
const extraList: INavProps[] = [
  {
    id: 1,
    icon: <BsFillGearFill className='text-2xl text-black dark:text-white' />,
    path: '/settings',
    title: 'Settings'
  },
  {
    id: 2,
    icon: <BsBookmark className='text-2xl text-black dark:text-white' />,
    path: '/saved',
    title: 'Saved'
  },
  {
    id: 3,
    icon: <BsFillMoonStarsFill className='text-2xl text-black dark:text-white' />,
    path: '/switch-appearance',
    title: 'Switch Appearance'
  },
  {
    id: 4,
    icon: <RxCountdownTimer className='text-2xl text-black dark:text-white' />,
    path: '/activity',
    title: 'Your Activity'
  },
  {
    id: 5,
    icon: <AiOutlineWarning className='text-2xl text-black dark:text-white' />,
    path: '/report',
    title: 'Report a problem'
  },
  {
    id: 6,
    icon: '',
    path: '/switch-account',
    title: 'Switch Account'
  },
  {
    id: 7,
    icon: '',
    path: '/logout',
    title: 'Log Out'
  }
]

export const ExtraMenus = () => {
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.log(error);
    }
  }
  const [extraListOpen, setExtraListOpen] = useRecoilState(extraListToggler)
  return (
    <div
      className={`flex flex-col justify-center w-full space-y-3 relative  ${extraListOpen ? 'block' : 'hidden'}`}>
      <div
        className={`bg-white rounded-md dark:bg-black dark:bg-opacity-95 dark:text-white py-4 -left-0 -top-[360px] md:bg-opacity-85 w-full sm:w-44 md:w-48 ${extraListOpen ? 'absolute block' : 'hidden'}`}>
        <ul className='w-full px-2'>
          {extraList.map(list => (
            <li
              key={list.id}
              className='py-2 truncate md:py-3 border-b dark:border-b-0'>
              <button onClick={list.title === 'Log Out' ? handleSignOut : undefined}
                className='w-full flex items-center space-x-2 gap-2 justify-between'>
                <span className='font-semibold text-sm md:text-base md:font-medium'>{list.title}</span>
                <span>{list.icon}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 
