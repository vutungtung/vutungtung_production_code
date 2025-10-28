const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <section className="bg-gradient-red text-white py-20 text-center">
        <h1 className="text-4xl font-bold">About VuTungTung</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          We’re passionate about providing reliable, affordable, and convenient
          vehicle rental services that help you explore the world on your terms.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 grid grid-cols-2 md:grid-cols-4 text-center max-w-5xl mx-auto gap-6">
        {[
          ["50,000+", "Happy Customers"],
          ["500+", "Vehicles Available"],
          ["15+", "Years of Experience"],
          ["Always", "24/7 Support"],
        ].map(([stat, label]) => (
          <div key={label}>
            <div className="text-red text-3xl font-bold">{stat}</div>
            <div className="text-sm mt-2">{label}</div>
          </div>
        ))}
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2024, VuTungTung started with a simple mission: to make
              vehicle rental accessible, affordable, and hassle-free for
              everyone. What began as a small local business has grown into a
              trusted name in the transportation industry.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              We believe that mobility should never be a barrier to your
              adventures, business needs, or daily life. That’s why we’ve built
              a diverse fleet of well-maintained vehicles and a customer-centric
              team that’s available around the clock.
            </p>
          </div>
          <div className=" w-full h-60 rounded-md overflow-hidden flex items-center justify-center">
            <img src="/image/team.png" alt="" />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
        <p className="text-gray-600 mb-10">
          The principles that guide everything we do
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            [
              "Safety First",
              "Every vehicle in our fleet undergoes rigorous safety inspections.",
            ],
            [
              "Customer Focused",
              "Your satisfaction is our priority. We listen to your needs.",
            ],
            [
              "Excellence",
              "We strive for excellence in every aspect of our service.",
            ],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-gray-50 border border-gray-200 p-6 rounded-md shadow-sm"
            >
              <h3 className="text-lg font-semibold text-red">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">Meet Our Team</h2>
        <p className="text-gray-600 mb-10">
          The people behind your great rental experience
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Pyarjan Thapa",
              role: "Co-Founder & CEO (Chief Executive Officer)",
              desc: "A visionary leader with 15+ years of experience in the automotive industry, driving innovation and strategic growth.",
              img: "/image/pyarjanthapa.jpeg",
            },
            {
              name: "Sujan Pokharal",
              role: "Co-Founder & CTO (Chief Technology Officer)",
              desc: "Tech innovator and expert in fleet management systems, ensuring top-notch technological standards and product reliability.",
              img: "/image/sujan.jpeg",
            },
            {
              name: "Bishwash Rijal",
              role: "Co-Founder & COO (Chief Operating Officer)",
              desc: "Operations strategist dedicated to delivering seamless and efficient customer experiences around the clock.",
              img: "/image/bishwash.jpeg",
            },
            {
              name: "Bishal Parajuli",
              role: "Co-Founder & CMO (Chief Marketing Officer)",
              desc: "Creative marketing mind focused on building strong brand presence and connecting customers through impactful campaigns.",
              img: "/image/bishal.jpeg",
            },
          ].map(({ name, role, desc, img }) => (
            <div
              key={name}
              className="relative bg-white rounded-[3rem] shadow-md overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image with overlay */}
              <div className="relative">
                <img
                  src={img}
                  alt={name}
                  className="w-40 h-40 rounded-full object-cover mx-auto mt-6 border-red border-3 transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 transition-colors duration-500 group-hover: bg-gradient-to-b group-hover: from-red-400 group-hover:to-white rounded-[3rem]">
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-red-500 font-medium">{role}</p>
                <p className="text-xs text-gray-600 mt-3">{desc}</p>
              </div>

              {/* Subtle glow border on hover */}
              <div className="absolute inset-0 rounded-[3rem] border-2  group-hover: border-red transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
