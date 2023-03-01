'use client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import { ReactQueryDevtools } from 'react-query/devtools'
interface Props {
  children: React.ReactNode
}
export default function Providers({ children}: Props) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          {children}
        </RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </QueryClientProvider>
    </SessionProvider>
  )
}