"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-left space-y-6">
      <Eyebrow>TEMPORARY ISSUE</Eyebrow>
      <SectionHeading level="h1" title="Something Paused *Your Visit*" />
      <p className="font-sans text-base sm:text-lg text-sand-primary max-w-xl leading-relaxed">
        An unexpected error occurred while loading this page. Please try refreshing or return to the main workshop catalog.
      </p>
      <div className="pt-2 flex flex-wrap items-center gap-4">
        <Button onClick={() => reset()} size="default">
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary" size="default">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
