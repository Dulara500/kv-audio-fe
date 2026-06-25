import { useState } from "react";
import { MdClose, MdLocationOn, MdDateRange, MdSearch, MdArrowBack, MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Vocal Fest 2026",
    category: "concert",
    image: "/concert.png",
    location: "City Arena Stadium",
    date: "May 12, 2026",
    description: "A large-scale outdoor festival requiring massive acoustic coverage and heavy sub-bass response. We deployed our flagship line array speakers to achieve uniform SPL across the 15,000-capacity arena.",
    gear: ["Line Array Speakers", "Dual 18\" Subwoofers", "Digital Mixing Console (64-Ch)", "Wireless Vocal Microphones", "In-Ear Monitor Systems"]
  },
  {
    id: 2,
    title: "Global Tech Summit",
    category: "corporate",
    image: "/corporate.png",
    location: "Grand Hyatt Ballroom",
    date: "June 02, 2026",
    description: "We designed a clean, low-profile sound reinforcement system for maximum speech intelligibility. Columns speaker arrays were positioned strategically to minimize reflections off glass walls.",
    gear: ["Column Array Speakers", "Digital Automatic Mixer", "Wireless Lapel & Headset Mics", "Gooseneck Podiums Mics", "Acoustic Echo Cancellers"]
  },
  {
    id: 3,
    title: "Summer Beat Club",
    category: "club",
    image: "/club.png",
    location: "Illusion Nightclub",
    date: "April 18, 2026",
    description: "A high-energy DJ setup designed for deep bass and clean monitors. The system delivered precise highs and massive low-end punch for the headlining international DJ set.",
    gear: ["Pioneer CDJ-3000 Multiplayers", "Pioneer DJM-V10 Mixer", "Point-Source Main Speakers", "18\" Active DJ Monitors", "Dual 21\" Subwoofer Stacks"]
  },
  {
    id: 4,
    title: "Sophia & Marcus Wedding",
    category: "wedding",
    image: "/wedding.png",
    location: "Serenade Gardens",
    date: "June 15, 2026",
    description: "A scenic outdoor ceremony and reception requiring seamless sound transition and clean visual integration. Audio speakers were wrapped in elegant white scrims to blend into the floral decor.",
    gear: ["Compact PA Speakers (White)", "Wireless Handheld Microphones", "Ultra-low Profile Subwoofers", "12-Channel Compact Mixer", "Fairy Light Audio Uplighting"]
  },
  {
    id: 5,
    title: "Horizon Music Festival",
    category: "concert",
    image: "/festival.png",
    location: "Sunset Valley Fields",
    date: "May 29, 2026",
    description: "A massive multi-stage festival. We provided main stage line arrays, delay towers, and extensive front-fill coverage to project clear sound over 200 meters of audience space under complex wind conditions.",
    gear: ["High-Output Line Arrays", "Delay Tower Arrays", "Quad 18\" Subwoofers", "Tour-Grade System Amplifiers", "Dual Mixing Desks"]
  },
  {
    id: 6,
    title: "Apex Audio Studios",
    category: "studio",
    image: "/studio.png",
    location: "Downtown Production Suite",
    date: "March 10, 2026",
    description: "A recording control room integration focused on clinical frequency response and perfect phase alignment. Custom acoustic tuning combined with analog summing mixers created a perfect workspace.",
    gear: ["48-Fader Mixing Console", "Active Studio Monitors", "Tube Compressor/Limiters", "Parametric Equalizers", "Acoustic Diffusion Panels"]
  }
];

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filters = [
    { value: "all", label: "All Setups" },
    { value: "concert", label: "Concerts & Festivals" },
    { value: "corporate", label: "Corporate Events" },
    { value: "club", label: "Club & DJ" },
    { value: "wedding", label: "Weddings" },
    { value: "studio", label: "Studio & Production" }
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesFilter = selectedFilter === "all" || item.category === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gear.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 text-white" style={{ background: "#0B0F1A" }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: "#E8C547" }}>Portfolio</p>
          <h1 className="text-4xl font-extrabold tracking-wider uppercase text-white font-mono-display">
            Event<span style={{ color: "#E8C547" }}>_Gallery</span>
          </h1>
          <div className="w-20 h-1" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
          <p className="text-sm mt-1 max-w-2xl" style={{ color: "#6B7A99" }}>
            Explore some of our premium sound setups, live stages, club gear configurations, and corporate audio solutions.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-xl transition-all"
          style={{ background: "rgba(17,24,39,0.4)", border: "1px solid #2A3447" }}>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 border"
                  style={{
                    color: isActive ? "#0B0F1A" : "#6B7A99",
                    background: isActive ? "linear-gradient(135deg, #E8C547, #F59E0B)" : "transparent",
                    borderColor: isActive ? "transparent" : "#2A3447"
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 flex items-center">
            <MdSearch className="absolute left-3 text-lg" style={{ color: "#6B7A99" }} />
            <input
              type="text"
              placeholder="Search by title, gear, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200 text-white placeholder-[#6B7A99] focus:outline-none"
              style={{
                background: "#0B0F1A",
                border: "1px solid #2A3447",
              }}
              onFocus={e => e.target.style.borderColor = "#E8C547"}
              onBlur={e => e.target.style.borderColor = "#2A3447"}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 rounded-xl" style={{ border: "1px dashed #2A3447" }}>
            <p className="text-lg" style={{ color: "#6B7A99" }}>No setups found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  background: "#111827",
                  border: "1px solid #2A3447",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
              >
                {/* Image Wrap */}
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded animate-pulse"
                    style={{
                      background: "rgba(11,15,26,0.85)",
                      color: "#E8C547",
                      border: "1px solid #2A3447",
                      backdropFilter: "blur(4px)"
                    }}>
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="text-lg font-bold tracking-wide text-white group-hover:text-[#E8C547] transition-colors duration-200">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-col gap-1.5 text-xs" style={{ color: "#6B7A99" }}>
                    <div className="flex items-center gap-1.5">
                      <MdLocationOn size={14} className="text-[#E8C547]" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MdDateRange size={14} className="text-[#E8C547]" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Gear Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.gear.slice(0, 3).map((g, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded"
                        style={{ background: "#2A3447", color: "#E8C547" }}>
                        {g}
                      </span>
                    ))}
                    {item.gear.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "#1F2937", color: "#6B7A99" }}>
                        +{item.gear.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox / Modal */}
        {lightboxIndex !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 backdrop-blur-md bg-black/85"
          >
            {/* Modal Body */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
              style={{
                background: "rgba(17,24,39,0.95)",
                border: "1px solid #2A3447",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
              }}
            >
              {/* Image Section (lg:col-span-7) */}
              <div className="lg:col-span-7 relative bg-black flex items-center justify-center min-h-[300px] lg:min-h-full">
                <img
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  className="w-full h-full object-contain max-h-[40vh] lg:max-h-[80vh]"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2 rounded-full transition-all hover:scale-105 text-white bg-black/60 border border-white/10 hover:border-[#E8C547]"
                >
                  <MdArrowBack size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 rounded-full transition-all hover:scale-105 text-white bg-black/60 border border-white/10 hover:border-[#E8C547]"
                >
                  <MdArrowForward size={22} />
                </button>
              </div>

              {/* Info Section (lg:col-span-5) */}
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[50vh] lg:max-h-full">
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors text-[#6B7A99] hover:text-white"
                  style={{ background: "#2A3447" }}
                >
                  <MdClose size={20} />
                </button>

                {/* Header info */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded w-max"
                    style={{ background: "rgba(232,197,71,0.1)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.2)" }}>
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <h2 className="text-2xl font-bold tracking-wide text-white leading-tight">
                    {filteredItems[lightboxIndex].title}
                  </h2>
                  <div className="flex flex-col gap-1.5 text-xs mt-1" style={{ color: "#6B7A99" }}>
                    <div className="flex items-center gap-1.5">
                      <MdLocationOn size={14} className="text-[#E8C547]" />
                      <span>{filteredItems[lightboxIndex].location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MdDateRange size={14} className="text-[#E8C547]" />
                      <span>{filteredItems[lightboxIndex].date}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-white font-mono-display">Challenge & Execution</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7A99" }}>
                    {filteredItems[lightboxIndex].description}
                  </p>
                </div>

                {/* Gear Used */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-white font-mono-display">Equipment Deployed</h4>
                  <div className="flex flex-col gap-2">
                    {filteredItems[lightboxIndex].gear.map((g, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-sm" style={{ color: "#6B7A99" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#E8C547" }} />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-10 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(17,24,39,0.85) 0%, rgba(11,15,26,0.95) 100%)",
            border: "1px solid #2A3447",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)"
          }}>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-wide text-white">Need a professional sound setup for your next event?</h3>
            <p className="text-sm" style={{ color: "#6B7A99" }}>Contact our sales team to custom design your sound system today.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98] whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}
          >
            Get in Touch
          </Link>
        </div>

      </div>
    </div>
  );
}