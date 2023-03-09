'use client'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
interface Props {
  children: React.ReactNode
}
export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </SessionProvider>
  )
}