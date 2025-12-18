import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import StepTicket from "./StepTicket";
import StepPersonal from "./StepPersonal";
import StepPayment from "./StepPayment";
import "../assets/css/Checkout.css";

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [event, setEvent] = useState(null);

  // ✅ UPDATED ORDER STATE
  const [order, setOrder] = useState({
    tickets: location.state?.selectedTickets || [],
    user: {},
  });

  useEffect(() => {
    fetch(`http://localhost:5001/api/events/${id}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [id]);

  if (!event) return null;

  return (
    <>
      <Navbar />

      <div className="checkout-wrapper">
        <div className="checkout-header">
          <img src={event.imageSrc} alt="" />
          <div>
            <h2>{event.title}</h2>
            <p>📅 {event.formattedDate}</p>
            <p>⏰ 8:00 PM Onwards</p>
            <p>📍 Club Nova, Thamel</p>
          </div>
        </div>

        <div className="checkout-steps">
          {["Ticket Details", "Personal Details", "Payment Method"].map(
            (label, i) => (
              <div
                key={i}
                className={`step ${step > i + 1 ? "done" : ""} ${
                  step === i + 1 ? "active" : ""
                }`}
              >
                <div className="circle">
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span>{label}</span>
              </div>
            )
          )}
        </div>

        {step === 1 && (
          <StepTicket
            order={{ ...order, setOrder }}
            next={() => setStep(2)}
            />

        )}

        {step === 2 && (
          <StepPersonal
            order={order}
            setOrder={setOrder}
            prev={() => setStep(1)}
            next={() => setStep(3)}
          />
        )}

        {step === 3 && (
  <StepPayment
    order={order}
    event={event}
    prev={() => setStep(2)}
  />
)}

      </div>
    </>
  );
};

export default Checkout;
