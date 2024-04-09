'use client'

import './globals.css'
import { ProSidebarProvider } from "react-pro-sidebar";
import { ConfigContextProvider } from "@/contexts/config-context";
import AuthContextProvider from '@/contexts/authContext';
import { NAME } from '@/constants';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

      <html lang="en">
        <head>
          <title>{ NAME }</title>
        </head>
        <body className="overflow-x-visible">
        <ConfigContextProvider>
          <AuthContextProvider>
            <ProSidebarProvider>
              {children}
            </ProSidebarProvider>
          </AuthContextProvider>
        </ConfigContextProvider>
        </body>
      </html>

  )
}
