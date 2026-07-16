function AboutUs() {
  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0F1111] mb-6">About AprilCart</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            AprilCart started with a simple idea: shopping online should feel fast,
            trustworthy, and effortless. We bring together quality products across
            tech, fashion, home, and lifestyle categories, all in one place.
          </p>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold text-[#0F1111] mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Reliable shipping to your doorstep, on time.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-bold text-[#0F1111] mb-1">Trusted Quality</h3>
              <p className="text-sm text-gray-600">Every product vetted for quality and value.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-bold text-[#0F1111] mb-1">Real Support</h3>
              <p className="text-sm text-gray-600">A team that actually answers when you reach out.</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;