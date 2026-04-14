"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAvailable } from "@/lib/work";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main
      style={{ background: "var(--bg-color)", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-5xl">
 
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
            style={{
              background: "var(--secondary-color)",
              color: "var(--text-color)",
              border: "1px solid var(--secondary-color)",
            }}
          >
            Get in touch
          </span>
          <h1
            className="mb-4 text-5xl font-semibold tracking-tight"
            style={{ color: "var(--text-color)" }}
          >
            Let&apos;s work{" "}
            <span style={{ color: "var(--primary-color)" }}>together</span>
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed" style={{ color: "#64748b" }}>
            Have a project in mind or just want to say hello? Drop a message — I&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
   
          <motion.div
            className="flex flex-col gap-5 lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
                label: "Email",
                value: "mubashirtajuddin.info@gmail.com",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                label: "Location",
                value: "Karachi, Pakistan",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
                label: "Response time",
                value: "Within 24 hours",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--secondary-color)",
                  boxShadow: "0 1px 3px rgba(79,70,229,0.06)",
                }}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--secondary-color)",
                    color: "var(--primary-color)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--primary-color)" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

         <div
  className="mt-2 flex items-center gap-3 rounded-2xl p-5 transition-all duration-300"
  style={{
    background: isAvailable ? "rgba(34,197,94,0.06)" : "rgba(148,163,184,0.06)",
    border: isAvailable ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(148,163,184,0.2)",
  }}
>
  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
    {isAvailable && (
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
    )}
    <span className={cn(
      "relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-300",
      isAvailable ? "bg-green-500" : "bg-slate-500"
    )} />
  </span>

  <p 
    className="text-sm transition-colors duration-300" 
    style={{ color: isAvailable ? "#16a34a" : "#94a3b8" }}
  >
    <span className="font-medium">
      {isAvailable ? "Available for work" : "Currently booked"}
    </span>
    {" — "}
    {isAvailable 
      ? "Open to freelance & full-time roles" 
      : "Not taking new projects at the moment"}
  </p>
</div>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div
              className="rounded-3xl p-8"
              style={{
                background: "#ffffff",
                border: "1px solid var(--secondary-color)",
                boxShadow: "0 4px 24px rgba(79,70,229,0.07)",
              }}
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: "rgba(34,197,94,0.1)" }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold" style={{ color: "var(--text-color)" }}>
                      Message sent!
                    </h3>
                    <p className="mb-6 text-sm" style={{ color: "#64748b" }}>
                      Thanks for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-80"
                      style={{ background: "var(--secondary-color)", color: "var(--primary-color)" }}
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="Name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                      <Field label="Email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <Field label="Subject" name="subject" type="text" placeholder="Project inquiry, collaboration..." value={form.subject} onChange={handleChange} required />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                        Message <span style={{ color: "var(--primary-color)" }}>*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Tell me about your project or idea..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                        style={{
                          border: "1px solid var(--secondary-color)",
                          color: "var(--secondary-color)",
                          fontFamily: "inherit",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--secondary-color)")}
                      />
                    </div>

                    {status === "error" && (
                      <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.07)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)" }}>
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, var(--primary-color), var(--primary-hover))" }}
                    >
                      <span
                        className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0"
                      />
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send message
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label, name, type, placeholder, value, onChange, required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94a3b8" }}>
        {label} {required && <span style={{ color: "var(--primary-color)" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
        style={{
          border: "1px solid var(--secondary-color)",
          fontFamily: "inherit",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--secondary-color)")}
      />
    </div>
  );
}