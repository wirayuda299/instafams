import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { IUserPostProps } from '@/types/post';
import { getPosts } from './getPosts';

export async function handleLikes(
	post: IUserPostProps,
	setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
	uid: string = '',
) {
	setDisabled(true);
	try {
		const postRef = doc(db, 'posts', `post-${post.postId}`);
		const updateLikes = post.likedBy.includes(uid)
			? { likedBy: arrayRemove(uid) }
			: { likedBy: arrayUnion(uid) };
		await updateDoc(postRef, updateLikes)
	} catch (error: any) {
		console.error(error.message);
	} finally {
		setDisabled(false);
	}
}
