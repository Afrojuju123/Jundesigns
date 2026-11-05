import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brown-950 text-sand-bright">
      {children}
    </div>
  );
}
