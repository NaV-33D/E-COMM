import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
const [form, setForm] = useState({
  name: "",
  address: "",
  phone: "",
  payment_method: "COD",
});

const nav = useNavigate();
const { clearCart, total, cartItems } = useCart();
const BASEURL = import.meta.env.VITE_BASE_URL;

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  try {
    const res = await authFetch(`${BASEURL}/api/orders/create/`, {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      clearCart();
      alert("Order placed successfully!");
      nav("/");
    } else {
      alert(data.error || "Order failed");
    }
  } catch (error) {
    console.error("Checkout error:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10 px-4">
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

    {/* Left */}
    <div className="md:col-span-2 bg-white rounded-xl shadow p-6">

      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      {/* Shipping */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Shipping Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block mb-1 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ahmed Naveed"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Delivery Address
          </label>

          <textarea
            rows="4"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your complete address..."
            className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Payment */}
      <div>

        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Payment Method
        </h2>

        <div className="space-y-3">

          <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-green-500">

            <div>
              <p className="font-medium">
                Cash on Delivery
              </p>

              <p className="text-sm text-gray-500">
                Pay when your order arrives
              </p>
            </div>

            <input
              type="radio"
              name="payment_method"
              value="COD"
              checked={form.payment_method === "COD"}
              onChange={handleChange}
            />

          </label>

          <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-green-500">

            <div>
              <p className="font-medium">
                Online Payment
              </p>

              <p className="text-sm text-gray-500">
                Debit Card / Credit Card / UPI
              </p>
            </div>

            <input
              type="radio"
              name="payment_method"
              value="ONLINE"
              checked={form.payment_method === "ONLINE"}
              onChange={handleChange}
            />

          </label>

        </div>

      </div>

    </div>

    {/* Right */}
    <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">

      <h2 className="text-xl font-bold mb-5">
        Order Summary
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Products</span>
<span>{cartItems.length}</span>        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
<span>₹{total.toFixed(2)}</span>        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-600">
            FREE
          </span>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
<span>₹{total.toFixed(2)}</span>        </div>

      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Place Order
      </button>

    </div>

  </div>
</div>
  );
}

export default CheckoutPage;