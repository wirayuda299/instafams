'use client'
import { IUser } from "@/app/user/profile/[id]/page";
import { db } from "@/config/firebase";
import { IUserPostProps } from "@/types/post";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
interface IProps {
  username: string;
  uid:string
}

export default function Statistic({ username, uid,}: IProps) {
  const [userPosts, setUserPosts] = useState<IUserPostProps[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(() => {
    onSnapshot(query(collection(db, "posts"),  where("postedById", "==", `${uid}`)), (snapshot) => {
      setUserPosts(snapshot.docs.map((doc) => doc.data() as IUserPostProps))
    })
  }, [db])

  useEffect(() => {
    onSnapshot(query(collection(db, "users"), where("uid", "==", `${uid}`)), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data() as IUser))
    })
  }, [db])
  
  const data = [
    {
      id: 1, 
      title: 'Posts',
      value: userPosts.length
      },
    {
      id: 2, 
      title: 'Followers',
      value: users[0]?.followers.length
      },
    {
      id: 1, 
      title: 'Following',
      value: users[0]?.following.length
      },

  ]  


  return (
    <div>
      <div className='text-black'>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold sm:px-5pb-3">{username}</h1>
          <button className='bg-gray-100 flex-1 rounded-md px-5 py-2 text-sm'>
            Edit profile
          </button>
        </div>
        <ul className={`justify-evenly flex sm:px-5 items-center space-x-3 mt-5`}>
          {
            data.map((item) => (
              <li className="text-sm text-center font-medium mt-2" key={item.id}>
                <div className='flex space-x-2 items-center'>
                  <span className='font-thin'>{item.value}</span>
                  <span>{item.title}</span>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}