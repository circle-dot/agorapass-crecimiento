import { Inter } from "next/font/google";
import MainNav from "@/components/layout/MainNav";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <>
            <MainNav />
            <div className="flex flex-grow">
                {children}
            </div>
        </>
    );
}
