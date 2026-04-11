import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import './RecommendedCourses.css';

function RecommendedCourses() {
  const navigate = useNavigate();

  // Dummy recommendation data with pros and cons
  const recommendations = [
    {
      id: 1,
      title: 'Meta Front-End Developer Professional Certificate',
      platform: 'Coursera',
      duration: '7 Months',
      badge: 'Highly Recommended',
      description: 'Learn React, UI/UX, and JavaScript programming directly from Meta engineers. Great for comprehensive job preparation.',
      pros: [
        'Recognized industry certification from Meta',
        'Includes portfolio-building projects',
        'Excellent foundational concepts'
      ],
      cons: [
        'Time-consuming commitment',
        'Can progress slowly for experienced devs'
      ]
    },
    {
      id: 2,
      title: 'Complete Python Bootcamp From Zero to Hero',
      platform: 'Udemy',
      duration: '22 Hours',
      badge: 'Popular',
      description: 'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      pros: [
        'Very practical, code-along style',
        'Lifetime access with one-time payment',
        'Great community Q&A section'
      ],
      cons: [
        'No official university/tech-giant certification',
        'Some examples feel slightly outdated'
      ]
    },
    {
      id: 3,
      title: 'AWS Certified Cloud Practitioner',
      platform: 'AWS Skill Builder',
      duration: '4 Weeks',
      badge: 'Trending',
      description: 'Get your foundational understanding of AWS Cloud concepts, security, and architecture.',
      pros: [
        'Official course directly from Amazon',
        'Highly sought-after credential by employers',
        'Interactive learning environment'
      ],
      cons: [
        'Exam fee required for the actual certificate',
        'Heavy focus on memorization'
      ]
    }
  ];

  return (
    <div className="recommendations-page">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="rec-hero">
        <div className="rec-header-actions">
          <button className="rec-back-btn" onClick={() => navigate(-1)}>
            <span className="material-icons-round">arrow_back</span>
            Dashboard
          </button>
        </div>
        <span className="rec-eyebrow">Curated Learning</span>
        <h1>Recommended For You</h1>
        <p>Explore curated courses based on your skills and industry trends.</p>
      </div>

      <div className="rec-grid-wrapper">
        <div className="rec-grid">
          {recommendations.map((course) => (
            <div key={course.id} className="rec-card">
              <div className="rec-card-header">
                <span className="rec-badge">{course.badge}</span>
                <span className="rec-platform">{course.platform} • {course.duration}</span>
              </div>
              
              <h2 className="rec-course-title">{course.title}</h2>
              <p className="rec-description">{course.description}</p>
              
              <div className="rec-details">
                <div className="rec-pros">
                  <h4>Pros</h4>
                  <ul>
                    {course.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="rec-cons">
                  <h4>Cons</h4>
                  <ul>
                    {course.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className="rec-enroll-btn">View Course Details &rarr;</button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RecommendedCourses;
