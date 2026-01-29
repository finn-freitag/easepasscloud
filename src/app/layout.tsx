import { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    let description = "Manage your Ease Pass Cloud instance with ease.";

    return {
        title: "Ease Pass Cloud",
        description: description,
        keywords: ["Ease Pass", "cloud", "password manager", "self-hosted", "manage", "databases", "users", "sessions", "plugin"],
        openGraph: {
            title: "Ease Pass Cloud",
            description: description,
        },
        twitter: {
            title: "Ease Pass Cloud",
            description: description,
        },
        icons: "/favicon.ico",
        alternates: {
          canonical: './'
        },
        themeColor: "#202020",
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
