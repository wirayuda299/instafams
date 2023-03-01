import './globals.css'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import Head from './head'
import { Roboto } from '@next/font/google'
import Providers from '@/util/provider'
import { Navbar } from '@/components/Navbar'

interface Props {
  children: React.ReactNode,
}
const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  preload: true,
  fallback: ['sans-serif'],
  display: 'swap',
  
})
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <Head />
      <body className={`scroll-smooth ${roboto.className}`}>
        <Providers>
          <div className="bg-white dark:bg-black overflow-hidden">
            <div className="flex ">
              <Sidebar />
              <main className="w-full h-screen overflow-y-auto overflow-x-hidden">
                <Header />
                {children}
                <Navbar/>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
