import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const StepPersonal = ({ order, setOrder, prev, next }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      user: { ...prevOrder.user, [name]: value },
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateAndNext = () => {
    const { name, email, phone } = order.user || {};
    const nextErrors = {};

    if (!name) nextErrors.name = "Full name is required";
    if (!email) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address";
    if (!phone) nextErrors.phone = "Phone number is required";
    else if (!/^[0-9]{7,15}$/.test(phone)) nextErrors.phone = "Enter a valid phone number";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-ink">Personal details</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="name"
          label="Full name"
          placeholder="Aayam Bhattarai"
          value={order.user?.name || ""}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          name="email"
          label="Email address"
          placeholder="you@example.com"
          value={order.user?.email || ""}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          name="phone"
          label="Phone number"
          placeholder="98XXXXXXXX"
          value={order.user?.phone || ""}
          onChange={handleChange}
          error={errors.phone}
        />
        <Input
          name="address"
          label="Address (optional)"
          placeholder="Kathmandu, Nepal"
          value={order.user?.address || ""}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={prev}>
          Back
        </Button>
        <Button onClick={validateAndNext}>Continue to payment</Button>
      </div>
    </div>
  );
};

export default StepPersonal;
