import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-raspberry text-paper">
          <XCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          Payment didn't go through
        </h1>
        <p className="mt-3 text-stone-600">
          Your card or eSewa account wasn't charged. This can happen if the
          payment was cancelled or timed out. No tickets were reserved.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Try again
          </Button>
          <Button variant="ghost" onClick={() => navigate("/contact")}>
            Contact support
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default PaymentFailed;
