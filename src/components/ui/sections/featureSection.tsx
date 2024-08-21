import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Youtube } from 'lucide-react';

import Link from "next/link";

export default function FeaturesSection() {
    const features = [
        {
            title: "CreciScore",
            description:
                "CreciScore enables community members to vouch for each other and increase their trust score within the Crecimiento community. By vouching for new members, you are inviting them to become part of the ecosystem. Once you get over a certain trust score you will be able to get an CreciScore Zupass enabled.This pass will grant you access to the Agora.City forum and other perks.",
            skeleton: < SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r ",
        },
        {
            title: "Be part of a global community",
            description:
                "Join the conversation to to decrease the dependency on trust in centralized authorities in our community, and to collaboratively work on tools, concepts and a potential game plan for the future of Crecimiento..",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 ",
        },
        {
            title: "Understand Zupass",
            description:
                "Watch the Lighting Talk by Richard Liu on YouTube and learn all about it",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r  ",
        },
        {
            title: "Connect all around the world",
            description:
                "Connect with other members of the Crecimiento community and build meaningful connections",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none",
        },
    ];
    return (
        <div className="relative z-20 pb-10  max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black ">
                    About CreciScore
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal ">
                    Join the solution to decentralize invitations into communities, such as Crecimiento and decrease the dependency on trust in centralized authorities in our community.
                </p>
            </div>

            <div className="relative ">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className=" h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black text-xl md:text-2xl md:leading-snug font-semibold">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal ",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full  p-5  mx-auto bg-white  shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                    {/* TODO */}
                    <Image
                        src="/feature-1.webp"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white via-white  to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <Link
            href="https://youtu.be/m11Wx5jiexE?si=9X1OFOpIqRnsCA5I"
            target="__blank"
            className="relative flex gap-10  h-full group/image"
        >
            <div className="w-full  mx-auto bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
                    {/* TODO */}
                    <Youtube className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
                    <Image
                        src="/youtube-thumbnail.jpg"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
                    />
                </div>
            </div>
        </Link>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "/feature-3.webp",
        "/feature-2.webp",
        "/feature-1.webp",
        "/feature-4.webp",
    ];

    const reorderedImages = [
        ...images.slice(-1),
        ...images.slice(0, -1),
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };

    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            {/* First set of images */}
            <div className="flex flex-row -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="Crecimiento images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Second set of images */}
            <div className="flex flex-row">
                {reorderedImages.map((image, idx) => (
                    <motion.div
                        key={"images-second" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        variants={imageVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="Crecimiento images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white to-transparent h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white to-transparent h-full pointer-events-none" />
        </div>
    );
};


export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // longitude latitude
                { location: [42.4247, 18.7712], size: 0.1 }, //Kotor, montenegro
                { location: [41.0082, 28.9784], size: 0.1 }, //Istanbul, Turkey
                { location: [16.3727, -86.4617], size: 0.1 }, //Pristine Bay, Bay Islands, Honduras
                { location: [32.1574, -82.9071], size: 0.1 }, //Georgia
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};
