"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: LanguageOption) => {
    // Alert user as requested, without triggering actual language translation yet
    alert(`Coming Soon - ${lang.nativeName} (${lang.name}) translation will be available in the next release!`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Multilingual Selector Toggle Button with Smooth Globe Rotation Animation */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Select Language / भाषा चुनें"
        suppressHydrationWarning
      >
        <Globe
          className={`w-4 h-4 text-accent transition-transform duration-500 ease-in-out ${
            isOpen ? "rotate-180 scale-110" : "group-hover:rotate-45"
          }`}
        />
        <span className="hidden sm:inline font-medium" suppressHydrationWarning>Lang</span>
        <ChevronDown
          className={`w-3 h-3 text-gray-300 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Language Options Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-primary border border-white/20 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-white/10 bg-black/20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300 block px-2 py-0.5">
              Select Language
            </span>
          </div>

          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent/20 text-accent font-bold"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
                  suppressHydrationWarning
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <div className="font-semibold text-white">{lang.nativeName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{lang.name}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
