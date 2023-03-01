'use client'
import { useState } from "react";
import { db, storage } from "@/config/firebase";
import { arrayUnion, doc, updateDoc, setDoc } from "firebase/firestore";
import { ImageInput } from "@/components/UploadFile";
import { Cropper, getCroppedImg } from "react-cropper-custom";
import "react-cropper-custom/dist/index.css";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";


export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const CreatePost = () => {
  const [captions, setCaptions] = useState('')
  const [img, setImg] = useState<string | undefined>('');
  const [croppedImg, setCroppedImg] = useState<string | null>('');
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  async function onCropComplete(croppedArea: Area) {
    if (!img) return;
    try {
      const canvasSize = {
        width: 1200,
        height: 1200 * aspect
      };
      const image = await getCroppedImg(img, croppedArea, canvasSize);
      setCroppedImg(image);
      return
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const handlePost = async () => {
    if (!session) router.push('/auth/signin')
    if (!img) return
    setLoading(true)
    const hashtags = captions.match(/#(?!\n)(.+)/g)?.join(' ').split(' ') || [];
    const randomNum = Math.floor(Math.random() * 7654391);
    const userRef = doc(db, 'users', `${session?.user?.uid || ''}`);
    const uuid = crypto.randomUUID()

    try {
      const imageRef = ref(storage, `post/${uuid}/image`)
      await uploadString(imageRef, croppedImg ?? '', 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imageRef)
        const setPosts = setDoc(doc(db, 'posts', `post-${uuid}`), {
          captions: captions.match(/^[^#]*/),
          postedById: session?.user?.uid,
          likes: 0,
          author: session?.user && session?.user.username,
          comments: [],
          image: downloadUrl,
          postedByPhotoUrl: session?.user?.image,
          likedBy: [],
          docId: `post-${randomNum}`,
          createdAt: Date.now(),
          hashtags,
          tags: [],
          postId: uuid
        })
        const addPostToUserPostlist = updateDoc(userRef, {
          posts: arrayUnion({
            captions: captions.match(/^[^#]*/),
            postedById: session?.user?.uid,
            likes: 0,
            comments: [],
            image: downloadUrl,
            postedByPhotoUrl: session?.user && session?.user.image,
            likedBy: [],
            docId: `post-${randomNum}`,
            createdAt: Date.now(),
            hashtags,
            tags: [],
            postId: uuid
          })
        })
        await Promise.all([setPosts, addPostToUserPostlist]).then(() => {
          setCroppedImg('')
          setCaptions('')
          setImg('')
          setLoading(false)
        })
      })
    } catch (error: any) {
      setLoading(false)
      console.error(error.message);
    }
  };
  const deleteImage = (e: any) => {
    e.preventDefault()
    setCroppedImg('')
    setImg('')
  }
  return (
    <section className="w-full h-full bg-white dark:bg-[#121212] overflow-y-auto">
      <div className={`container mx-auto gap-5 grid grid-cols-1 ${!croppedImg ? '' : 'md:grid-cols-2'} p-5`}>
        <ImageInput setPreviewUrl={setImg} img={img} />
        <div className={`w-full h-full ${img !== '' ? 'block' : 'hidden'} relative`}>
          <div className='wrapper max-w-lg relative flex justify-center items-center border rounded-sm'>
            <Cropper
              src={img || ''}
              zoom={zoom}
              aspect={aspect}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button className="absolute -top-3 -right-3 text-white" onClick={(e) => deleteImage(e)}>
              <AiOutlineClose size={25} />
            </button>
          </div>
        </div>
        <div className={`w-full rounded-md max-h-[800px] shadow-lg dark:border-gray-500 p-2 bg-white dark:bg-black ${!croppedImg ? 'hidden' : 'block'}`}>
          <div className="flex items-center w-full space-x-2 border-b p-2">
            <Image
              className="rounded-full p-3"
              src={session?.user?.image || ''}
              alt=""
              width={60}
              height={60} />
            <p className="text-sm md:text-lg font-semibold dark:text-white">{session?.user?.username}</p>
          </div>
          <div className="w-full p-3">
            <textarea
              className="resize-none dark:bg-transparent dark:text-white focus:outline-none w-full"
              value={captions}
              placeholder="Your caption"
              name="caption"
              onChange={e => setCaptions(e.target.value)}
              cols={60}
              rows={10}>
            </textarea>
            <button
              disabled={loading}
              onClick={handlePost}
              className="w-full h-16 bg-black bg-opacity-90 hover:bg-opacity-100 transition-all ease duration-300 text-white rounded-md text-lg uppercase font-semibold dark:bg-white dark:bg-opacity-50 dark:text-black">
              {loading ? (
                <div className="w-full flex justify-center space-x-3 items-center">
                  <div className="w-6 h-6 border-t-2 border rounded-full animate-spin"></div>
                  <span>Loading... </span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreatePost
