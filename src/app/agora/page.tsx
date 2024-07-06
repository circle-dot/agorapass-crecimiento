import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-primarydark" >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <main className="relative z-10 flex items-center justify-center min-h-screen w-full mx-auto p-5 md:max-w-lg md:p-7.5 lg:max-w-2xl lg:p-10">
                <div className="flex flex-col items-center justify-center w-full">
                    <Card className=" bg-white bg-opacity-90 shadow-lg mt-8 flex flex-col items-center justify-center w-full">
                        <CardHeader className="items-center justify-center w-full">
                            <Image
                                src="/agora.png"
                                alt="Logo"
                                width={130}
                                height={130}
                                className="select-none pointer-events-none"
                            />
                            <CardTitle className="text-center uppercase tracking-[3.5px] text-4xl font-extralight pb-4">Agorapass</CardTitle>
                            <CardDescription className="text-center w-full flex justify-evenly items-center flex-col gap-y-2">
                                <Button asChild className="text-xl"><Link href='/agora/profiles'>Start vouching!</Link></Button>
                                <p>Or check something</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}