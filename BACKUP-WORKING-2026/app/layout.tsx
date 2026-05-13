import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "BlackBeast RNB",
  description: "Oldschool R&B Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}