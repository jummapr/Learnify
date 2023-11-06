"use client"

import { SessionProvider } from 'next-auth/react'
import { FC } from 'react'

interface SessionProviderProps {
  children: React.ReactNode
}

const GlobalSessionProvider: FC<SessionProviderProps> = ({children}) => {
  return <SessionProvider>
    {children}
  </SessionProvider>
}

export default GlobalSessionProvider