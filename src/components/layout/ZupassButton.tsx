"use client";
import { useZupass } from "@/components/zupass/zupass";
import { useZupassPopupMessages } from "@pcd/passport-interface";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function ZupassButton() {

    const [loading, setLoading] = useState(false);
    const { login } = useZupass();
    const [multiPCDs] = useZupassPopupMessages();


    useEffect(() => {
        if (multiPCDs) {
            console.log("🚀 ~ multiPCDs:", multiPCDs);
        }
    }, [multiPCDs]);

    const { getAccessToken, user } = usePrivy();
    const { wallets } = useWallets();
    const loginHandler = async () => {
        setLoading(true);
        const token = await getAccessToken();
        await login(user, wallets, token);
        setLoading(false);
    };

    if (loading) {
        return (
            <p>loading...</p>
        );
    }

    return (
        // <Button onClick={loginHandler} className="bg-accentdark hover:bg-accentdarker text-[#19473f] font-semibold font-[Tahoma]">Connect Zupass</Button>
        <Button onClick={loginHandler} className="bg-accentdark hover:bg-accentdarker text-[#19473f] font-semibold font-[Tahoma]">Connect Zupass</Button>
    );
}
