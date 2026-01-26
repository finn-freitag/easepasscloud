import { Metadata } from "next";
import "./globals.css";
import { getServerConfig } from "@/backend/helper/ServerConfigHelper";
import styles from "@/app/layout.module.scss";

export async function generateMetadata(): Promise<Metadata> {
    let serverConfig = null;
    try {
        serverConfig = await getServerConfig();
    } catch {
        serverConfig = {
            serverAddress: "",
            publicInstance: false,
        };
    }

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let serverConfig = null;
    try {
        serverConfig = await getServerConfig();
    } catch {}
    return (
        <html lang="en">
            <body>
                <div className={styles.acrylicContainer}>
                    <div className={`${styles.ball} ${styles.ball1}`}></div>
                    <div className={`${styles.ball} ${styles.ball2}`}></div>
                    <div className={`${styles.ball} ${styles.ball3}`}></div>
                </div>

                <div className={styles.content}>
                    <div className={styles.innerContent}>
                        {children}
                    </div>
                </div>

                <div className={styles.footer}>
                    {serverConfig && serverConfig.linkToImprint && (
                        <a href={serverConfig.linkToImprint} target="_blank" rel="noopener noreferrer">Imprint</a>
                    )}
                    {serverConfig && serverConfig.linkToPrivacyPolicy && (
                        <a href={serverConfig.linkToPrivacyPolicy} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    )}
                </div>
            </body>
        </html>
    );
}
