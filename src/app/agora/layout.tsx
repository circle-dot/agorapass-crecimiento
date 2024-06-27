import { Inter } from "next/font/google";

type Props = {
    children?: React.ReactNode;
};
const inter = Inter({ subsets: ["latin"] });

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<div className={inter.className}>{children}</div>);
}
