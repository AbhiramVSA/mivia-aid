import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Offline Accident-Onset Timestamp Estimation on MIVIA-AID",
  description:
    "A two-stage pipeline for offline accident-onset timestamp estimation combining a pretrained VideoMAE clip encoder with a dilated temporal convolution head. Validation F1 0.7756 under the MIVIA-AID protocol.",
  authors: [{ name: "Abhiram Venkat Sai Adabala" }, { name: "Sibi Chakkaravarthy S" }],
  openGraph: {
    title: "Offline Accident-Onset Timestamp Estimation on MIVIA-AID",
    description:
      "VideoMAE + dilated temporal convolutions for offline accident-onset timestamp estimation. Precision 0.6643, recall 0.9324, F1 0.7756.",
    type: "article",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
