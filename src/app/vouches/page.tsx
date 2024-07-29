"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAttestationsReduced } from "@/lib/fetchers/attestations";
import { Attestation } from '@/types/attestations';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import blockies from 'ethereum-blockies';
import Loader from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const truncateAddress = (address: string, length: number) => {
    if (address.length <= length) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
};

const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement>,
    callback: Function
) => {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, callback]);
};

const getAvatar = (wallet: string, avatarType: 'metamask' | 'blockies'): JSX.Element | string | null => {
    if (avatarType === 'metamask') {
        return <MetaMaskAvatar address={wallet} size={100} className='!w-full !h-full' />;
    }
    if (avatarType === 'blockies') {
        const icon = blockies.create({ seed: wallet, size: 8, scale: 4 });
        return icon.toDataURL();
    }
    return null;
};

const Attestations: React.FC = () => {
    const { ref, inView } = useInView({ threshold: 0.5 });
    const [activeCard, setActiveCard] = useState<typeof cards[number] | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['attestations'],
        queryFn: ({ pageParam = 0 }) => fetchAttestationsReduced(pageParam, 10),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) return undefined;
            return pages.length;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActiveCard(null);
            }
        }

        if (activeCard) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeCard]);

    useOutsideClick(cardRef, () => setActiveCard(null));

    if (isLoading) return <div className="flex items-center justify-center w-screen"><Loader /></div>;
    if (isError) return <p>Error loading data...</p>;

    const cards = data?.pages.flatMap(page =>
        page.map((attestation: Attestation) => ({
            title: truncateAddress(attestation.id, 20),
            description: (
                <>
                    <Link href={`/address/${attestation.attester}`} className="text-blue-600 hover:underline">
                        {attestation.attester}
                    </Link>
                    {" vouched for "}
                    <Link href={`/address/${attestation.recipient}`} className="text-blue-600 hover:underline">
                        {attestation.recipient}
                    </Link>
                    {" on "}{new Date(attestation.timeCreated * 1000).toLocaleString()}
                </>
            ),
            src: getAvatar(attestation.id, 'blockies') as string,
            ctaText: "View",
            ctaLink: `/vouch/${attestation.id}`
        }))
    ) || [];

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex w-screen justify-center items-center">
            <div className="overflow-x-auto md:w-3/4 mx-auto">
                <ul className="max-w-2xl mx-auto w-full gap-4">
                    {cards.map((card, index) => (
                        <motion.div
                            layoutId={`card-${card.title}-${id}`}
                            key={`card-${card.title}-${id}`}
                            onClick={() => setActiveCard(card)}
                            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                        >
                            <div className="flex gap-4 flex-col md:flex-row">
                                <motion.div layoutId={`image-${card.title}-${id}`}>
                                    <Avatar className="w-12 h-12 mx-auto mb-4">
                                        {typeof card.src === 'string' ? (
                                            <AvatarImage src={card.src} alt="Avatar Image" />
                                        ) : (
                                            <div></div>
                                        )}
                                        {/* <AvatarFallback className="flex items-center justify-center">{email?.charAt(0)}</AvatarFallback> */}
                                    </Avatar>
                                </motion.div>
                                <div className="">
                                    <motion.h3
                                        layoutId={`title-${card.title}-${id}`}
                                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                    >
                                        {card.title}
                                    </motion.h3>
                                    {/* <motion.p
                                        layoutId={`description-${card.description}-${id}`}
                                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                                    >
                                        {card.description}
                                    </motion.p> */}
                                </div>
                            </div>
                            <motion.button
                                layoutId={`button-${card.title}-${id}`}
                                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                            >
                                {card.ctaText}
                            </motion.button>
                        </motion.div>
                    ))}
                </ul>
                <div ref={ref}>
                    {isFetchingNextPage && <p>Loading more...</p>}
                </div>
            </div>

            <AnimatePresence>
                {activeCard && (
                    <>

                        <div className="fixed inset-0  grid place-items-center z-[100]">
                            <motion.div
                                layoutId={`card-${activeCard.title}-${id}`}
                                className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                                ref={cardRef}
                            >
                                <motion.div layoutId={`image-${activeCard.title}-${id}`}>
                                    <Image
                                        priority
                                        width={200}
                                        height={200}
                                        src={activeCard.src}
                                        alt={activeCard.title}
                                        className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                    />
                                </motion.div>
                                <div>
                                    <div className="flex justify-between items-start p-4">
                                        <div>
                                            <motion.h3
                                                layoutId={`title-${activeCard.title}-${id}`}
                                                className="font-bold text-neutral-700 dark:text-neutral-200"
                                            >
                                                {activeCard.title}
                                            </motion.h3>
                                            <motion.p
                                                layoutId={`description-${activeCard.description}-${id}`}
                                                className="text-neutral-600 dark:text-neutral-400"
                                            >
                                                {activeCard.description}
                                            </motion.p>
                                        </div>
                                        <motion.a
                                            layoutId={`button-${activeCard.title}-${id}`}
                                            href={activeCard.ctaLink}
                                            target="_blank"
                                            className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                        >
                                            {activeCard.ctaText}
                                        </motion.a>
                                    </div>
                                    <div className="pt-4 relative px-4">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                        >
                                            {/* Add any additional content here if needed */}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Attestations;
