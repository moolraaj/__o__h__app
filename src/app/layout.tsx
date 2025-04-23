

import ReduxProvider from "@/provider/ReduxProvider";
import "../styles/globals.scss";
 
import SessionWrapper from "@/provider/Session";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>

        <ReduxProvider>{children}</ReduxProvider>

        </SessionWrapper>


      </body>
    </html>
  );
}
