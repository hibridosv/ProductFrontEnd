'use client'

import './globals.css'
import { ProSidebarProvider } from "react-pro-sidebar";
import { ConfigContextProvider } from "@/contexts/config-context";
import AuthContextProvider from '@/contexts/authContext';
import { NotificationsPush } from '@/components/alert/nofications-push';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

      <html lang="en">
        <head>
          <title>Sistema de control de ventas</title>
        </head>
        <body className="overflow-x-visible">
        <ConfigContextProvider>
          <AuthContextProvider>
            <ProSidebarProvider>
              {children}
              <NotificationsPush />
            </ProSidebarProvider>
          </AuthContextProvider>
        </ConfigContextProvider>
        </body>
      </html>

  )
}
