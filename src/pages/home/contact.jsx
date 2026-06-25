import { useState } from "react";
import toast from "react-hot-toast";
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdSend } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        message: ""
      });
    }, 1500);
  };

  const contactDetails = [
    {
      icon: MdPhone,
      title: "Call Us",
      value: "+1 (555) 019-2834",
      sub: "Mon - Fri, 9am - 6pm"
    },
    {
      icon: MdEmail,
      title: "Email Us",
      value: "support@kvaudio.com",
      sub: "Response within 24 hours"
    },
    {
      icon: MdLocationOn,
      title: "Visit Office",
      value: "123 Audio Boulevard, Sound City",
      sub: "Suite 400, NY 10001"
    },
    {
      icon: MdAccessTime,
      title: "Business Hours",
      value: "9:00 AM - 6:00 PM",
      sub: "Saturday by Appointment"
    }
  ];

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-8 text-white" style={{ background: "#0B0F1A" }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: "#E8C547" }}>Get in Touch</p>
          <h1 className="text-4xl font-extrabold tracking-wider uppercase text-white font-mono-display">
            Contact<span style={{ color: "#E8C547" }}>_Us</span>
          </h1>
          <div className="w-20 h-1" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
          <p className="text-sm mt-1 max-w-2xl" style={{ color: "#6B7A99" }}>
            Have questions about sound rental, pricing, or system configurations? Reach out to our sound engineering experts today.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Info (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactDetails.map((detail, idx) => {
                const Icon = detail.icon;
                return (
                  <div key={idx} className="p-5 rounded-xl flex flex-col gap-3 transition-all duration-300"
                    style={{
                      background: "rgba(17,24,39,0.5)",
                      border: "1px solid #2A3447",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#E8C547";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#2A3447";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(232,197,71,0.1)", border: "1px solid rgba(232,197,71,0.2)" }}>
                      <Icon size={18} className="text-[#E8C547]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{detail.title}</h4>
                      <p className="text-sm font-medium mt-1 text-white">{detail.value}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#6B7A99" }}>{detail.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Side: Map (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="p-4 rounded-xl flex flex-col gap-3 h-full"
              style={{ background: "rgba(17,24,39,0.5)", border: "1px solid #2A3447" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Our Location</h4>
              <div className="relative rounded-lg overflow-hidden flex-1 min-h-[250px] w-full bg-[#0B0F1A]">
                <iframe
                  title="KV_AUDIO Office Location Map"
                  src="https://www.google.com/maps/embed?81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d3151.835434509374!2d144.9537353153403!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1628178188610!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(80%) brightness(90%) contrast(90%)" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          

        </div>

      </div>
      
    </div>
  );
}