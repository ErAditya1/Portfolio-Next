import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
