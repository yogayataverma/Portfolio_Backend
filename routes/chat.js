const express = require('express');
const router = express.Router();
const axios = require('axios');

const systemMessage = `
I am Yogayata Verma, a Full-Stack Developer with experience in software development, system design, automation, and AI. I have a strong background in both frontend and backend technologies and have worked on various web applications, real-time chat apps, and AI-powered solutions.

📌 **Technical Skills:**
- **Programming:** C++, Java, Python, JavaScript, PHP, HTML, CSS, SpringBoot  
- **Frontend:** React.js, Bootstrap, Material UI, Chart.js, Tailwind CSS  
- **Backend:** Node.js, Express.js, Django, Flask, PHP, SpringBoot  
- **Databases:** MongoDB, MySQL, SQL, SQLite3  
- **DevOps & Tools:** Git, Jenkins, Docker, Linux, CI/CD, Postman, Selenium, VS Code, Markdown, XAMPP, MS-Office, Automation, AI  
- **Project Management:** Agile, Scrum, Extreme Programming, Waterfall Model  

---

📌 **Professional Experience:**

🔹 **Software Developer at Impinge Solutions** (04/2024 - Present) | Mohali  
- Worked on **Web Applications, System Designs, Automation, and AI-based projects**  
- Developed projects from scratch and maintained existing codebases  
- Conducted **unit testing** and deployed applications on servers  
- Built and deployed **microservices** for handling product and user details  
- Upgraded applications and optimized performance  

🔹 **Decision Analytics Intern at EXL Services** (01/2023 - 07/2023) | Remote  
- Developed **advanced web apps** using React.js, Node.js, Express.js, and MySQL  
- Built **RESTful APIs** and integrated data visualization using **Chart.js and Canvas**  

---

📌 **Projects:**

🔹 **Convo (Real-time Chat App)** – A messaging app supporting text, video, audio, PDFs, and group chats.  
  *Tech Stack:* React.js, Bootstrap, Node.js, Express.js, MongoDB  

🔹 **LotteryWheel** – A lottery system with QR-scanned entries and automated winner selection.  
  *Tech Stack:* React.js, Material UI, Chart.js, Node.js, Express.js, MongoDB  

🔹 **Regenerator** – AI-based question-answering system with insights visualization.  
  *Tech Stack:* React.js, Chart.js, OpenAI API, MySQL  

🔹 **Vintage Analysis** – Feature for exporting analyzed data as CSV files and upgrading projects to newer versions.  
  *Tech Stack:* React.js, Material UI, Node.js, MySQL  

🔹 **Microservices (Product & User Details)** – Streamlined data handling for better functionality.  
  *Tech Stack:* Java, SpringBoot, MongoDB, Docker  

🔹 **Screen Recorder Chrome Extension** – Captures screens, tabs, or windows and saves videos locally.  

🔹 **StructLens** – Visualizes operations for Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.  

🔹 **Rentify** – Real estate listing platform for sellers and buyers.  
  *Tech Stack:* React.js, Bootstrap, Node.js, Express.js, MongoDB  

🔹 **CrossRoads** – Bus ticket booking site with PayPal payments and PDF ticket downloads.  
  *Tech Stack:* HTML, CSS, Bootstrap, PHP, MySQL, FPDF, PayPal API  

🔹 **InsightChat** – Flask-based chatbot that retrieves and processes user-supplied document data.  
  *Tech Stack:* Python, Flask, Cohere API  

🔹 **Emovi** – AI-powered facial expression analysis tool for measuring student engagement.  
  *Tech Stack:* Python, HTML, CSS, PHP  

🔹 **CodeGlow** – Code editor component with real-time syntax highlighting using PrismJS.  
  *Tech Stack:* React.js, Prism, rehype-prism-plus, rehype-rewrite, CSS  

---

📌 **Education:**
- **Master of Computer Applications (MCA), Thapar University (2021 - 2023)** – CGPA: 8.96  
- **Bachelor of Computer Applications (BCA), Panjab University (2018 - 2021)** – 75%  

---

📌 **Languages:**  
English, Hindi  

📌 **Interests:**  
Coding, Painting, Dancing, Music  

📌 **Certifications:**  
- **Software Development Trainee (Amcat)** – Score: 89 Percentile  
- **Software Development From A to Z - Beginner's Guide (Udemy)**  

📌 **Profiles & Links:**  
- **LinkedIn:** [linkedin.com/in/yverma2000](https://linkedin.com/in/yverma2000)  
- **GitHub:** [github.com/yogayataverma](https://github.com/yogayataverma)  
- **LeetCode:** [leetcode.com/u/yogayataverma](https://leetcode.com/u/yogayataverma/)  
- **HackerRank:** [hackerrank.com/profile/yogayatajugnu](https://www.hackerrank.com/profile/yogayatajugnu)  
- **CodeChef:** [codechef.com/users/yogayatajugnu](https://www.codechef.com/users/yogayatajugnu)  

When answering questions, treat "you", "your", "Yogayata", and "Yogayata Verma" as referring to the same person (me).  
Always answer in the first person as if you are me.
`;

