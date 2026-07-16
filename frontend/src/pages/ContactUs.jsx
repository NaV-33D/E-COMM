import { useState } from "react";

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend endpoint
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0F1111] mb-6">Contact Us</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-[#0F1111]">Message Sent</h3>
              <p className="text-gray-600 mt-2">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF9900] text-[#131921] font-semibold rounded hover:bg-[#e88a00] transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactUs;