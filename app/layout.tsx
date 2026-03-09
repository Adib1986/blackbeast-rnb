import "./globals.css";
import Providers from "@/components/providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}