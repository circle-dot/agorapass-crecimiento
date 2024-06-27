import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-primarydark" >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <main className="relative z-10 flex items-center justify-center min-h-screen p-24 w-full mx-auto p-5 md:max-w-lg md:p-7.5 lg:max-w-2xl lg:p-10">
        <div className="flex flex-col items-center justify-center w-full">
          <Card className="w-80 bg-white bg-opacity-90 shadow-lg mt-8 flex flex-col items-center justify-center w-full">
            <CardHeader className="items-center justify-center">
              <Image
                src="/agora.png"
                alt="Logo"
                width={130}
                height={130}
                className="select-none pointer-events-none"
              />
              <CardTitle className="text-center text-3xl font-bold uppercase tracking-[3.5px] text-4xl font-extralight">Agorapass</CardTitle>
              <CardDescription className="text-center text-xl">Coming Soon</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}