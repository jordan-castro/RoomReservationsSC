import styles from "./page.module.css";

export default async function Home() {

  return (
    <main className={styles.main}>
      <div className="container">
        <div className="p-3"></div>
        <div className="row">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRoomModal">Add Room</button>
        </div>
        <div className="p-3"></div>
        <div className="row">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#makeReservationModal">Make Reservation</button>
        </div>
        <div className="p-3"></div>
        <div className="row">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#makePaymentModal">Make Payment</button>
        </div>
        <div className="p-3"></div>
        <div className="row">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteReservationModal">Delete Reservation</button>
        </div>
        <div className="p-3"></div>
        <div className="row">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changeRoomStatusModal">Change Room Status</button>
        </div>
        <div className="p-3"></div>
      </div>
    </main>
  );
}
