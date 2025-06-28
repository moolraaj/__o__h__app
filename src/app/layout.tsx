

import ReduxProvider from "@/provider/ReduxProvider";
import "../styles/globals.scss";
 
import SessionWrapper from "@/provider/Session";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right"/>
        <SessionWrapper>

        <ReduxProvider>{children}</ReduxProvider>

        </SessionWrapper>


      </body>
    </html>
  );
}
