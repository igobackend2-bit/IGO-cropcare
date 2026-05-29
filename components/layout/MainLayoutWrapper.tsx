"use client";

import { usePathname } from "next/navigation";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import Footer from "@/components/layout/Footer";
import AgriBot from "@/components/ai/AgriBot";
import WhatsAppWidget from "@/components/common/WhatsAppWidget";
import MobileStickyCart from "@/components/common/MobileStickyCart";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartAddedPopup from "@/components/common/CartAddedPopup";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <EnhancedHeader cartCount={0} />
      {children}
      <Footer />
      <AgriBot />
      <WhatsAppWidget phoneNumber="919876543210" />
      <MobileStickyCart itemCount={0} totalPrice={0} />
      <MobileBottomNav />
      <CartAddedPopup />
    </>
  );
}
