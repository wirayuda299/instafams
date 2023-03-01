import { db } from "@/config/firebase";
import { IUserPostProps } from "@/types/post";
import { getDocs, query, collection, orderBy } from "firebase/firestore";
export const getPosts = async () => {
  try {
    const getPostDesc = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')))
    if (getPostDesc.docs.length > 0) {
      const userPosts: IUserPostProps[] = getPostDesc.docs.map(data => data.data()) as IUserPostProps[]
      return userPosts
    }
    return null

  } catch (error: any) {
    console.log(error.message);
  }
}
