'use client';

import Link from "next/link";
import { useSession } from "@/context/SessionContext";

import { useEffect, useState } from "react";

import { Search } from 'lucide-react';
import { Bell } from "lucide-react";
import { Settings } from "lucide-react";


const Header = () => {
    const userData = useSession();
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = () => {
            if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
                setIsAuth(true);
            } else {
                setIsAuth(false);
            };
        };

        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);

        checkAuth();
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="h-20 w-full relative flex flex-row items-center justify-between p-4 bg-background shadow z-10">
            <h1 className="brand-gradient">
                <Link href='/'>
                    Lumo
                </Link>
            </h1>


            {!isSmallScreen ? (
                <nav className="w-full flex flex-row items-center justify-between">
                    <form
                        className="relative flex flex-row items-center mx-auto"
                        action="/">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 pr-12 py-2 border border-gray-300 rounded-full w-96 focus:outline-none focus:ring-2 focus:ring-brand"
                        />

                        <button
                            className="absolute right-0"
                            type="submit">
                            <Search className="icon" />
                        </button>
                    </form>

                    {!isAuth && !userData?.id && (
                        <Link href='/login'>
                            <button className="primary">Login</button>
                        </Link>
                    )}

                    <div className="flex flex-row gap-6 ml-8">
                        {userData?.id && (
                            <Link href='/notifications' aria-label="notifications">
                                <Bell className="icon" />
                            </Link>
                        )}

                        <Link href='/settings' aria-label="Settings">
                            <Settings className="icon" />
                        </Link>
                    </div>
                </nav>
            ) : (
                <nav className="flex flex-row gap-8">
                    <Link href='/explore' aria-label="Explore">
                        <Search className="icon" />
                    </Link>
                    <Link href='/notifications' aria-label="notifications">
                        <Bell className="icon" />
                    </Link>
                    <Link href='/settings' aria-label="Settings">
                        <Settings className="icon" />
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;