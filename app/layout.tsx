import "../src/app/globals.css";

export const metadata = {
  title: "Get Digital Photo Code",
  description:
    "UK HMPO Compliant Passport Photos - Professional digital photo service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
