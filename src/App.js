import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { motion } from "framer-motion";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    costGuess: "",
    spidrPin: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  // Initialize Vanta on mount
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x00ffe1,
        backgroundColor: 0x0e0e0e,
        points: 15.0,
        maxDistance: 75.0,
        spacing: 60.0,
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "spidrPin") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1-")
        .slice(0, 19)
        .replace(/-$/, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("Form Submitted:", formData);
      setLoading(false);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }, 1000);
  };

  return (
    <div className="fixed-bg">
      <div ref={vantaRef} className="mesh-background" />

      <div className="form-container">
        <h1>Get Early Access To The Air Fryer</h1>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              border:
                formData.email && !formData.email.includes("@")
                  ? "1px solid red"
                  : "none",
            }}
          />
          {formData.email && !formData.email.includes("@") && (
            <small style={{ color: "red" }}>Please enter a valid email</small>
          )}
          <input
            type="number"
            name="costGuess"
            placeholder="Guess the air fryer’s cost ($)"
            value={formData.costGuess}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="spidrPin"
            placeholder="####-####-####-####"
            value={formData.spidrPin}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </motion.form>
      </div>

      {showSnackbar && (
        <div className="snackbar">Your form has been submitted!</div>
      )}
    </div>
  );
}

export default App;
