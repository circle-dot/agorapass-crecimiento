"use client";
import React from "react";
import { IBM_Plex_Sans } from 'next/font/google';
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
                {/* <h1 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black">About CreciStamp</h1> */}
                <div className="max-w-2xl lg:max-w-4xl mx-auto antialiased pt-4 relative">
                    {/* <div>
                        CreciStamp enables community members to vouch for each other and increase their trust score within the Crecimiento community.
                        <br />
                        By vouching for new members, you are inviting them to become part of the ecosystem.
                        <br />
                        Once you get over a certain trust score you will be able to get an CreciStamp (Zupass enabled). This pass will grant you access to the Agora.City forum and other perks.
                    </div> */}

                    <div>
                        <FeaturesSection />
                    </div>
                </div>
            </div>
        </TracingBeam>
    );
}