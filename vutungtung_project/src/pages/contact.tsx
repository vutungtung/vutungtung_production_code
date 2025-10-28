import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export const Contact = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I rent a vehicle?",
      answer:
        "Simply browse our available vehicles, select your preferred one, and click 'Book Now.' You’ll be guided through the booking and payment process easily.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 24 hours before your scheduled pickup time without any charge. Late cancellations may incur a small fee.",
    },
    {
      question: "Do I need a driver’s license?",
      answer:
        "Yes, a valid driver’s license is required for all rentals. You’ll need to present it at the time of pickup or upload it during booking verification.",
    },
    {
      question: "Is insurance included in the rental price?",
      answer:
        "Yes, basic insurance is included with every vehicle. You can also purchase additional coverage options for extra protection.",
    },
    {
      question: "Can I rent a car for long-term use?",
      answer:
        "Absolutely! We offer special rates for long-term rentals. Contact our team for more details or custom pricing.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center px-4">
      {/* ===== CONTACT FORM SECTION ===== */}
      <div className="w-full max-w-7xl mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] shadow-xl bg-white rounded-2xl overflow-hidden">
          {/* Left Side with Image */}
          <div className="relative h-64 overflow-hidden lg:h-auto">
            <img
              src="/image/image-7.png"
              alt="image"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 w-full text-white bg-gradient-red/50 p-4 rounded-l-xl">
              <h1 className="text-2xl lg:text-4xl font-bold">Get in Touch</h1>
              <p className="text-sm lg:text-lg max-w-sm">
                We're here to help you with any questions about our vehicle
                rental services.
              </p>
            </div>
          </div>

          {/* Right Side with Form */}
          <div className="flex flex-col p-6 sm:p-10 lg:p-12 space-y-5 justify-center bg-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Send us a Message
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red"
              />
              <textarea
                placeholder="Your Message"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red"
                rows={4}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <div className="w-full max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none bg-gray-50 hover:bg-gray-100 transition"
              >
                <span className="font-semibold text-gray-800">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    openFAQ === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openFAQ === index
                    ? "max-h-40 opacity-100 p-4"
                    : "max-h-0 opacity-0 p-0"
                } overflow-hidden text-gray-600 bg-white`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
