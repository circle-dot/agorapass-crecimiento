"use client";
import React from "react";
import { IBM_Plex_Sans } from 'next/font/google';

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "@/components/ui/tracing-beam";
import FeaturesSection from "@/components/ui/sections/featureSection";
const Plex_Sans = IBM_Plex_Sans({
    weight: '200',
    subsets: ['latin'],
});

export default function TracingBeamDemo() {
    return (
        <TracingBeam className="px-6">
            <div className="p-6 w-full flex-col flex justify-center items-center">
                {/* <h1 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">About Agora City</h1> */}
                <div className="max-w-2xl lg:max-w-4xl mx-auto antialiased pt-4 relative">
                    {/* <div>
                        Agora Pass enables community members to vouch for each other and increase their trust score within the Zuzalu community.
                        <br />
                        By vouching for new members, you are inviting them to become part of the ecosystem.
                        <br />
                        Once you get over a certain trust score you will be able to get an Agora Pass (Zupass enabled). This pass will grant you access to the Agora.City forum and other perks.
                    </div> */}

                    <div>
                        <FeaturesSection />
                    </div>
                </div>
            </div>
        </TracingBeam>
    );
}

const dummyContent = [
    {
        title: "Lorem Ipsum Dolor Sit Amet",
        description: (
            <>
                <p>
                    Sit duis est minim proident non nisi velit non consectetur. Esse
                    adipisicing laboris consectetur enim ipsum reprehenderit eu deserunt
                    Lorem ut aliqua anim do. Duis cupidatat qui irure cupidatat incididunt
                    incididunt enim magna id est qui sunt fugiat. Laboris do duis pariatur
                    fugiat Lorem aute sit ullamco. Qui deserunt non reprehenderit dolore
                    nisi velit exercitation Lorem qui do enim culpa. Aliqua eiusmod in
                    occaecat reprehenderit laborum nostrud fugiat voluptate do Lorem culpa
                    officia sint labore. Tempor consectetur excepteur ut fugiat veniam
                    commodo et labore dolore commodo pariatur.
                </p>
                <p>
                    Dolor minim irure ut Lorem proident. Ipsum do pariatur est ad ad
                    veniam in commodo id reprehenderit adipisicing. Proident duis
                    exercitation ad quis ex cupidatat cupidatat occaecat adipisicing.
                </p>
                <p>
                    Tempor quis dolor veniam quis dolor. Sit reprehenderit eiusmod
                    reprehenderit deserunt amet laborum consequat adipisicing officia qui
                    irure id sint adipisicing. Adipisicing fugiat aliqua nulla nostrud.
                    Amet culpa officia aliquip deserunt veniam deserunt officia
                    adipisicing aliquip proident officia sunt.
                </p>
            </>
        ),
        image:
            "/agora.png",
    },
    {
        title: "Lorem Ipsum Dolor Sit Amet",
        description: (
            <>
                <p>
                    Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
                    deserunt cupidatat aute. Enim cillum dolor et nulla sunt exercitation
                    non voluptate qui aliquip esse tempor. Ullamco ut sunt consectetur
                    sint qui qui do do qui do. Labore laborum culpa magna reprehenderit ea
                    velit id esse adipisicing deserunt amet dolore. Ipsum occaecat veniam
                    commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
                </p>
                <p>
                    In dolore veniam excepteur eu est et sunt velit. Ipsum sint esse
                    veniam fugiat esse qui sint ad sunt reprehenderit do qui proident
                    reprehenderit. Laborum exercitation aliqua reprehenderit ea sint
                    cillum ut mollit.
                </p>
            </>
        ),
        badge: "Changelog",
        image:
            "/agora.png",
    },
    {
        title: "Lorem Ipsum Dolor Sit Amet",
        description: (
            <>
                <p>
                    Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
                    deserunt cupidatat aute. Enim cillum dolor et nulla sunt exercitation
                    non voluptate qui aliquip esse tempor. Ullamco ut sunt consectetur
                    sint qui qui do do qui do. Labore laborum culpa magna reprehenderit ea
                    velit id esse adipisicing deserunt amet dolore. Ipsum occaecat veniam
                    commodo proident aliqua id ad deserunt dolor aliquip duis veniam sunt.
                </p>
            </>
        ),
        badge: "Launch Week",
        image:
            "/agora.png",
    },
];
