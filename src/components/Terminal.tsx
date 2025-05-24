import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Github, Linkedin, FileText, User, Code, Award, ArrowRight } from 'lucide-react';
import './Terminal.css';
import TerminalOutput from './TerminalOutput';

// Define your content here
const PROFILE_CONTENT = {
  aboutme: {
    role: "Computer Engineering Student (BTech, 2026)",
    description: "Hello I'm Suhani Pugalia, a passionate tech enthusiast pursuing BTech in Computer Engineering from MPSTME NMIMS, Mumbai. I specialize in web development, app design, and machine learning, with a keen interest in building meaningful digital experiences.",
    location: "Mumbai, India",
    email: "suhanipugalia12@gmail.com",
    experience: "Internship experience (others) + multiple project builds (projects)"
  },
  skills: {
    frontend: [
      { name: "Python", level: "●●●●○" },
      { name: "JavaScript", level: "●●●○○" },
      { name: "Tailwind CSS", level: "●●●●○" },
      { name: "Vite", level: "●●●○○" },
      { name: "Flutter", level: "●●○○○" }
    ],
    backend: [
      { name: "Node.js", level: "●●●○○" },
      { name: "Spring Boot", level: "●●●○○" },
      { name: "MySQL", level: "●●●●○" },
      { name: "Firebase", level: "●●○○○" }
    ]
  },
  projects: [
    {
      title: "Mindful Pet Chrome Extension",
      description: "Tamagotchi-style pet that promotes mindful browsing. Built with JS, HTML/CSS, Chrome APIs.",
      tech: ["JavaScript", "Chrome Extension API", "HTML/CSS"],
      code: "https://github.com/jiniyus/mindful-pet"
    },
    {
      title: "Pixi Pomodoro App",
      description: "Desktop app with Pomodoro and workout timers. Developed using Python, Tkinter, and SQLite.",
      tech: ["Python", "Tkinter", "Pillow", "SQLite"],
      code: "https://github.com/jiniyus/pixi"
    },
    {
      title: "Credit Card Fraud Detection",
      description: "ML models to detect fraud using Scikit-learn on imbalanced data.",
      tech: ["Python", "Scikit-learn", "Pandas"],
      code: "https://github.com/suhanipugalia/credit-card-fraud"
    },
    {
      title: "Online Movie Ticket Booking System",
      description: "Microservices-based platform using Spring Boot, Docker, MySQL, Kubernetes, and React.",
      tech: ["Spring Boot", "React", "MySQL", "Docker", "Kubernetes"],
      code: "https://github.com/suhanipugalia/movie-booking"
    }
  ],
  links: {
    github: "https://github.com/jiniyus",
    linkedin: "https://www.linkedin.com/in/suhani-pugalia-801345323/",
    resume: "/SuhaniPugalia_Resume.pdf"
  },
  others: {
    softSkills: [
      "Team Collaboration",
      "Problem Solving",
      "Communication",
      "Time Management",
      "Adaptability",
      "Critical Thinking",
      "Technical Documentation"
    ],
    experiences: [
      {
        title: "App Development Intern",
        company: "Force Power Infotech Pvt Ltd",
        period: "May 2025 – July 2025",
        details: [
          "Collaborated with the mobile development team on internal and client-facing apps.",
          "Improved UI design and implemented interactive components using Android (Java/Kotlin).",
          "Integrated RESTful APIs for real-time data sync and backend communication.",
          "Engaged in testing, debugging, and optimizing performance across devices."
        ]
      },
      {
        title: "App Development Executive",
        organization: "Google Developer Students Club",
        details: [
          "Contributed to the development of MPSTME OnTrack app in a student-led tech team."
        ]
      },
      {
        title: "Subhead, IHC",
        organization: "Taqneeq 15.0, NMIMS Tech Fest",
        details: [
          "Led a 15-member team, coordinated planning and execution of tech events."
        ]
      }
    ]
  }
};


