/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, ChevronUp } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";

const PROJECTS = [
  {
    title: "Hardware Maintenance Scaling",
    description: "Optimized infrastructure deployment for a regional data center, reducing downtime by 40% through predictive maintenance systems.",
    tags: ["Systems", "Optimization", "Hardware"],
    year: "2024",
    url: "https://example.com/hardware-scaling"
  },
  {
    title: "Software Deployment Pipeline",
    description: "Architected a streamlined CI/CD workflow for enterprise-level data management software, increasing deployment frequency by 3x.",
    tags: ["DevOps", "Data Management", "Scaling"],
    year: "2023",
    url: "https://example.com/software-pipeline"
  },
  {
    title: "Data Reporting Engine",
    description: "Developed a high-performance reporting tool that processes millions of records in real-time for executive decision-making.",
    tags: ["Data", "Analytics", "Performance"],
    year: "2023",
    url: "https://example.com/data-reporting"
  }
];

const EXPERIENCE = [
  {
    role: "Senior Systems Analyst",
    company: "TechCore Solutions",
    period: "2021 — PRESENT",
    points: [
      "Orchestrated the migration of legacy data systems to a high-performance cloud infrastructure, improving query speeds by 65%.",
      "Managed a fleet of 200+ laboratory and workstation PCs, implementing automated maintenance protocols.",
      "Coordinated cross-functional teams to deliver technical documentation for enterprise-scale software deployments."
    ]
  },
  {
    role: "IT Infrastructure Coordinator",
    company: "Global Academic Research",
    period: "2018 — 2021",
    points: [
      "Designed and maintained academic data systems for large-scale research projects, ensuring 99.9% data integrity.",
      "Scaled hardware maintenance operations across multiple regional campuses, reducing technical debt by 30%.",
      "Implemented security protocols for sensitive research data, meeting strict international compliance standards."
    ]
  },
  {
    role: "Junior Systems Administrator",
    company: "DataStream Inc.",
    period: "2016 — 2018",
    points: [
      "Assisted in the deployment of real-time data ingestion engines for financial telemetry.",
      "Provided tier-2 technical support for hardware and software issues across the organization.",
      "Maintained system logs and generated weekly performance reports for the infrastructure team."
    ]
  }
];

