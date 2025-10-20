import React from "react";
import LotteryForm from "../components/LotteryForm";

export default function HomePage() {
  return (
    <div className="container py-4">
      <LotteryForm />
      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#c7d2fe",
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
    </div>
  );
}
