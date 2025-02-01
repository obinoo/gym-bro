// import { NavBar } from "@/components/nav-bar"
import "./about.css"

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* <NavBar /> */}
      <div className="about-content">
        <div className="about-card">
          <h1 className="about-title">About FitFreak</h1>
          <p className="about-text">
            FitFreak is your all-in-one fitness tracking solution, designed to help you achieve your health and wellness
            goals. Our platform provides comprehensive tracking for:
          </p>

          <ul className="about-list">
            <li>Daily calorie intake and expenditure</li>
            <li>Sleep duration and quality</li>
            <li>Step counting and activity monitoring</li>
            <li>Water intake tracking</li>
            <li>Weight management</li>
            <li>Workout scheduling and tracking</li>
          </ul>

          <h2 className="about-section-title">Our Mission</h2>
          <p className="about-text">
            We believe that tracking your fitness journey should be simple, intuitive, and motivating. Our goal is to
            provide you with the tools and insights you need to make informed decisions about your health and achieve
            lasting results.
          </p>

          <h2 className="about-section-title">Features</h2>
          <p className="about-text">
            FitFreak offers real-time tracking, personalized goals, detailed analytics, and progress reports to keep you
            motivated and on track. Our user-friendly interface makes it easy to log your daily activities and monitor
            your progress over time.
          </p>
        </div>
      </div>
    </div>
  )
}

