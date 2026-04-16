"use client";

import Image from "next/image";

const projects = [
  {
    title: "Real-time LMS Platform",
    description:
      "Built real-time LMS dashboards with live analytics, role-based access and notifications.",
    image: "/projects/lms.png",
    tags: ["Next.js", "AWS", "WebSockets"],
  },
  {
    title: "Secure Payment Gateway",
    description:
      "Developed secure payment processing system with fraud detection and encryption layers.",
    image: "/projects/payment.png",
    tags: ["Node.js", "Stripe", "JWT"],
  },
];

export default function FeaturedProjects() {
  return (
    <section className="w-full py-10 px-4 md:px-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Featured Projects
        </h2>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {project.title}
                </h3>

                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}