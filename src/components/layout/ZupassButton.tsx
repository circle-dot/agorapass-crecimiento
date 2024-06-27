"use client";
import { useZupass } from "@/components/zupass/zupass";
import { useZupassPopupMessages } from "@pcd/passport-interface";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ZupassButton() {
    const [loading, setLoading] = useState(false);
    const { login } = useZupass();
    const [multiPCDs] = useZupassPopupMessages();

    useEffect(() => {
        if (multiPCDs) {
            console.log("🚀 ~ multiPCDs:", multiPCDs);
        }
    }, [multiPCDs]);

    const loginHandler = async () => {
        setLoading(true);
        await login();
        setLoading(false);
    };

    if (loading) {
        return (
            <p>loading...</p>
        );
    }

    return (
        <Button onClick={loginHandler} className="bg-accentdark hover:bg-accentdarker text-[#19473f] font-semibold font-[Tahoma]">Connect Zupass</Button>
    );
}
