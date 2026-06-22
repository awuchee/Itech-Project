"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Bell, LogOut } from "lucide-react";
import { UserProfile } from "../types";

interface LandingNavbarProps {
  userProfile: UserProfile | null;
  notificationCount: number;
  onSignOut: () => void;
  setNotificationsOpen: (open: boolean) => void;
}

const NAV_CONFIG = [
  {
    label: "Find Jobs",
    href: "/jobs",
    items: [
      { label: "Remote Jobs Worldwide", href: "/jobs" },
      { label: "Tech & Software Jobs", href: "/jobs" },
      { label: "Healthcare Jobs", href: "/jobs" },
      { label: "Finance & Banking", href: "/jobs" },
      { label: "Browse All Jobs →", href: "/jobs" },
    ],
  },
  {
    label: "Scholarships",
    href: "/scholarships",
    items: [
      { label: "Fully Funded Grants", href: "/scholarships" },
      { label: "DAAD Scholarships", href: "/scholarships" },
      { label: "Gates Cambridge", href: "/scholarships" },
      { label: "Fulbright Program", href: "/scholarships" },
      { label: "All Scholarships →", href: "/scholarships" },
    ],
  },
  {
    label: "Apprenticeships",
    href: "/apprenticeships",
    items: [
      { label: "Tech & IT Fast-Track", href: "/apprenticeships" },
      { label: "Skilled Trades", href: "/apprenticeships" },
      { label: "Digital Marketing", href: "/apprenticeships" },
      { label: "Business & Finance", href: "/apprenticeships" },
    ],
  },
  {
    label: "Nanny & Care",
    href: "/nanny",
    items: [
      { label: "Au Pair Placements", href: "/nanny" },
      { label: "Live-in Nanny", href: "/nanny" },
      { label: "Newborn Care Specialist", href: "/nanny" },
      { label: "Temporary Travel Nanny", href: "/nanny" },
      { label: "View Family Profiles →", href: "/nanny" },
    ],
  },
];

export default function LandingNavbar({
  userProfile,
  notificationCount,
  onSignOut,
  setNotificationsOpen,
}: LandingNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
  }, [pathname]);

  const go = (href: string) => {
    router.push(href);
    setOpen(null);
    setMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav ref={ref} className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* ── Logo ── */}
        <button
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-90 transition-opacity"
          onClick={() => go("/")}
          aria-label="Go to homepage"
        >
          <GHLogo />
          <span className="hidden sm:block font-black text-lg tracking-tight text-gray-900 leading-tight">
            <span className="text-teal-600">Global</span> Opportunities Hub
          </span>
        </button>

        {/* ── Desktop Navigation ── */}
        <div className="hidden lg:flex items-center gap-0">
          <NavLink onClick={() => go("/")} active={pathname === "/"}>Home</NavLink>

          {NAV_CONFIG.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <NavLink
                onClick={() => go(item.href)}
                active={pathname === item.href}
                suffix={
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      open === item.label ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                }
              >
                {item.label}
              </NavLink>

              {open === item.label && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                  {item.items.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => go(sub.href)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 font-medium transition-colors"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <NavLink onClick={() => go("/login")} active={isActive("/login")}>For Employers</NavLink>
          <NavLink onClick={() => go("/about")} active={isActive("/about")}>About</NavLink>
          <NavLink onClick={() => go("/contact")} active={isActive("/contact")}>Contact</NavLink>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                {notificationCount}
              </span>
            )}
          </button>

          {userProfile ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => go("/dashboard")}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-teal-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  {(userProfile.fullName || userProfile.email)[0].toUpperCase()}
                </div>
                <span className="hidden md:block max-w-[120px] truncate">
                  {userProfile.fullName || "Account"}
                </span>
              </button>
              <button
                onClick={onSignOut}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => go("/login")}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-teal-600 rounded-lg hover:bg-gray-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-0.5">
            <MobileNavBtn onClick={() => go("/")} active={pathname === "/"}>Home</MobileNavBtn>

            {NAV_CONFIG.map((item) => (
              <div key={item.label} className="pt-2">
                <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {item.label}
                </div>
                {item.items.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => go(sub.href)}
                    className="w-full text-left px-5 py-2 text-sm text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            ))}

            <div className="pt-2 border-t border-gray-100">
              <MobileNavBtn onClick={() => go("/login")} active={isActive("/login")}>For Employers</MobileNavBtn>
              <MobileNavBtn onClick={() => go("/about")} active={isActive("/about")}>About</MobileNavBtn>
              <MobileNavBtn onClick={() => go("/contact")} active={isActive("/contact")}>Contact</MobileNavBtn>
              <MobileNavBtn onClick={() => go("/dashboard")} active={isActive("/dashboard")}>My Dashboard</MobileNavBtn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Sub-components ── */

function NavLink({
  children,
  onClick,
  active,
  suffix,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  suffix?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
        active
          ? "text-teal-600 bg-teal-50"
          : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
      }`}
    >
      {children}
      {suffix}
    </button>
  );
}

function MobileNavBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
        active ? "text-teal-700 bg-teal-50" : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
      }`}
    >
      {children}
    </button>
  );
}

function GHLogo() {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md flex-shrink-0">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        <ellipse cx="20" cy="20" rx="7.5" ry="16" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <line x1="6" y1="14" x2="34" y2="14" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        <line x1="6" y1="26" x2="34" y2="26" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        <text x="20" y="24.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="system-ui, -apple-system, sans-serif">GH</text>
      </svg>
    </div>
  );
}
