"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle } from 'lucide-react';
import Link from "next/link";
import { motion } from "framer-motion";
import RevokeButton from "../RevokeButton";
import truncateWallet from "@/utils/truncateWallet";
interface Vouch {
    id: string;
    schemaId: string;
    attesterWallet: string;
    recipient: string;
    timeCreated: number;  // UNIX timestamp
    revoked: boolean;
}

interface VouchesListProps {
    vouches: Vouch[];
}

export function VouchesList({ vouches }: VouchesListProps) {

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Your latest vouches</h2>
            <div className="space-y-4">
                {vouches.map((vouch, index) => (
                    <motion.div
                        key={index}
                        className={`p-4 rounded-lg shadow-sm ${vouch.revoked ? 'bg-red-50' : 'bg-gray-50'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
                            <div>
                                <p className="font-semibold">
                                    You vouched for <Link href={`/address/${vouch.recipient}`} className="text-blue-500 hover:underline truncate">{truncateWallet(vouch.recipient)}</Link> on {new Date(vouch.timeCreated * 1000).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div>
                                            <Button variant="outline" className="font-extrabold hidden md:block">...</Button>
                                            <Button variant="outline" className="font-extrabold block md:hidden">Actions</Button>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Button variant="outline" className="p-2 cursor-pointer" asChild>
                                                <Link href={`/vouch/${vouch.id}`}>
                                                    Check vouch
                                                    <CheckCircle className="text-green-500 w-4 h-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {!vouch.revoked && (
                                            <DropdownMenuItem className="p-0">
                                                <RevokeButton UID={vouch.id} />
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
