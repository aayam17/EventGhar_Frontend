import React, { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { api, adminHeaders } from "../lib/api";

const field =
  "rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-marigold-dark focus:ring-4 focus:ring-marigold/15";

const emptyForm = {
  title: "",
  formattedDate: "",
  eventDateTime: "",
  price: "",
  formattedPrice: "",
  packages: "",
  description: "",
  time: "",
  organizerName: "",
  venueName: "",
  venueAddress: "",
  mapEmbedUrl: "",
  generalPrice: "",
  vipPrice: "",
  vvipPrice: "",
  songUrl: "",
  songTitle: "",
  image: null,
};

const emptyTiers = { GENERAL: false, VIP: false, VVIP: false };

// Pull a ticket type's price back out of the event.tickets array so the
// edit form can prefill the three fixed price fields the create form uses.
// Older events used "FAN PIT" for what is now the General tier.
const ticketPrice = (tickets, type) => {
  const aliases = type === "GENERAL" ? ["GENERAL", "FAN PIT"] : [type];
  const match = tickets?.find((t) => aliases.includes(t.type?.toUpperCase()));
  return match?.price ?? "";
};

const toLocalInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const eventToForm = (event) => ({
  title: event.title || "",
  formattedDate: event.formattedDate || "",
  eventDateTime: toLocalInput(event.eventDateTime),
  price: event.price ?? "",
  formattedPrice: event.formattedPrice || "",
  packages: event.packages || "",
  description: event.description || "",
  time: event.time || "",
  organizerName: event.organizer?.name || "",
  venueName: event.venue?.name || "",
  venueAddress: event.venue?.address || "",
  mapEmbedUrl: event.venue?.mapEmbedUrl || "",
  generalPrice: ticketPrice(event.tickets, "GENERAL"),
  vipPrice: ticketPrice(event.tickets, "VIP"),
  vvipPrice: ticketPrice(event.tickets, "VVIP"),
  songUrl: event.songUrl || "",
  songTitle: event.songTitle || "",
  image: null,
});

// Which tier checkboxes start ticked when editing an existing event
const eventToTiers = (event) => ({
  GENERAL: ticketPrice(event.tickets, "GENERAL") !== "",
  VIP: ticketPrice(event.tickets, "VIP") !== "",
  VVIP: ticketPrice(event.tickets, "VVIP") !== "",
});

/* event === null  -> "Add new event" (create), POST
   event === {...} -> "Edit event" (update), PUT, image optional */
const AddEvent = ({ event = null, onClose, onEventAdded }) => {
  const isEdit = !!event;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(isEdit ? eventToForm(event) : emptyForm);
  const [tiers, setTiers] = useState(isEdit ? eventToTiers(event) : emptyTiers);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState("");

  // Re-sync if a different event gets passed in (e.g. reopening the modal)
  useEffect(() => {
    setFormData(isEdit ? eventToForm(event) : emptyForm);
    setTiers(isEdit ? eventToTiers(event) : emptyTiers);
    setImagePreview(null);
    setErrors({});
    setFormError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?._id]);

  const toggleTier = (tier) => {
    setTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
    if (errors.tiers) setErrors((prev) => ({ ...prev, tiers: null }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0] || null;
      setFormData({ ...formData, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (name === "eventDateTime") {
      const d = value ? new Date(value) : null;
      const formattedDate =
        d && !isNaN(d)
          ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
          : formData.formattedDate;
      const time =
        d && !isNaN(d)
          ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          : formData.time;
      setFormData({ ...formData, eventDateTime: value, formattedDate, time });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // On create, an image is required. On edit, keep the existing one
    // unless the admin picks a replacement.
    const nextErrors = {};
    if (!formData.title) nextErrors.title = "Event title is required";
    if (!formData.eventDateTime) nextErrors.eventDateTime = "Date and time are required";
    if (!isEdit && !formData.image) nextErrors.image = "Please add a cover image";
    if (!tiers.GENERAL && !tiers.VIP && !tiers.VVIP) {
      nextErrors.tiers = "Turn on at least one ticket tier";
    }
    if (tiers.GENERAL && formData.generalPrice === "") nextErrors.generalPrice = "Set a price, or 0 for free";
    if (tiers.VIP && formData.vipPrice === "") nextErrors.vipPrice = "Set a price, or 0 for free";
    if (tiers.VVIP && formData.vvipPrice === "") nextErrors.vvipPrice = "Set a price, or 0 for free";
    if (formData.songUrl && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(formData.songUrl.trim())) {
      nextErrors.songUrl = "Paste a youtube.com or youtu.be link";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError("Please fix the highlighted fields below.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("formattedDate", formData.formattedDate);
    data.append("eventDateTime", formData.eventDateTime);
    data.append("price", Number(formData.price));
    data.append("formattedPrice", formData.formattedPrice);
    data.append("packages", formData.packages);
    if (formData.image) data.append("image", formData.image);
    data.append("description", formData.description);
    data.append("time", formData.time);
    data.append("organizer", JSON.stringify({ name: formData.organizerName }));
    data.append(
      "venue",
      JSON.stringify({
        name: formData.venueName,
        address: formData.venueAddress,
        mapEmbedUrl: formData.mapEmbedUrl,
      })
    );
    const tickets = [
      tiers.GENERAL && { type: "GENERAL", price: Number(formData.generalPrice) },
      tiers.VIP && { type: "VIP", price: Number(formData.vipPrice) },
      tiers.VVIP && { type: "VVIP", price: Number(formData.vvipPrice) },
    ].filter(Boolean);
    data.append("tickets", JSON.stringify(tickets));
    const minPrice = Math.min(...tickets.map((t) => t.price));
    data.set("price", minPrice);
    if (!formData.formattedPrice) {
      data.set("formattedPrice", minPrice === 0 ? "Free" : `From Rs ${minPrice}`);
    }
    data.append("songUrl", formData.songUrl.trim());
    data.append("songTitle", formData.songTitle);

    const url = isEdit
      ? api(`/api/events/${event._id}`)
      : api("/api/events");

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: adminHeaders(false),
        body: data,
      });

      if (!res.ok) {
        // Surface the backend's actual error instead of a generic message,
        // so failures are actually diagnosable instead of just "failed".
        let detail = "";
        try {
          const body = await res.json();
          detail = body?.error || body?.message || "";
        } catch {
          // response wasn't JSON — ignore, fall back to status text
        }
        throw new Error(
          detail || `${isEdit ? "Failed to update event" : "Failed to add event"} (${res.status})`
        );
      }

      onEventAdded();
      onClose();
    } catch (err) {
      console.error(isEdit ? "UPDATE EVENT FAILED:" : "CREATE EVENT FAILED:", err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-2">
      <h2 className="font-display text-2xl font-bold text-ink">
        {isEdit ? "Edit event" : "Add new event"}
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        These details appear on the public event page and ticket checkout.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {formError && (
          <p className="rounded-lg bg-raspberry/10 px-3 py-2 text-sm font-medium text-raspberry-dark">
            {formError}
          </p>
        )}

        {/* BASIC INFO */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Basic info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                name="title"
                label="Event title *"
                placeholder="Event title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
            </div>
            <Input
              name="eventDateTime"
              type="datetime-local"
              label="Event date and time *"
              value={formData.eventDateTime}
              onChange={handleChange}
              error={errors.eventDateTime}
              required
            />
            <Input name="time" label="Time label" placeholder="7:00 PM" value={formData.time} onChange={handleChange} />
            <Input
              name="formattedPrice"
              label="Price label (optional)"
              placeholder="Auto-filled from your cheapest tier below"
              value={formData.formattedPrice}
              onChange={handleChange}
            />
            <Input
              name="packages"
              label="Packages"
              placeholder="VIP, Standard..."
              value={formData.packages}
              onChange={handleChange}
            />
            <Input
              name="organizerName"
              label="Organizer"
              placeholder="Organizer name"
              value={formData.organizerName}
              onChange={handleChange}
            />
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-stone-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Event description"
                className={`${field} mt-1.5 min-h-24 w-full`}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* MEDIA */}
        <section className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Media</h3>
          <div>
            <label className="text-sm font-medium text-stone-700">
              Cover image {isEdit ? "" : "*"}
            </label>

            <div className="mt-1.5 mb-2 flex items-center gap-3">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="New cover preview" className="h-14 w-14 rounded-lg object-cover" />
                  <span className="text-xs font-medium text-pine-dark">New image selected. This will replace the current one on save.</span>
                </>
              ) : isEdit ? (
                <>
                  <img src={event.imageSrc} alt={event.title} className="h-14 w-14 rounded-lg object-cover" />
                  <span className="text-xs text-stone-500">
                    Current image. Pick a new file below to replace it, or leave blank to keep it.
                  </span>
                </>
              ) : null}
            </div>

            <input
              type="file"
              name="image"
              accept="image/*"
              className={[field, "mt-1.5 w-full", errors.image ? "border-raspberry" : ""].join(" ")}
              onChange={handleChange}
              required={!isEdit}
            />
            {errors.image && <span className="mt-1 block text-xs font-medium text-raspberry">{errors.image}</span>}
          </div>
        </section>

        {/* VENUE */}
        <section className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Venue</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="venueName"
              label="Venue"
              placeholder="Venue name"
              value={formData.venueName}
              onChange={handleChange}
            />
            <Input
              name="venueAddress"
              label="Address"
              placeholder="Venue address"
              value={formData.venueAddress}
              onChange={handleChange}
            />
            <div className="sm:col-span-2">
              <Input
                name="mapEmbedUrl"
                label="Map embed URL"
                placeholder="Google Maps embed URL"
                value={formData.mapEmbedUrl}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* TICKET PRICING */}
        <section className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Ticket tiers</h3>
          <p className="text-xs text-stone-500">
            Turn on the tiers this event actually sells. Not every event needs all
            three, a general-only show just needs General.
          </p>
          {errors.tiers && (
            <p className="text-xs font-medium text-raspberry">{errors.tiers}</p>
          )}
          <div className="space-y-3">
            {[
              { key: "GENERAL", label: "General", field: "generalPrice" },
              { key: "VIP", label: "VIP", field: "vipPrice" },
              { key: "VVIP", label: "VVIP", field: "vvipPrice" },
            ].map((tier) => (
              <div
                key={tier.key}
                className={[
                  "flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors",
                  tiers[tier.key] ? "border-marigold-dark bg-marigold/5" : "border-stone-200",
                ].join(" ")}
              >
                <label className="flex flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tiers[tier.key]}
                    onChange={() => toggleTier(tier.key)}
                    className="h-4 w-4 accent-marigold-dark"
                  />
                  <span className="text-sm font-semibold text-ink">{tier.label}</span>
                </label>
                {tiers[tier.key] && (
                  <div className="w-40">
                    <input
                      type="number"
                      min="0"
                      name={tier.field}
                      placeholder="Price (0 = free)"
                      value={formData[tier.field]}
                      onChange={handleChange}
                      className={[field, "w-full", errors[tier.field] ? "border-raspberry" : ""].join(" ")}
                    />
                    {errors[tier.field] && (
                      <span className="mt-1 block text-xs font-medium text-raspberry">
                        {errors[tier.field]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* LIVE SONG */}
        <section className="space-y-4 border-t border-stone-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400">Live song</h3>
          <p className="text-xs text-stone-500">
            Paste a YouTube link and this event's card gets a play button on
            its waveform bar. Leave blank for no song.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                name="songUrl"
                label="YouTube link"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.songUrl}
                onChange={handleChange}
                error={errors.songUrl}
              />
            </div>
            <Input
              name="songTitle"
              label="Song title (shown on the player)"
              placeholder="Resham Firiri"
              value={formData.songTitle}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {isEdit ? "Save changes" : "Publish event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
