import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AddRoomModal from "@/modals/addRoom";
import UseWallet from "@/utils/use_wallet";
import MakeReservationModal from "@/modals/makeReservation";
import MakePaymentModal from "@/modals/makePayment";
import DeleteReservationModal from "@/modals/deleteReservation";
import ChangeRoomStatusModal from "@/modals/changeRoomStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomReservations",
  description: "A Polygon Solidity smart contract dapp for room reservations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} style={{backgroundColor: "#000000"}}>
        {children}
        {/* Bootstrap */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
      
      {/* Modals */}
      <AddRoomModal />
      <MakeReservationModal />
      <MakePaymentModal />
      <DeleteReservationModal />
      <ChangeRoomStatusModal />

      {/* Backgrounds */}
      <UseWallet />
      </body>
    </html>
  );
}
