import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "MaintLog AI",
  description: "Industrial maintenance logbook"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
