import React from "react";
import LotteryForm from "../components/LotteryForm";
import { FaInstagram } from "react-icons/fa";

export default function HomePage() {
  const instagramLink = import.meta.env.VITE_INSTAGRAM_LINK; // ✅ fetched from .env

  return (
    <div className="container py-4">
      <LotteryForm />

      {/* 💬 Support & Instagram section */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#c7d2fe",
            marginBottom: "8px",
          }}
        >
          Need help or have a query? Contact support at{" "}
          <a
            href="mailto:Shaao1006@gmail.com"
            style={{ color: "#a5b4fc", textDecoration: "underline" }}
          >
            Shaao1006@gmail.com
          </a>
        </p>

        {instagramLink && (
          <p
            style={{
              fontSize: "0.9rem",
              color: "#c7d2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            For regular updates and queries, join us on{" "}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#E1306C",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 500,
              }}
            >
              <FaInstagram size={16} /> Instagram
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
