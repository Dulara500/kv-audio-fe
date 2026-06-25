
import { LuAudioWaveform } from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full" style={{ background: "#0B0F1A", borderTop: "1px solid #2A3447" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2 group w-max">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)" }}>
                                <LuAudioWaveform className="text-[#0B0F1A] text-lg font-bold" />
                            </div>
                            <span className="font-bold text-lg tracking-wider text-white font-mono-display">
                                KV<span className="text-[#E8C547]">_AUDIO</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: "#6B7A99" }}>
                            Premium audio systems and professional sound engineering for any event size. Experience unmatched sound clarity.
                        </p>
                        <div className="flex gap-3 mt-2">
                            {[
                                { icon: FaFacebookF, url: "#" },
                                { icon: FaInstagram, url: "#" },
                                { icon: FaYoutube, url: "#" },
                                { icon: FaTwitter, url: "#" }
                            ].map((social, i) => {
                                const Icon = social.icon;
                                return (
                                    <a key={i} href={social.url} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                        style={{ border: "1px solid #2A3447", color: "#6B7A99" }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = "#E8C547";
                                            e.currentTarget.style.color = "#E8C547";
                                            e.currentTarget.style.backgroundColor = "rgba(232,197,71,0.1)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#2A3447";
                                            e.currentTarget.style.color = "#6B7A99";
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }}
                                    >
                                        <Icon size={14} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-mono-display">Quick Links</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/gallery", label: "Gallery" },
                                { to: "/items", label: "Catalog" },
                                { to: "/contact", label: "Contact" }
                            ].map((link, i) => (
                                <Link key={i} to={link.to} className="transition-colors duration-200" style={{ color: "#6B7A99" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#E8C547"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#6B7A99"}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services / Equipment */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-mono-display">Equipment</h4>
                        <div className="flex flex-col gap-2 text-sm" style={{ color: "#6B7A99" }}>
                            <span className="hover:text-[#E8C547] cursor-pointer transition-colors duration-200">Line Arrays & Speakers</span>
                            <span className="hover:text-[#E8C547] cursor-pointer transition-colors duration-200">Mixers & Consoles</span>
                            <span className="hover:text-[#E8C547] cursor-pointer transition-colors duration-200">Microphones & DI Boxes</span>
                            <span className="hover:text-[#E8C547] cursor-pointer transition-colors duration-200">DJ Equipment Rental</span>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-mono-display">Contact Us</h4>
                        <div className="flex flex-col gap-3 text-sm" style={{ color: "#6B7A99" }}>
                            <div className="flex items-center gap-2">
                                <MdLocationOn className="text-[#E8C547] flex-shrink-0" size={16} />
                                <span>123 Audio Boulevard, Sound City</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdPhone className="text-[#E8C547] flex-shrink-0" size={16} />
                                <span>+1 (555) 019-2834</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdEmail className="text-[#E8C547] flex-shrink-0" size={16} />
                                <span>support@kvaudio.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8" style={{ borderTop: "1px solid #2A3447" }} />

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: "#6B7A99" }}>
                    <p>© {new Date().getFullYear()} KV_AUDIO. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}