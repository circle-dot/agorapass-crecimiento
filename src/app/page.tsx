"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";

export default function Page() {
  const words = ["everyone", "everywhere", "all", "anyone"];

  return (
    <div className="flex items-center justify-center flex-grow ">
      <HeroHighlight className="flex-grow">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          <Card className=" bg-white bg-opacity-90 shadow-lg mt-8 flex flex-col items-center justify-center w-full">
            <CardHeader className="items-center justify-center w-full">
              <Image
                src="/agora.png"
                alt="Logo"
                width={130}
                height={130}
                className="select-none pointer-events-none"
              />
              <CardTitle className="text-center uppercase tracking-[3.5px] text-4xl font-extralight pb-4">
                <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                  Vouch
                  <FlipWords words={words} /> <br />
                  and build  <br />
                  <Highlight className="text-black dark:text-white">
                    Agora City
                  </Highlight>
                </div><sup className="text-xs">Beta</sup>
              </CardTitle>


              <CardDescription className="text-center w-full flex justify-evenly items-center flex-col gap-y-2">
                <Link href='/agora/profiles' className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] ">Start vouching</Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </motion.h1>
      </HeroHighlight>
    </div>
  );
}
