'use client'

import './globals.css'
import { ProSidebarProvider } from "react-pro-sidebar";
import {Header, SideBar} from "@/components";
import { ConfigContextProvider } from "@/contexts/config-context";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConfigContextProvider>
      <ProSidebarProvider>
      <html lang="en">
        <head>
          <title>Sistema de control de ventas</title>
        </head>
        <body className="overflow-x-visible">
            <div className="mx-auto px-1 my-auto ">
            <Header />
            <div>
              <div>
              <SideBar />
              </div>
              <div className="w-full h-full">
                {children}
              </div>
            </div>  
          </div>
        </body>
      </html>
    </ProSidebarProvider>
  </ConfigContextProvider>

  )
}