const COMMANDS = {
  help: "Show available commands",
  clear: "Clear the terminal",
  aboutme: "Display my identity",
  skills: "Show my technical skills",
  projects: "List my featured projects",
  others: "Show my management/soft skills",
  linkedin: "Open my LinkedIn profile",
  github: "Open my GitHub profile",
  resume: "Download my resume"
};

// Define command aliases
const ALIASES: Record<string, string> = {
  h: "help",
  cls: "clear",
  r: "resume",
  ln: "linkedin",
  gh: "github"
};

const Terminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<JSX.Element[]>([getWelcomeMessage()]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Focus on input field when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

 
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    
    if (trimmedInput) {
      // Add to command history
      setCommandHistory(prev => [trimmedInput, ...prev]);
      setHistoryIndex(-1);
      
      // Display command in output
      const newOutput = [...output, (
        <div key={output.length} className="terminal-command">
          <span className="prompt">λ</span> {trimmedInput}
        </div>
      )];
      
      // Process the command
      const commandResult = processCommand(trimmedInput);
      
      // Update output with command result
      setOutput([...newOutput, commandResult]);
    }
    
    // Clear input field
    setInput("");
  };

  // Process input command and return appropriate output
  const processCommand = (cmd: string): JSX.Element => {
    const [command, ...args] = cmd.toLowerCase().split(' ');
    
    // Check for aliases
    const resolvedCommand = ALIASES[command] || command;
    
    switch (resolvedCommand) {
      case 'help':
        return getHelpOutput();
      
      case 'clear':
        setTimeout(() => setOutput([getWelcomeMessage()]), 0);
        return <></>;
      
      case 'aboutme':
        return getaboutmeOutput();
      
      case 'skills':
        return getSkillsOutput();
      
      case 'projects':
        return getProjectsOutput();
      
      
      case 'others':
        return getOthersOutput();
      
      case 'linkedin':
        window.open(PROFILE_CONTENT.links.linkedin, '_blank');
        return (
          <div className="terminal-output">
            <p>Opening LinkedIn profile in a new tab...</p>
          </div>
        );
      
      case 'github':
        window.open(PROFILE_CONTENT.links.github, '_blank');
        return (
          <div className="terminal-output">
            <p>Opening GitHub profile in a new tab...</p>
          </div>
        );
      
      case 'resume': 
        const link = document.createElement('a');
        link.href = PROFILE_CONTENT.links.resume;
        link.download = 'SuhaniPugalia_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return (
          <div className="terminal-output">
            <p>Downloading resume...</p>
          </div>
        );
      
      default:
        return (
          <div className="terminal-output error">
            <p>Command not found: {cmd}</p>
            <p>Type <span className="highlight">help</span> to see available commands.</p>
          </div>
        );
    }
  };

  // Handle keyboard navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  // Handle tab completion
  const handleTabCompletion = () => {
    const currentInput = input.toLowerCase();
    
    if (currentInput) {
      // Find commands that start with the current input
      const matchingCommands = Object.keys(COMMANDS)
        .filter(cmd => cmd.startsWith(currentInput));
      
      // Find aliases that start with the current input
      const matchingAliases = Object.keys(ALIASES)
        .filter(alias => alias.startsWith(currentInput));
      
      // Combine and remove duplicates
      const allMatches = [...new Set([...matchingCommands, ...matchingAliases])];
      
      if (allMatches.length === 1) {
        // If there's only one match, complete the command
        setInput(allMatches[0]);
      } else if (allMatches.length > 1) {
        // If there are multiple matches, show them as suggestions
        const suggestions = (
          <div key={output.length} className="terminal-output">
            <p>Available commands:</p>
            <div className="suggestions">
              {allMatches.map(match => (
                <span key={match} className="suggestion">{match}</span>
              ))}
            </div>
          </div>
        );
        
        setOutput([
          ...output,
          <div key={output.length} className="terminal-command">
            <span className="prompt">λ</span> {currentInput}
          </div>,
          suggestions
        ]);
      }
    }
  };

  return (
    <div 
      className="terminal-container" 
      onClick={handleTerminalClick} 
      ref={terminalRef}
    >
      <div className="terminal-header">
        <div className="terminal-controls">
          <div className="control close"></div>
          <div className="control minimize"></div>
          <div className="control maximize"></div>
        </div>
        <div className="terminal-title">
          <TerminalIcon size={16} />
          <span>suhanip@portfolio:~</span>
        </div>
      </div>
      
      <div className="terminal-body" ref={terminalRef}>

        {output}
        
        <form onSubmit={handleSubmit} className="terminal-form">
          <div className="input-wrapper">
            <span className="prompt">λ</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              aria-label="Terminal command input"
            />
          </div>
        </form>
      </div>
      
      <div className="scan-lines"></div>
      <div className="terminal-glow"></div>
    </div>
  );
};

