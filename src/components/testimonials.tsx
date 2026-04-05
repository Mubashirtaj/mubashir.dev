"use client";
import Script from "next/script";

export default function ReviewsSection() {
  return (
    <div className="max-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Client Reviews</h2>

      {/* iFrame for your space */}
      <iframe
        id="testimonialto-9bf87dc8-b7aa-41a4-9e8a-12aeb7f6a436"
        src="https://embed-v2.testimonial.to/carousel/all/mubashir-taj?id=9bf87dc8-b7aa-41a4-9e8a-12aef6a436"
        frameBorder="0"
        scrolling="no"
        width="100%"
        height="600"
        className=""
      ></iframe>

      {/* Script for resizing */}
      <Script
        src="https://testimonial.to/js/iframeResizer.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          iFrameResize(
            { log: false, checkOrigin: false },
            "#testimonialto-9bf87dc8-b7aa-41a4-9e8a-12aeb7f6a436"
          );
        }}
      />
    </div>
  );
}
