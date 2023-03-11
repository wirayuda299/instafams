'use client'; 

import { useEffect } from 'react';

export default function Error({error,reset}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='w-full h-full grid place-items-center'>
      <h2>Something went wrong!</h2>
      <button
       className='bg-black dark:bg-white text-white dark:text-black rounded-md p-2'
        onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
