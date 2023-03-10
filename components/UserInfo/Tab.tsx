'use client'
import { tabPosts, tabSavedPosts, tabTaggedPosts } from "@/store/TabToggler";
import { useState } from "react";
import { BsGrid3X3Gap, BsBookmark, BsPersonSquare } from "react-icons/bs";
import { useRecoilState } from "recoil";

export default function Tab() {
    const [posts, setPosts] = useRecoilState(tabPosts)
    const [savedPosts, setSavedPosts] = useRecoilState(tabSavedPosts)
    const [taggedPosts, setTaggedPosts] = useRecoilState(tabTaggedPosts)
    const [activeTab, setActiveTab] = useState(1);

    const tabValue = [
        {
            id: 1,
            icon: <BsGrid3X3Gap size={25} />
        },
        {
            id: 2,
            icon: <BsBookmark size={25} />
        },
        {
            id: 3,
            icon: <BsPersonSquare size={25} />
        },
    ]
    const handleTabClick = (tabId: number) => {
        setActiveTab(tabId)
        if (tabId === 1) {
            setPosts(true)
            setSavedPosts(false)
            setTaggedPosts(false)
        } else if (tabId === 2) {
            setPosts(false)
            setSavedPosts(true)
            setTaggedPosts(false)
        } else if (tabId === 3) {
            setPosts(false)
            setSavedPosts(false)
            setTaggedPosts(true)
        }
    }

    return (
        <div className='mx-auto max-w-2xl border-b-2'>
            <div className='flex justify-around py-3 items-center w-full gap-x-5 pb-5'>
                {tabValue.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${activeTab === tab.id ? 'border-b-2 border-black pb-1' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        <span>
                            {tab.icon}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}