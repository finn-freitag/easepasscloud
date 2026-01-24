import { Metadata } from "next";
import "./globals.css";
import { getServerConfig } from "@/backend/helper/ServerConfigHelper";

export async function generateMetadata(): Promise<Metadata> {
    let serverConfig = await getServerConfig();

    let description = "Manage your" + (serverConfig.publicInstance ? " public" : "") + " Ease Pass Cloud instance with ease.";

    return {
        title: "Ease Pass Cloud",
        description: description,
        keywords: ["Ease Pass", "cloud", "password manager", "self-hosted", "manage", "databases", "users", "sessions", "plugin"],
        openGraph: {
            url: serverConfig.serverAddress,
            title: "Ease Pass Cloud",
            description: description,
        },
        twitter: {
            title: "Ease Pass Cloud",
            description: description,
        },
        icons: serverConfig.serverAddress + "/favicon.ico",
        alternates: {
          canonical: './'
        },
        themeColor: "#202020",
        robots: serverConfig.publicInstance ? "index, follow" : "noindex, nofollow",
    };
}

export default function RootLayout({
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
