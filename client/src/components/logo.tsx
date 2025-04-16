"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Logo = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[120px] h-[40px] bg-transparent" />
    );
  }

  return (
    <Image
      src={theme === "dark" ? "/assets/white-logo.png" : "/assets/black-logo.png"}
      alt="C.O.B.A Logo"
      width={120}
      height={40}
    />
  );
};