import ContractTab from "@/tabs/contract";
import styles from "./page.module.css";
import RoomsTab from "@/tabs/rooms";
import ReservationsTab from "@/tabs/reservations";
import PaymentsTab from "@/tabs/payments";

export default async function Home() {

  return (
    <main className={styles.main}>
      <div className="container">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="contract-tab" data-bs-toggle="tab" data-bs-target="#contract" type="button" role="tab" aria-controls="home" aria-selected="true">Contract</button>
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
          <div className="tab-pane" id="rooms" role="tabpanel" aria-labelledby="rooms-tab">
            <RoomsTab />
          </div>
          <div className="tab-pane" id="reservations" role="tabpanel" aria-labelledby="reservations-tab">
            <ReservationsTab />
          </div>
          <div className="tab-pane" id="payments" role="tabpanel" aria-labelledby="payments-tab">
            <PaymentsTab />
          </div>
        </div>
      </div>
    </main>
  );
}
