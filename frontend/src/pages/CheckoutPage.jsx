import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
    card_number: "",
    card_name: "",
    card_expiry: "",
    card_cvv: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const { clearCart, total, cartItems } = useCart();
  const BASEURL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    let { name, value } = e.target;

    // light formatting for dummy card fields
    if (name === "card_number") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "card_expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (name === "card_cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.name || !form.address || !form.phone) {
      toast.error("Please fill in your shipping details");
      return;
    }

    if (form.payment_method === "ONLINE") {
      if (
        form.card_number.replace(/\s/g, "").length !== 16 ||
        !form.card_name ||
        form.card_expiry.length !== 5 ||
        form.card_cvv.length !== 3
      ) {
        toast.error("Please enter valid card details");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          phone: form.phone,
          payment_method: form.payment_method,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully");
        nav("/");
      } else {
        toast.error(data.error || "Order failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEDED] pt-8 pb-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* Left */}
        <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6">

          <h1 className="text-2xl font-bold mb-6 text-[#0F1111]">Checkout</h1>

          {/* Shipping */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-[#0F1111]">
              Shipping Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ahmed Naveed"
                  className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-800">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-sm font-semibold text-gray-800">Delivery Address</label>
              <textarea
                rows="4"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address..."
                className="w-full border border-gray-300 rounded p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
              />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-[#0F1111]">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-[#FF9900] transition-colors">
                <div>
                  <p className="font-medium text-[#0F1111]">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when your order arrives</p>
                </div>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={form.payment_method === "COD"}
                  onChange={handleChange}
                  className="accent-[#FF9900] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-[#FF9900] transition-colors">
                <div>
                  <p className="font-medium text-[#0F1111]">Online Payment</p>
                  <p className="text-sm text-gray-500">Debit Card / Credit Card</p>
                </div>
                <input
                  type="radio"
                  name="payment_method"
                  value="ONLINE"
                  checked={form.payment_method === "ONLINE"}
                  onChange={handleChange}
                  className="accent-[#FF9900] w-4 h-4"
                />
              </label>

              {/* Dummy card form */}
              {form.payment_method === "ONLINE" && (
                <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-800">Card Number</label>
                    <input
                      type="text"
                      name="card_number"
                      value={form.card_number}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-800">Name on Card</label>
                    <input
                      type="text"
                      name="card_name"
                      value={form.card_name}
                      onChange={handleChange}
                      placeholder="Ahmed Naveed"
                      className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-semibold text-gray-800">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="card_expiry"
                        value={form.card_expiry}
                        onChange={handleChange}
                        placeholder="12/28"
                        className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-semibold text-gray-800">CVV</label>
                      <input
                        type="password"
                        name="card_cvv"
                        value={form.card_cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">This is a test payment form. No real charges are made.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-5 text-[#0F1111]">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Products</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold text-[#0F1111]">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-[#FF9900] hover:bg-[#e88a00] disabled:opacity-60 disabled:cursor-not-allowed text-[#131921] py-3 rounded-lg font-bold transition-colors"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;