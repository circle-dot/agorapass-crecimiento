"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from "@/components/layout/AuthLayout";
import Navbar from "@/components/layout/Navbar";

type Props = {
    children?: React.ReactNode;
};

// !TODO Remove this layout eventually

export default function Layout({ children }: Props) {
    const [isChecked, setIsChecked] = useState(false);
    const [useAuthLayout, setUseAuthLayout] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const env = process.env.NEXT_PUBLIC_NODE_ENV;

        if (env === 'production' || !env) {
            setUseAuthLayout(true);
        } else {
            setUseAuthLayout(false);
        }
        setIsChecked(true);
    }, []);

    if (!isChecked) {
        return null; // Or render a loading indicator
    }

    if (useAuthLayout) {
        return (
            <AuthLayout>
                <main>{children}</main>
            </AuthLayout>
        );
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
