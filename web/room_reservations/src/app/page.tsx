'use client';

import ContractTab from "@/tabs/contract";
import styles from "./page.module.css";
import RoomsTab from "@/tabs/rooms";
import ReservationsTab from "@/tabs/reservations";
import PaymentsTab from "@/tabs/payments";
import { useEffect, useState } from "react";
import server from "@/api/server";
import PropertiesTab from "@/tabs/properties";

export default function Home() {
  const [properties, setProperties] = useState();
  const [rooms, setRooms] = useState();
  const [reservations, setReservations] = useState();
  const [payments, setPayments] = useState();

  const fetchProperties = () => {
    fetch(server + "db/properties", { method: "GET" }).then(async (value) => {
      const json = await value.json();
      if (json.result === 1 || json.result === 2) {
        throw Error("No fetching at this moment");
      }

      setProperties(json.result)
    }).catch((error) => {
      console.log("Failed to fetch room");
      console.log(error);
    });

  };

  const fetchRooms = () => {
    fetch(server + "db/rooms", { method: "GET" }).then(async (value) => {
      const json = await value.json();
      if (json.result === 1 || json.result === 2) {
        throw Error("No fetching at this moment");
      }

      setRooms(json.result)
    }).catch((error) => {
      console.log("Failed to fetch room");
      console.log(error);
    });
  };
  const fetchReservations = () => {
    fetch(server + "db/reservations", { method: "GET" }).then(async (value) => {
      const json = await value.json();
      if (json.result === 1 || json.result === 2) {
        throw Error("No fetching at this moment");
      }

      setReservations(json.result);

    }).catch((reason) => {
      console.log("Failed to fetch reservations");
      console.log(reason);
    })
  };
  const fetchPayments = () => {
    fetch(server + "db/payments", { method: "GET" }).then(async (value) => {
      const json = await value.json();
      if (json.result === 1 || json.result === 2) {
        throw Error("No fetching at this moment");
      }

      setPayments(json.result);
    }).catch((reason) => {
      console.log(reason);
      console.log("Failed to fetch payments");
    })
  };

  useEffect(() => {
    fetchProperties();
    fetchRooms();
    fetchReservations();
    fetchPayments();
  });

  return (
    <main className={styles.main}>
      <div className="container">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="contract-tab" data-bs-toggle="tab" data-bs-target="#contract" type="button" role="tab" aria-controls="home" aria-selected="true">Contract</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="properties-tab" data-bs-toggle="tab" data-bs-target="#properties" type="button" role="tab" aria-controls="home" aria-selected="true">Properties</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="rooms-tab" data-bs-toggle="tab" data-bs-target="#rooms" type="button" role="tab" aria-controls="profile" aria-selected="false">Rooms</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="reservations-tab" data-bs-toggle="tab" data-bs-target="#reservations" type="button" role="tab" aria-controls="contact" aria-selected="false">Reservations</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="payments-tab" data-bs-toggle="tab" data-bs-target="#payments" type="button" role="tab" aria-controls="contact" aria-selected="false">Payments</button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane" id="contract" role="tabpanel" aria-labelledby="contract-tab">
            <ContractTab />
          </div>
          <div className="tab-pane" id="properties" role="tabpanel" aria-labelledby="properties-tab">
            <PropertiesTab
              rooms={properties}
            />
          </div>
          <div className="tab-pane" id="rooms" role="tabpanel" aria-labelledby="rooms-tab">
            <RoomsTab
              rooms={rooms}
            />
          </div>
          <div className="tab-pane" id="reservations" role="tabpanel" aria-labelledby="reservations-tab">
            <ReservationsTab
              rooms={reservations}
            />
          </div>
          <div className="tab-pane" id="payments" role="tabpanel" aria-labelledby="payments-tab">
            <PaymentsTab
              rooms={payments}
            />
          </div>
        </div>
      </div>
      <button id="callRooms" style={{ opacity: 0 }} onClick={() => {
        fetchRooms();
        // fetch(server + "db/rooms", {method: "GET"}).then(async (value) => {
        //   const json = await value.json();
        //   if (json.result === 1 || json.result === 2) {
        //     throw Error("No fetching at this moment");
        //   }

        //   setRooms(json.res)
        // }).catch((error) => {
        //   console.log("Failed to fetch room");
        //   console.log(error);
        // });

      }}></button>
      <button id="callProperties" style={{ opacity: 0 }} onClick={() => {
        fetchProperties();
        // fetch(server + "db/rooms", {method: "GET"}).then(async (value) => {
        //   const json = await value.json();
        //   if (json.result === 1 || json.result === 2) {
        //     throw Error("No fetching at this moment");
        //   }

        //   setRooms(json.res)
        // }).catch((error) => {
        //   console.log("Failed to fetch room");
        //   console.log(error);
        // });

      }}></button>
      <button id="callReservations" style={{ opacity: 0 }} onClick={() => {
        fetchReservations();
        // fetch(server + "db/reservations", {method: "GET"}).then(async (value) => {
        //   const json = await value.json();
        //   if (json.result === 1 || json.result === 2) {
        //     throw Error("No fetching at this moment");
        //   }

        //   setReservations(json.result);

        // }).catch((reason) => {
        //   console.log("Failed to fetch reservations");
        //   console.log(reason);
        // })

      }}></button>
      <button id="callPayments" style={{ opacity: 0 }} onClick={() => {
        fetchPayments();
        // fetch(server + "db/payments", {method: "GET"}).then(async (value) => {
        //   const json = await value.json();
        //   if (json.result === 1 || json.result === 2) {
        //     throw Error("No fetching at this moment");
        //   }

        //   setPayments(json.result);
        // }).catch((reason) => {
        //   console.log(reason);
        //   console.log("Failed to fetch payments");
        // })
      }}></button>
    </main>
  );
}