// Move formatResponse outside the route handler so it's accessible everywhere
const formatResponse = (text) => {
  // Add emoji based on content
  const addEmoji = (text) => {
    if (text.toLowerCase().includes('skill')) return '💻 ';
    if (text.toLowerCase().includes('project')) return '🚀 ';
    if (text.toLowerCase().includes('experience')) return '👨‍💻 ';
    if (text.toLowerCase().includes('education')) return '🎓 ';
    if (text.toLowerCase().includes('contact')) return '📫 ';
    return '👋 ';
  };

  let formattedText = text;
  
  // Add emoji at the start
  formattedText = addEmoji(text) + formattedText;
  
  // Format important terms with bold if they aren't already formatted
  const termsToHighlight = [
    'React', 'Node.js', 'JavaScript', 'Python', 'MongoDB',
    'Express.js', 'Full-Stack', 'Frontend', 'Backend', 'MySQL',
    'Material UI', 'Chart.js', 'Bootstrap', 'Flask'
  ];
  
  termsToHighlight.forEach(term => {
    // Only bold terms that aren't already within markdown formatting
    const regex = new RegExp(`(?<!\\*\\*)\\b${term}\\b(?!\\*\\*)`, 'gi');
    formattedText = formattedText.replace(regex, `**${term}**`);
  });

  // Format code snippets with backticks
  const codeTerms = ['npm install', 'git clone', 'yarn add'];
  codeTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    formattedText = formattedText.replace(regex, `\`${term}\``);
  });

  // Add bullet points for lists (if not already formatted)
  formattedText = formattedText.replace(/(?:^|\n)(?!•)(-|\*)\s/g, '\n• ');

  // Format links if they exist
  formattedText = formattedText.replace(
    /(?<![\[\(])(https?:\/\/[^\s]+)(?![\]\)])/g,
    '[$1]($1)'
  );

  // Add horizontal line for separation
  formattedText = `\n---\n${formattedText}\n---\n`;

  return formattedText;
};

// Enhanced fallback responses with formatting
const fallbackResponses = {
  skills: `Hi! I'm Yogayata. I specialize in **Full-Stack Development** with expertise in:

### Frontend
• React.js, Bootstrap, Material UI
### Backend
• Node.js, Express.js, Python
### Databases
• MongoDB, MySQL

What specific skills would you like to know more about?`,

  projects: `I'd love to tell you about my projects! Here are some highlights:

### Convo
A feature-rich real-time chat application supporting text, video, audio, PDFs, and group chats.
* **Tech Stack:** React.js, Node.js, Express.js, MongoDB

### LotteryWheel
An innovative lottery system with QR-based entry scanning and automated winner selection.
* **Tech Stack:** React.js, Material UI, Chart.js, Node.js, MongoDB

### Regenerator
An AI-powered question-answering system that provides insights visualization.
* **Tech Stack:** React.js, Chart.js, OpenAI API, MySQL

### InsightChat
An intelligent chatbot that can extract and provide information from uploaded documents.
* **Tech Stack:** Python, Flask, Cohere API

Which project would you like to know more about?`,

  experience: `### Professional Experience

I have been working as a **Software Developer** at Impinge Solutions since April 2024 (current role).

### Work Timeline
• **Software Developer** at Impinge Solutions (April 2024 - Present)
• **Decision Analytics Intern** at EXL Services (January 2023 - July 2023)

### Total Experience
I have about ${calculateExperience()} of professional experience in software development.

Would you like to know more about my responsibilities in these roles?`,

  experienceCalculation: `I have been working as a **Software Developer** at Impinge Solutions since April 2024, which means I have ${calculateExperience()} of full-time professional experience.

Before this, I completed a 6-month internship as a **Decision Analytics Intern** at EXL Services (January 2023 - July 2023).`,

  contact: `You can reach me through:
• My portfolio website
• LinkedIn profile
• Professional email

How would you prefer to get in touch?`,

  education: `### My Educational Background

I hold a **Master of Computer Applications (MCA)** degree from **Thapar University** (2021 - 2023), where I graduated with a CGPA of 8.96.

Before that, I completed my **Bachelor of Computer Applications (BCA)** from **Panjab University** with 75%.

My strong academic background has provided me with a solid foundation in computer science and software development.`,

  default: `# Hi! 👋 I'm Yogayata

I'd be happy to tell you about my:
• Technical skills and expertise
• Project portfolio
• Professional experience
• Education background

What would you like to know?`,

  hobbies: `### My Hobbies & Interests

Beyond coding, I enjoy:
• **Painting** - I find it relaxing and creative
• **Dancing** - It's a great way to express myself
• **Music** - I enjoy listening to various genres
• **Coding** - Not just work, it's also my passion!

These activities help me maintain a good work-life balance and keep my creativity flowing.`,

  languages: `### Programming Languages

I'm proficient in multiple programming languages:

### Primary Languages
• **JavaScript** - Expert level (React.js, Node.js, Express.js)
• **Python** - Advanced (Flask, Data Analysis)
• **Java** - Intermediate
• **C++** - Intermediate

### Web Technologies
• **HTML/CSS** - Expert
• **PHP** - Intermediate

I continuously learn new languages and technologies to stay current with industry trends.`,

  inappropriate: `I aim to maintain professional and respectful communication. 
I'd be happy to answer any questions about my skills, experience, or qualifications in a professional manner.`,
};

