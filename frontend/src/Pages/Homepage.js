// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../components/layouts/MetaData/Metadata";
import "./Homepage.css";

const navLinks = ["Product", "Features", "Security", "Resources"];

function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <MetaData title="LetsChat | Home" />
      <div className="landing">
        <nav className="navbar">
          <div className="navbar-logo">LetsChat</div>
          <div className="navbar-menu">
            {navLinks.map((link) => (
              <a key={link} className="navbar-item" href="#">{link}</a>
            ))}
          </div>
          <div className="navbar-actions">
            <Link to="/" className="navbar-login">Login</Link>
            <Link to="/signup" className="navbar-cta">Get Started</Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-kicker">2024 · Real-time collaboration</span>
            <h1>
              Conversations that feel <em>alive</em>, not archived.
            </h1>
            <p className="hero-copy">
              Bring every channel, file, and idea into one secure workspace
              built for teams that need speed without compromise.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn primary">Create free workspace</Link>
              <Link to="/signup" className="btn secondary">See how it works</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">8K+</span>
                <span className="hero-stat-label">Trusted teams</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">99.99%</span>
                <span className="hero-stat-label">Uptime</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">2M</span>
                <span className="hero-stat-label">Msgs/day</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-top">
              <span>Today · Focus Rooms</span>
              <span className="panel-live">Live</span>
            </div>
            <div className="hero-panel-body">
              <h3>Launch Briefings</h3>
              <p>Product, marketing and design synced in one thread.</p>
              <div className="panel-messages">
                <div className="panel-msg other">
                  <div className="panel-msg-avatar">AK</div>
                  <div className="panel-msg-bubble">Design review done ✅ shipping tomorrow</div>
                </div>
                <div className="panel-msg own">
                  <div className="panel-msg-avatar">ME</div>
                  <div className="panel-msg-bubble">🔥 Let's go! Ping me when it's live</div>
                </div>
                <div className="panel-msg other">
                  <div className="panel-msg-avatar">RS</div>
                  <div className="panel-msg-bubble">Backend ready, awaiting final QA pass</div>
                </div>
              </div>
              <div className="panel-chips">
                <span>Notifications</span>
                <span>Pinned files</span>
                <span>Mentions</span>
              </div>
            </div>
            <div className="hero-panel-footer">
              + Invite teammates
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">LetsChat</div>
            <p>Designed for modern teams who expect polished experiences, fast responses, and transparent security.</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Integrations</a>
            <a href="#">Mobile apps</a>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Security</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href="mailto:support@letschat.com">support@letschat.com</a>
            <a href="#">Live chat</a>
            <a href="#">Status</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} LetsChat. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