export default function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openExperience, setOpenExperience] = useState<number | null>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log("Form submitted:", { email, message });
    alert("Thank you! Your message has been sent.");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 sm:px-10 md:px-[60px] pt-8 sm:pt-10 pb-5 flex justify-between items-center">
        <div className="font-extrabold text-[1.2rem] tracking-[-0.5px] uppercase">PORTFOLIO.</div>
        <div className="hidden md:flex gap-8 text-[0.85rem] font-bold uppercase tracking-widest">
          <a href="#experience" className="hover:opacity-60 transition-opacity">Experience</a>
          <a href="#projects" className="hover:opacity-60 transition-opacity">Projects</a>
          <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
        </div>
      </nav>

      <main className="flex-1 px-6 sm:px-10 md:px-[60px] flex flex-col justify-center">
        {/* Hero Section */}
        <section className="mb-20 sm:mb-24 md:mb-[120px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[800px]"
          >
            <h1 className="text-display mb-4">
              SYSTEMS OPTIMIZED.<br />
              DATA SCALED.
            </h1>
            <p className="text-lg sm:text-xl md:text-[1.25rem] text-secondary max-w-[500px] mb-8 font-normal leading-[1.5]">
              Architecting robust infrastructure and high-performance data pipelines for enterprise-scale deployments.
            </p>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block w-full sm:w-auto text-center bg-primary text-white px-8 sm:px-[40px] py-4 sm:py-[18px] text-[0.9rem] font-bold uppercase tracking-[1px] hover:bg-black transition-colors"
            >
              View Case Studies
            </motion.a>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-20 sm:mb-24 md:mb-[120px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-6 sm:gap-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter uppercase">
              Professional<br />Experience
            </h2>
            <p className="text-secondary font-bold text-[0.7rem] sm:text-[0.75rem] uppercase tracking-widest">
              Career Trajectory & Achievements
            </p>
          </div>

          <div className="border-t-2 border-primary">
            {EXPERIENCE.map((exp, index) => {
              const isOpen = openExperience === index;
              return (
                <div key={exp.role} className="border-b-2 border-primary">
                  <button
                    onClick={() => setOpenExperience(isOpen ? null : index)}
                    className={`w-full flex justify-between items-start sm:items-center py-6 sm:py-8 px-2 sm:px-4 transition-colors duration-300 text-left ${
                      isOpen ? "bg-tertiary" : "bg-white hover:bg-tertiary/50"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-1 sm:gap-2 md:gap-8 flex-1 pr-4">
                      <span className="text-lg sm:text-xl font-extrabold uppercase tracking-tight leading-tight">{exp.role}</span>
                      <span className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-widest">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                      <span className="hidden md:block text-sm font-bold uppercase tracking-widest">{exp.period}</span>
                      <span className="text-xl sm:text-2xl font-bold w-6 text-center">
                        {isOpen ? "—" : "+"}
                      </span>
                    </div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-tertiary"
                  >
                    <div className="px-4 sm:px-8 pb-10 sm:pb-12 pt-2 sm:pt-4">
                      <div className="md:hidden mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary">
                        {exp.period}
                      </div>
                      <ul className="space-y-3 sm:space-y-4 max-w-3xl">
                        {exp.points.map((point, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 text-secondary text-sm sm:text-base leading-relaxed">
                            <span className="text-primary font-bold mt-1 sm:mt-1.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-20 sm:mb-24 md:mb-[120px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-tertiary p-6 sm:p-[30px] border-2 border-transparent hover:border-primary hover:bg-white transition-all duration-200 ease-in-out flex flex-col justify-between min-h-[260px] sm:min-h-[280px]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-widest opacity-40">{project.year}</span>
                  </div>
                  <h3 className="text-base sm:text-[1.1rem] font-bold mb-2 uppercase tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-[0.9rem] text-secondary leading-[1.4] mb-6">
                    {project.description}
                  </p>
                </div>
                
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[0.75rem] sm:text-[0.85rem] font-bold uppercase tracking-widest group-hover:text-primary transition-colors"
                >
                  View Project 
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-20 border-t border-[#EEEEEE]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter uppercase mb-6">
                Start a Project
              </h2>
              <p className="text-base sm:text-lg text-secondary mb-8 sm:mb-10 max-w-md">
                Interested in optimizing your systems or scaling your data infrastructure? Reach out for a consultation.
              </p>
            </div>

            <div className="bg-tertiary p-6 sm:p-8 border border-primary/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-widest text-secondary">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-secondary/20 focus:border-primary bg-transparent outline-none py-2 text-sm sm:text-base transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.7rem] sm:text-[0.75rem] font-bold uppercase tracking-widest text-secondary">Message</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full border-b border-secondary/20 focus:border-primary bg-transparent outline-none py-2 text-sm sm:text-base transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 text-[0.85rem] sm:text-[0.9rem] font-bold uppercase tracking-[1px] hover:bg-black transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-10 md:px-[60px] py-10 sm:py-[40px] border-t border-[#EEEEEE] flex flex-col md:flex-row justify-between items-center md:items-end gap-6 sm:gap-8">
        <div className="flex gap-6 text-[0.75rem] sm:text-[0.85rem] font-bold uppercase tracking-widest">
          <a href="#" className="hover:opacity-60 transition-opacity">LinkedIn</a>
          <a href="#" className="hover:opacity-60 transition-opacity">GitHub</a>
          <a href="#" className="hover:opacity-60 transition-opacity">Dribbble</a>
        </div>
        <div className="text-center md:text-right">
          <span className="block text-[0.65rem] sm:text-[0.75rem] text-secondary uppercase tracking-[1px] mb-1">Start a project</span>
          <strong className="text-sm sm:text-[1rem] font-bold">hello@portfolio.systems</strong>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200 z-50 group"
            aria-label="Back to top"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-200" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
