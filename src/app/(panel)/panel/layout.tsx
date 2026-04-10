import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import "@/app/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}