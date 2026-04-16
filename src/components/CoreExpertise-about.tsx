"use client";

import { FaCode, FaLock, FaServer } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { MdSecurity } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

const expertise = [
  {
    title: "Backend Development",
    description: "NestJS, REST APIs, Microservices",
    icon: <FaCode />,
  },
  {
    title: "Frontend Engineering",
    description: "Next.js, React, UI/UX",
    icon: <FaServer />,
  },
  {
    title: "System Architecture",
    description: "AWS, Docker, Scalable Systems",
    icon: <FaServer />,
  },
  {
    title: "System Architecture",
    description: "AWS, Docker, Microservices",
    icon: <FaServer />,
  },
  {
    title: "SQL & Security",
    description: "Database Design, Encryption",
    icon: <SiPostgresql />,
  },
  {
    title: "SSL & Security",
    description: "HTTPS, OAuth, Encryption",
    icon: <MdSecurity />,
  },
];

export default function CoreExpertise() {
  return (
    <section className="w-full py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Core Expertise
        </h2>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              {/* Icon */}
              <div className="text-gray-700 text-lg mt-1">
                {item.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}