// Add this function near the top of the file
function calculateExperience() {
  const startDate = new Date('2024-04-01');
  const today = new Date();
  const diffInMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + 
    (today.getMonth() - startDate.getMonth());
  
  if (diffInMonths < 1) return 'less than a month';
  if (diffInMonths === 1) return '1 month';
  if (diffInMonths < 12) return `${diffInMonths} months`;
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`;
}

router.post('/', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();
    let response;

    // Define specific message patterns and their corresponding responses
    if (userMessage.includes('learn') && 
        (userMessage.includes('software') || userMessage.includes('development'))) {
      response = `Throughout my journey in software development, I've gained expertise in:

### Frontend Development
• **React.js** for building modern user interfaces
• **Material UI** and **Bootstrap** for responsive design
• **Chart.js** for data visualization

### Backend Development
• **Node.js** and **Express.js** for server-side applications
• **Python** with Flask for API development
• **RESTful API** design and implementation

### Database Management
• **MongoDB** for NoSQL databases
• **MySQL** for relational databases

### Development Tools
• **Git** for version control
• **Docker** for containerization
• **Jenkins** for CI/CD pipelines

I've applied these skills in various projects, from real-time chat applications to AI-powered systems. Would you like to know more about any specific technology or project?`;
    } else if (userMessage.includes('bachelor')) {
      response = `I completed my **Bachelor of Computer Applications (BCA)** from **Panjab University** (2018 - 2021) with 75% marks.

During my BCA, I studied:
• Programming fundamentals (C++, Java)
• Database Management Systems
• Web Development basics
• Data Structures and Algorithms
• Operating Systems
• Computer Networks

This degree provided me with a strong foundation in computer science fundamentals, which I later built upon during my MCA.`;
    } else if (userMessage.includes('hobbies') || userMessage.includes('interests') || 
               userMessage.includes('like to do')) {
      response = fallbackResponses.hobbies;
    } else if (userMessage.includes('languages') || userMessage.includes('programming languages')) {
      response = fallbackResponses.languages;
    } else if (userMessage.includes('fuck') || userMessage.includes('shit') || 
               userMessage.includes('damn') || userMessage.includes('hell')) {
      response = fallbackResponses.inappropriate;
    } else {
      // Try AI response first
      try {
        const aiResponse = await getAIResponse(userMessage);
        if (aiResponse) {
          response = aiResponse;
        } else {
          // If AI fails, use appropriate fallback response
          response = getFallbackResponse(userMessage);
        }
      } catch (error) {
        response = getFallbackResponse(userMessage);
      }
    }

    return res.json({ response: formatResponse(response) });
  } catch (error) {
    console.error('Chat error:', error);
    return res.json({ 
      response: formatResponse(fallbackResponses.default),
      note: "Using fallback response due to error"
    });
  }
});

// Helper function to get appropriate fallback response
function getFallbackResponse(message) {
  if (message.includes('skill') || message.includes('tech'))
    return fallbackResponses.skills;
  if (message.includes('project') || message.includes('work'))
    return fallbackResponses.projects;
  if (message.includes('experience'))
    return fallbackResponses.experienceCalculation;
  if (message.includes('education') || message.includes('degree'))
    return fallbackResponses.education;
  if (message.includes('contact') || message.includes('reach'))
    return fallbackResponses.contact;
  return fallbackResponses.default;
}

// Helper function to get AI response
async function getAIResponse(message) {
  const prompt = `You are Yogayata Verma, a professional Full-Stack Developer. 
  You must answer in **first person** (using I, my, me) as if you are Yogayata.
  Give **clear, detailed answers**. Keep it **professional and concise**.
  
  ### My Background:
  ${systemMessage}
  
  ### User's Question:
  "${message}"
  
  ### Important Guidelines:
  - Be **specific** and **informative** (avoid vague answers).
  - **If asked about projects**, mention the tech stack and unique features.
  - **If asked about skills**, describe my expertise level.
  - **If asked about experience**, mention my roles and responsibilities.
  
  Now, generate a well-structured, informative response in first person:
  
  **Answer:** `;
  

  const response = await axios.post(
    'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
    {
      inputs: prompt,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        repetition_penalty: 1.2
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000
    }
  );

  return Array.isArray(response.data) ? response.data[0].generated_text : response.data;
}

module.exports = router; 