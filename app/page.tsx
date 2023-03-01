import Userposts from '@/components/card/UserPosts'
import Suggestions from '@/components/Suggestion'

export default async function Home() {
  return (
    <section className='w-full h-full md:p-3 max-w-7xl'>
      <div className='w-full flex justify-between items-start first:flex-grow'>
        <div className="w-full h-full flex flex-col p-5">
          <Userposts />
        </div>
        <section className='min-w-[400px] hidden lg:block'>
          <Suggestions />
        </section>
      </div>
    </section>
  )
}
