import { Inter } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
import MainNav from "@/components/layout/MainNav";
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
            {/* <Navbar /> */}
            <MainNav></MainNav>
            <div className={inter.className}>{children}</div>
        </>
    );
}
