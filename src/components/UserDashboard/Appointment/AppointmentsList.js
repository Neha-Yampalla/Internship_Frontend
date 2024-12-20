import React, { useEffect, useState } from "react";
import styles from "./AppointmentsList.module.css";


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from the backend
  useEffect(() => {
    fetch("http://localhost:8080/api/patient/appointments") // Adjust URL as needed
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        return response.json();
      })
      .then((data) => setAppointments(data))
      .catch((error) => console.error(error.message));
  }, []);

  const cancelAppointment = (appointmentId) => {
    fetch(`http://localhost:8080/api/patient/appointments/${appointmentId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Appointment cancelled successfully.");
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment.id !== appointmentId)
          );
        } else {
          alert("Failed to cancel appointment.");
        }
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <div className={styles.appointmentsContainer}>
      <h2>My Appointments</h2>
      {appointments.length > 0 ? (
        <table className={styles.appointmentsTable}>
          <thead>
            <tr>
              <th>Doctor Email</th>
              <th>Appointment Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Payment Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.doctorEmail}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.reason}</td>
                <td>
                  <span
                    className={`${styles.statusBox} ${
                      styles[appointment.status || "PENDING"]
                    }`}
                  >
                    {appointment.status || "PENDING"}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.paymentStatus} ${
                      appointment.paymentmode === "ONLINE_PAY"
                        ? styles.onlinePay
                        : styles.cash
                    }`}
                  >
                    {appointment.paymentmode === "ONLINE_PAY"
                      ? "Online Pay"
                      : "Cash"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyMessage}>No appointments found.</p>
      )}
    </div>
  );
};

export default Appointments;

