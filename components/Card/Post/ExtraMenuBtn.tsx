import { extraListToggler } from "@/store/extraListToggler";
import { FC } from "react"
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRecoilState } from "recoil";

interface IProps { }

export const ExtraMenuBtn: FC<IProps> = (props) => {
  const [extraListOpen, setExtraListOpen] = useRecoilState(extraListToggler)
  return (
    <button className="hidden md:block mt-10 lg:mt-8">
      <div
        className='flex items-center space-x-2 mx-3 mt-auto py-4 text-base sm:text-lg  transition-all ease duration-300'
        onClick={() => setExtraListOpen(!extraListOpen)}>
        {extraListOpen ? (
          <AiOutlineClose className='text-xl md:text-2xl' size={30} />
        ) : (
          <RxHamburgerMenu className='text-xl md:text-2xl' size={30} />
        )}
        <span className=' hidden lg:block'>More</span>
      </div>
    </button>
  )
};
