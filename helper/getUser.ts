import { db } from "@/config/firebase"
import { getDocs, query, collection, where } from "firebase/firestore"

export async function getUser(uid:string ='') {
  try {
    const getUsers = await getDocs(query(collection(db, 'users'),where('uid', '!=', uid)))
    const users = getUsers.docs.map(doc => doc.data())
    return users
  } catch (error: any) {
    console.log(error.message);   
  } 
}