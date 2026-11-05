"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { BookingDrawer } from "@/components/organisms/BookingDrawer";

interface BookingDrawerContextType {
  isOpen: boolean;
  selectedWorkshop: string;
  openBooking: (slug?: string) => void;
  closeBooking: () => void;
}

const BookingDrawerContext = createContext<BookingDrawerContextType | undefined>(undefined);

export const BookingDrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("imigongo-painting");

  const openBooking = useCallback((slug?: string) => {
    if (slug) {
      setSelectedWorkshop(slug);
    }
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BookingDrawerContext.Provider
      value={{
        isOpen,
        selectedWorkshop,
        openBooking,
        closeBooking,
      }}
    >
      {children}
      <BookingDrawer
        isOpen={isOpen}
        onClose={closeBooking}
        initialWorkshopSlug={selectedWorkshop}
      />
    </BookingDrawerContext.Provider>
  );
};

export function useBookingDrawer(): BookingDrawerContextType {
  const context = useContext(BookingDrawerContext);
  if (!context) {
    throw new Error("useBookingDrawer must be used within a BookingDrawerProvider");
  }
  return context;
}
