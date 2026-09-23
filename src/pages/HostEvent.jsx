import React, { useState } from "react";
import Page from "../components/layout/Page";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import { api } from "../lib/api";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HostEvent = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    eventName: "",
    eventDate: "",
    companyName: "",
    companyAddress: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState(null);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatLocalDate(d);
  })();

  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return formatLocalDate(d);
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "details" && value.length > 300) return;
    setForm({ ...form, [name]: value });
  };

  const showSnack = (message, type = "success") => {
    setSnack({ message, type });
    setTimeout(() => setSnack(null), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.eventName || !form.eventDate) {
      showSnack("Please fill all required fields", "warning");
      return;
    }

    const selected = new Date(form.eventDate);
    const min = new Date(minDate);
    const max = new Date(maxDate);

    if (selected < min || selected > max) {
      showSnack("Event date must be between yesterday and the next 6 months", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(api("/api/host-requests"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        showSnack(data.error || "Submission failed", "error");
        return;
      }

      showSnack("Event request submitted successfully!", "success");
      setForm({
        fullName: "", email: "", phone: "", address: "",
        eventName: "", eventDate: "", companyName: "", companyAddress: "", details: "",
      });
    } catch {
      showSnack("Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-9">
        <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
          Host an event
        </h2>
        <p className="mt-2 text-stone-600">
          Tell us about your event and we'll get back to you within a couple of days.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6 border-2 border-ink bg-white p-6 shadow-card md:p-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-stone-400">
              Your details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="fullName" label="Full name *" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
              <Input name="email" type="email" label="Email *" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              <Input name="phone" label="Phone" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX" />
              <Input name="address" label="Address" value={form.address} onChange={handleChange} placeholder="City, Country" />
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-stone-400">
              Event details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="eventName" label="Event name *" value={form.eventName} onChange={handleChange} placeholder="Concert, Festival, Meetup..." />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Event date *</label>
                <input
                  name="eventDate"
                  type="date"
                  value={form.eventDate}
                  min={minDate}
                  max={maxDate}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:ring-marigold/25"
                />
                <span className="text-xs text-stone-400">Calendar only, manual input disabled</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-stone-400">
              Organizer (optional)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="companyName" label="Company / organizer name" value={form.companyName} onChange={handleChange} placeholder="Optional" />
              <Input name="companyAddress" label="Company address" value={form.companyAddress} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Event details</label>
              <span className="text-xs text-stone-400">{form.details.length}/300</span>
            </div>
            <textarea
              name="details"
              rows={5}
              value={form.details}
              onChange={handleChange}
              placeholder="Describe your event..."
              className="mt-1.5 w-full border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-stone-400 focus:ring-4 focus:ring-marigold/25"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Submit request
          </Button>
        </form>
      </div>

      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default HostEvent;
