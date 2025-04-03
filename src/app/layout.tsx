

import ReduxProvider from "@/provider/ReduxProvider";
import "../styles/globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <ReduxProvider>{children}</ReduxProvider>

      </body>
    </html>
  );
}
