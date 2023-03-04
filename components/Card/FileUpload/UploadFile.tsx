'use client'
import { ChangeEvent, FC } from "react"

interface IProps {
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | undefined>>
  img: string | undefined
}

export const ImageInput: FC<IProps> = ({ setPreviewUrl, img }) => {

  const handleInputImage = async (e: ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target) {
        return setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  }
  return (
    <div className={` items-center justify-center w-full ${img === '' ? 'flex' : 'hidden'}`}>
      <div className="max-w-xl w-full flex justify-center mx-auto">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 rounded-lg cursor-pointer  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
              </path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">
                Click to upload
              </span>
              or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (Max size 1mb) </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="video/*,image/*, .png, .jpg, .jpeg, .gif, .mp4, .mov, .webm"
            required
            className="hidden "
            onChange={async e => await handleInputImage(e)} />
        </label>
      </div>

    </div>
  )
}