function getWelcomeMessage(): JSX.Element {
  return (
    <div key="welcome" className="terminal-output welcome">
      <div className="welcome-title">
        <h1>Welcome to My Portfolio</h1>
        <p className="subtitle">Terminal v1.0.0</p>
      </div>
      <p>Type <span className="highlight">help</span> to see available commands.</p>
    </div>
  );
}

function getHelpOutput(): JSX.Element {
  return (
    <div className="terminal-output">
      <h2>Available Commands:</h2>
      <div className="command-list">
        {Object.entries(COMMANDS).map(([cmd, desc]) => (
          <div key={cmd} className="command-item">
            <span className="command-name">{cmd}</span>
            <span className="command-desc">- {desc}</span>
          </div>
        ))}
      </div>
      <p className="help-note">Use Tab for command completion and Arrow keys for command history.</p>
    </div>
  );
}

function getaboutmeOutput(): JSX.Element {
  const { role, description, location, email, experience } = PROFILE_CONTENT.aboutme;
  return (
    <div className="terminal-output">
      <h2>
        <User size={18} className="icon" />
        <span>About Me</span>
      </h2>
      <div className="profile-content">
        <p className="role">{role}</p>
        <p className="description">{description}</p>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Experience:</span>
            <span className="detail-value">{experience}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSkillsOutput(): JSX.Element {
  const { frontend, backend } = PROFILE_CONTENT.skills;
  return (
    <div className="terminal-output">
      <h2>
        <Code size={18} className="icon" />
        <span>Technical Skills</span>
      </h2>
      <div className="skills-grid">
        <div className="skill-category">
          <h3>Frontend</h3>
          <ul className="skill-list">
            {frontend.map(skill => (
              <li key={skill.name}>
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="skill-category">
          <h3>Backend</h3>
          <ul className="skill-list">
            {backend.map(skill => (
              <li key={skill.name}>
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">{skill.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getProjectsOutput(): JSX.Element {
  return (
    <div className="terminal-output">
      <h2>
        <Code size={18} className="icon" />
        <span>Featured Projects</span>
      </h2>
      <div className="projects-list">
        {PROFILE_CONTENT.projects.map(project => (
          <div key={project.title} className="project-item">
            <div className="project-header">
              <h3>{project.title}</h3>
              <div className="project-links">
                <a href={project.code} className="project-link">Code</a>
              </div>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tech.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function getOthersOutput(): JSX.Element {
  const { softSkills, experiences } = PROFILE_CONTENT.others;

  return (
    <div className="terminal-output">
      <h2>
        <User size={18} className="icon" />
        <span>Other Skills & Experiences</span>
      </h2>

      <h3>Soft Skills</h3>
      <ul className="others-list">
        {softSkills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h3 style={{ marginTop: '1rem' }}>Experiences</h3>
      <div className="experiences-list">
        {experiences.map((exp, idx) => (
          <div key={idx} className="experience-item" style={{ marginBottom: '1.5rem' }}>
            <strong>{exp.title}</strong>
            <p>{exp.company || exp.organization}</p>
            {exp.period && <p><em>{exp.period}</em></p>}
            <ul>
              {exp.details.map((detail, i) => (
                <li key={i}>➜ {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}




export default Terminal;