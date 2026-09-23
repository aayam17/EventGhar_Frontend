import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId") || params.get("oid");

  return (
    <Page>
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pine text-paper">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          You're going! Payment confirmed.
        </h1>
        <p className="mt-3 text-stone-600">
          Your ticket has been booked successfully. We've sent a confirmation
          to your email, and you can also view your QR ticket any time from
          "My Bookings."
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="primary"
            onClick={() =>
              navigate(orderId ? `/ticket/${orderId}` : "/my-bookings")
            }
          >
            View my ticket
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to home
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default PaymentSuccess;
