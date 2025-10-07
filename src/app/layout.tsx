import { CustomToaster } from "@/components/custom-toaster";
import { ThemeProvider } from "@/components/theme-proovider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100","200","300","400","500", "600", "700","800", "900"],
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "Purwokerto Dev",
  description: "Community for developer in Purwokerto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable}  antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <CustomToaster />
      </body>
    </html>
  );
}
