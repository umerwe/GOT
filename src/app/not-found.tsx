import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
            {/* 404 Number */}
            <h1 className="text-8xl font-bold text-solid drop-shadow-md">404</h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg text-muted-foreground">
                Oops! The page you’re looking for doesn’t exist.
            </p>

            {/* Back button */}
            <Link
                href="/"
                className="mt-6 flex items-center gap-2 rounded-lg bg-solid px-6 py-3 text-lg font-medium text-black shadow-md transition-colors hover:bg-hover dark:text-white"
            >
                <ArrowBigLeft /> Go Back Home
            </Link>
        </div>
    );
}
