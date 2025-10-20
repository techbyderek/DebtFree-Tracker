<div align="center">

# 💰 DebtFree Tracker

### AI-Powered Debt Management Web Application

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://www.netlify.com/)

**Take control of your finances. Track debts, get smart payment recommendations, and build savings.**

</div>

---

## 📖 About

**DebtFree Tracker** is a full-featured web application that helps users manage multiple debts with AI-powered payment strategies. Built with vanilla JavaScript and integrated with Google Gemini AI, it provides personalized financial recommendations to help users become debt-free faster.

### Why DebtFree Tracker?

- 🎯 **Smart Prioritization** - AI analyzes your debts and suggests optimal payment strategies
- 💰 **Budget Friendly** - Automatically calculates available funds after savings
- 📊 **Clear Overview** - Visual dashboard shows your complete financial picture
- 🔒 **Privacy First** - All data stored locally in your browser
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Smart Onboarding
- Multi-step guided setup
- Income & savings configuration
- Pay frequency scheduling
- Progress tracking

</td>
<td width="50%">

### 💳 Debt Management
- Add/Edit/Delete debts
- Track amounts & due dates
- Budget validation warnings
- Full CRUD operations

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI Recommendations
- Google Gemini integration
- Personalized strategies
- Priority-based ordering
- Intelligent fallback system

</td>
<td width="50%">

### 📊 Financial Dashboard
- Real-time summary
- Monthly breakdown
- Balance calculator
- Payday tracking

</td>
</tr>
</table>

---

## 🛠️ Built With

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: Google Gemini AI API
- **Storage**: LocalStorage API
- **Functions**: Netlify Serverless Functions
- **Deployment**: Netlify
- **Version Control**: Git & GitHub

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code recommended)
- Git installed on your machine
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/debtfree-tracker.git
   cd debtfree-tracker
```

2. **Create your config file**
```bash
   cp config.example.js config.js
```

3. **Add your API key**
   
   Open `config.js` and replace with your actual Gemini API key:
```javascript
   export const GEMINI_API_KEY = 'your-actual-api-key-here';
```

4. **Open in browser**
   
   Simply open `index.html` in your browser or use a local server:
```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
```

5. **Visit** `http://localhost:8000`

---

## 📱 Usage

### 1️⃣ Create Your Account
Start by creating your profile with basic information.

### 2️⃣ Complete Onboarding
- Enter your monthly income
- Set your pay frequency and next payday
- Choose your savings percentage (10-20% recommended)

### 3️⃣ Add Your Debts
- Click "Add Debt" to start tracking
- Enter debt name, amount, minimum payment, and due date
- Edit or delete debts anytime

### 4️⃣ Get AI Recommendations
- Navigate to "Payment Plans" section
- AI analyzes your financial situation
- Receive personalized debt repayment strategies

### 5️⃣ Track Your Progress
Monitor your financial health through the dashboard sidebar.

---

## 📂 Project Structure
```
debtfree-tracker/
├── 📁 blog/
│   └── blog.css                 # Blog-specific styles
├── 📄 .gitignore                # Git ignore rules
├── 📄 config.example.js         # API key template
├── 📄 index.html                # Main HTML file
├── 📄 netlify.toml              # Netlify configuration
├── 📄 README.md                 # You are here!
├── 📄 script.js                 # Main JavaScript logic
└── 📄 styles.css                # Main stylesheet
```

---

## 🗺️ Roadmap

- [x] Core debt tracking functionality
- [x] AI-powered payment recommendations
- [x] Responsive design
- [x] Blog integration

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔒 Security

- **Never commit `config.js`** - This file contains your API key
- API keys are secured via Netlify Functions
- All data stored locally in browser (no server-side storage)

---

## 📝 License

This project is part of the Bootcamp

---

## 👤 Author

**Derek Rolon**

---

## 🙏 Acknowledgments

- [Uplift Code Camp](https://uplift.codes/) - Batch 27
- [Google Gemini AI](https://ai.google.dev/) - AI Integration
- [Netlify](https://netlify.com) - Hosting & Serverless Functions
- Inspiration from modern fintech applications

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Derek Rolon](https://github.com/techbyderek)

[Back to top ↑]

</div>****
