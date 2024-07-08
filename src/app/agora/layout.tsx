import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";

type Props = {
    children?: React.ReactNode;
};
const inter = Inter({ subsets: ["latin"] });

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <div className={inter.className}>{children}</div>
        </>
    );
}
