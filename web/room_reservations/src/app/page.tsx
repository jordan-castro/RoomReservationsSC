import ContractTab from "@/tabs/contract";
import styles from "./page.module.css";

export default async function Home() {

  return (
    <main className={styles.main}>
      <div className="container">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="contract-tab" data-bs-toggle="tab" data-bs-target="#contract" type="button" role="tab" aria-controls="home" aria-selected="true">Contract</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="rooms-tab" data-bs-toggle="tab" data-bs-target="#rooms" type="button" role="tab" aria-controls="profile" aria-selected="false">Rooms</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="reservations-tab" data-bs-toggle="tab" data-bs-target="#reservations" type="button" role="tab" aria-controls="contact" aria-selected="false">Reservations</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="payemnts-tab" data-bs-toggle="tab" data-bs-target="#payemnts" type="button" role="tab" aria-controls="contact" aria-selected="false">Payments</button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <ContractTab />
        </div>
      </div>
    </main>
  );
}
