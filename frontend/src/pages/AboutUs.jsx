function AboutUs() {
  const stats = [
    { label: "Products listed", value: "12M+" },
    { label: "Orders delivered", value: "48M+" },
    { label: "Countries served", value: "24" },
    { label: "Years in business", value: "6" },
  ];

  const values = [
    {
      // icon: "🚚",
      title: "Fast delivery",
      desc: "Same-day and next-day shipping across major cities, with real-time order tracking.",
    },
    {
      // icon: "🛡️",
      title: "Trusted quality",
      desc: "Every seller is verified and every product is checked against our quality guidelines.",
    },
    {
      // icon: "💬",
      title: "Real support",
      desc: "24/7 customer support with a team that actually resolves issues, not just tickets.",
    },
    {
      // icon: "↩️",
      title: "Easy returns",
      desc: "30-day hassle-free returns on eligible items, no questions asked.",
    },
  ];

  const timeline = [
    {
      year: "2019",
      text: "AprilCart launched with 500 products in 2 categories.",
    },
    {
      year: "2021",
      text: "Crossed 1 million customers and expanded to fashion and home.",
    },
    {
      year: "2023",
      text: "Launched AprilCart Prime for free same-day delivery.",
    },
    {
      year: "2025",
      text: "Reached 12M+ product listings and 24-country reach.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Amazon-style dark banner */}
      <div className="bg-[#131921] text-white">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-[#FF9900] font-semibold text-sm tracking-wide mb-2">
            OUR STORY
          </p>
          <h1 className="text-4xl font-bold mb-4">About AprilCart</h1>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            Shopping online should feel fast, trustworthy, and effortless. We
            bring together quality products across tech, fashion, home, and
            lifestyle — all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        {/* Stats strip */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {stats.map((s) => (
            <div key={s.label} className="text-center py-6 px-4">
              <div className="text-2xl font-bold text-[#0F1111]">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-6">
          <h2 className="text-xl font-bold text-[#0F1111] mb-3">Our mission</h2>
          <p className="text-gray-700 leading-relaxed">
            AprilCart started with a simple idea: give people a marketplace they
            can trust, stocked by sellers who care about quality, and backed by
            support that actually helps. Today we work with over 8,000 sellers
            to bring millions of products to customers' doorsteps.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-[#0F1111] mb-1">{v.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-6">
          <h2 className="text-xl font-bold text-[#0F1111] mb-6">Our journey</h2>
          <div className="space-y-5">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-4">
                <div className="w-16 flex-shrink-0 font-bold text-[#FF9900]">
                  {t.year}
                </div>
                <div className="text-gray-700 border-l-2 border-gray-200 pl-4 pb-1">
                  {t.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#232F3E] text-white rounded-lg p-8 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">
              Join millions of happy shoppers
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Sign up today and get free delivery on your first order.
            </p>
          </div>
          <button className="bg-[#FF9900] hover:bg-[#e88a00] text-[#0F1111] font-semibold px-6 py-2.5 rounded-md whitespace-nowrap">
            Start shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
