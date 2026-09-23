import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Toast from "../components/ui/Toast";
import { api, userHeaders } from "../lib/api";

const Ticket = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [snack, setSnack] = useState(null);
  const [busy, setBusy] = useState(false);

  const ticketRef = useRef(null);

  useEffect(() => {
    fetch(api(`/api/orders/${orderId}`), { headers: userHeaders(false) })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const notify = (type, text, redirect = false) => {
    setSnack({ type, message: text });
    setTimeout(() => {
      setSnack(null);
      if (redirect) navigate("/");
    }, 1800);
  };

  const downloadTicket = async () => {
    try {
      setBusy(true);
      const canvas = await html2canvas(ticketRef.current, { scale: 3, backgroundColor: "#fff" });
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save("event-ticket.pdf");
      notify("success", "Ticket downloaded");
    } catch {
      notify("error", "Download failed");
    } finally {
      setBusy(false);
    }
  };

  const transferTicket = async () => {
    if (!newEmail || !newName) {
      notify("warning", "Fill in both fields");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch(api("/api/orders/transfer"), {
        method: "POST",
        headers: userHeaders(),
        body: JSON.stringify({ orderId, newEmail, newName }),
      });
      if (!res.ok) throw new Error();
      setShowTransfer(false);
      notify("success", "Ticket transferred", true);
    } catch {
      notify("error", "Transfer failed. The recipient must be a registered user");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <div className="mx-auto max-w-md animate-pulse px-6 py-12">
          <div className="h-72 rounded-2xl bg-stone-100" />
        </div>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page>
        <p className="mx-auto max-w-md px-6 py-20 text-center text-stone-500">
          This ticket doesn't exist or has been removed.
        </p>
      </Page>
    );
  }

  return (
    <Page>
      <div className="mx-auto max-w-md px-6 py-10">
        {/* THE TICKET ITSELF — branded artifact, ticket-stub styled */}
        <div
          ref={ticketRef}
          className="ticket-notch overflow-hidden rounded-2xl bg-white shadow-pop"
          style={{ "--notch-top": "104px" }}
        >
          {/* Header stub */}
          <div className="flex items-center justify-between bg-ink px-6 py-5 text-paper">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-300">
                EventGhar
              </p>
              <h2 className="font-display text-lg font-bold leading-tight">
                {order.eventTitle}
              </h2>
            </div>
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                order.payment?.status === "PAID" ? "bg-pine" : "bg-stone-500"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {order.payment?.status === "PAID" ? "PAID" : order.payment?.status || "UNPAID"}
            </span>
          </div>

          {/* Perforated seam at the 104px mark, matching --notch-top */}
          <div className="border-t-2 border-dashed border-stone-200" />

          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">Attendee</p>
                <p className="font-semibold text-ink">{order.user.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">Total paid</p>
                <p className="font-semibold text-ink">NPR {order.total}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-stone-400">Email</p>
                <p className="font-semibold text-ink">{order.user.email}</p>
              </div>
            </div>

            {order.payment?.status !== "PAID" ? (
              <div className="flex justify-center rounded-xl bg-stone-50 py-6">
                <p className="px-4 text-center text-sm text-stone-500">
                  QR appears after payment is confirmed.
                </p>
              </div>
            ) : order.passes?.length ? (
              <div className="space-y-3">
                <p className="text-center text-xs text-stone-500">
                  {order.passes.length} ticket{order.passes.length !== 1 ? "s" : ""}.
                  Each QR admits one person, so your group can arrive separately.
                </p>
                <div
                  className={[
                    "grid gap-3",
                    order.passes.length > 1 ? "grid-cols-2" : "grid-cols-1",
                  ].join(" ")}
                >
                  {order.passes.map((pass, i) => (
                    <div
                      key={pass.token}
                      className="relative flex flex-col items-center rounded-xl bg-stone-50 px-2 py-4"
                    >
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                        {i + 1} of {order.passes.length} · {pass.type}
                      </p>
                      <div className={pass.used ? "opacity-25" : ""}>
                        <QRCodeCanvas
                          value={pass.token}
                          size={order.passes.length > 1 ? 120 : 160}
                          fgColor="#17140F"
                        />
                      </div>
                      {pass.used && (
                        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 text-center font-display text-lg font-extrabold uppercase text-raspberry">
                          Used
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center rounded-xl bg-stone-50 py-6">
                <QRCodeCanvas
                  value={order.ticketToken || order._id}
                  size={160}
                  fgColor="#17140F"
                />
              </div>
            )}

            <p className="text-center text-xs text-stone-400">
              Order ID: {order._id}
            </p>
          </div>
        </div>

        {/* Actions live outside the ticket card, not printed on it */}
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" icon={Download} loading={busy} onClick={downloadTicket}>
            Download
          </Button>
          {order.payment?.status === "PAID" && (
            <Button
              className="flex-1"
              variant="secondary"
              icon={Send}
              onClick={() => setShowTransfer(true)}
            >
              Transfer
            </Button>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mx-auto mt-6 flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>
      </div>

      {/* TRANSFER MODAL */}
      {showTransfer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-pop">
            <h3 className="font-display text-lg font-semibold text-ink">
              Transfer this ticket
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              The recipient must already have an EventGhar account.
            </p>

            <div className="mt-5 space-y-3">
              <Input
                label="Recipient name"
                placeholder="Their full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                label="Recipient email"
                placeholder="them@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setShowTransfer(false);
                  setNewName("");
                  setNewEmail("");
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" loading={busy} onClick={transferTicket}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default Ticket;
