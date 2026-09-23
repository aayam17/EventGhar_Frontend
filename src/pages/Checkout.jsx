import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { CalendarDays, CalendarX } from "lucide-react";
import Page from "../components/layout/Page";
import Stepper from "../components/ui/Stepper";
import EmptyState from "../components/ui/EmptyState";
import StepTicket from "./StepTicket";
import StepPersonal from "./StepPersonal";
import StepPayment from "./StepPayment";
import { templeMusic } from "../assets/vintage";
import { api } from "../lib/api";

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [order, setOrder] = useState({
    tickets: location.state?.selectedTickets || [],
    user: {},
  });

  useEffect(() => {
    setEvent(null);
    setNotFound(false);

    fetch(api(`/api/events/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setEvent)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <Page>
        <div className="mx-auto max-w-3xl px-6 py-12">
          <EmptyState
            icon={CalendarX}
            title="We couldn't find this event"
            description="It may have been removed, or the link might be incorrect."
            action={
              <Link
                to="/"
                className="font-semibold text-marigold-dark hover:underline"
              >
                Back to events
              </Link>
            }
          />
        </div>
      </Page>
    );
  }

  if (!event) {
    return (
      <Page>
        <div className="mx-auto max-w-3xl animate-pulse px-6 py-12">
          <div className="h-40 rounded-2xl bg-stone-100" />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="relative">
        <img
          src={templeMusic}
          alt=""
          aria-hidden="true"
          className="poster-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 w-full opacity-[0.05]"
        />
        <div className="mx-auto max-w-3xl px-6 py-10 md:px-9">
        {/* Event summary */}
        <div className="mb-8 flex items-center gap-4 border-2 border-ink bg-white p-4 shadow-card">
          <img
            src={event.imageSrc}
            alt=""
            className="h-16 w-16 border-2 border-ink object-cover"
          />
          <div>
            <h2 className="font-display font-semibold text-ink">{event.title}</h2>
            <p className="flex items-center gap-1.5 text-sm text-stone-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {event.formattedDate}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <Stepper
            steps={["Ticket Details", "Personal Details", "Payment"]}
            current={step}
          />
        </div>

        {step === 1 && (
          <StepTicket order={{ ...order, setOrder }} next={() => setStep(2)} />
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
          <StepPayment order={order} event={event} prev={() => setStep(2)} />
        )}
      </div>
      </div>
    </Page>
  );
};

export default Checkout;
