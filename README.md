# 🎓 MBA Eligify — From Score to B-School
![Python](https://img.shields.io/badge/Python-3.11-blue) ![Flask](https://img.shields.io/badge/Flask-3.1.3-green) ![Pandas](https://img.shields.io/badge/Pandas-3.0.1-orange) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Status](https://img.shields.io/badge/Status-Live-brightgreen)

An AI-assisted MBA college eligibility platform that converts your CAT score and category into a personalized, ranked list of eligible B-Schools — instantly.

🌐 **Live Demo:** https://mba-eligify.onrender.com

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Dataset](#-dataset)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Team](#-team)

---

## 📖 About the Project

Every year, over **300,000 students** appear for CAT in India. After results, identifying eligible colleges is a nightmare — students must manually check cutoffs for 70+ colleges across 5 reservation categories, compare fees, placements, ROI, and NIRF rankings one by one.

**MBA Eligify solves this problem** by automatically matching your CAT percentile and category against a curated database of 70 top Indian B-Schools. The system:

- Filters colleges where your CAT percentile meets the category-specific cutoff
- Ranks eligible colleges by **ROI Score** (Best Package / Fees)
- Displays comprehensive college profiles with **20+ data points**
- Supports all **5 reservation categories** — General, EWS, OBC, SC, ST

All in real time — converting a simple 5-field form into a comprehensive, ranked, filterable MBA admission guide.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 Eligibility Checker | Filters 70 colleges instantly based on CAT percentile + category |
| 📊 ROI-Based Ranking | Ranks colleges by Average Package / Fees for best value |
| 🏫 College Detail Modal | 20+ attributes per college including NIRF rank, fees, packages |
| 🔍 Live Search & Filter | Search by name/city, filter by tier, sort by multiple criteria |
| 📋 CAT Cutoffs Table | Category-wise cutoffs (General/EWS/OBC/SC/ST) per college |
| 🎓 Scholarship Info | Scholarship availability and types for each institution |
| 🌐 Official Website Links | Direct links to college websites for further research |
| 📱 Responsive Design | Works on desktop, tablet, and mobile devices |

---

## 🎬 Demo

**Eligibility Check Page**

Enter your profile and click **Find My Colleges**

```
Input:
  Name          →  Vivek Pathak
  12th %        →  85
  CAT Percentile→  92.5
  Category      →  General

Output:
  42 Colleges Found  →  Sorted by Best ROI
  
  IIM Ahmedabad   |  Tier 1  |  Fees: ₹25L  |  Pkg: ₹22L  |  ROI: 0.88
  IIM Bangalore   |  Tier 1  |  Fees: ₹24L  |  Pkg: ₹22L  |  ROI: 0.92
  NIT Trichy MBA  |  Tier 2  |  Fees: ₹3L   |  Pkg: ₹12L  |  ROI: 4.00
  ...
```

**College Detail Modal**
```
IIM Ahmedabad
  Fees           →  ₹25 Lakhs
  Avg Package    →  ₹22 LPA
  Highest Pkg    →  ₹80 LPA
  NIRF Rank      →  1
  Placement %    →  100%
  ROI Score      →  0.880
  Specializations→  Finance, Consulting, Strategy, Business Analytics
  CAT Cutoffs    →  General:99 | EWS:97 | OBC:95 | SC:85 | ST:75
  Scholarship    →  Yes — Need-based, Merit, Govt SC/ST/OBC/EWS
  Website        →  https://www.iima.ac.in
```

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript (ES6)
- Google Fonts — Playfair Display + DM Sans
- Custom premium dark/light UI with animations

### Backend
- **Python 3.11**
- **Flask 3.1.3** — Web framework + REST API
- **Pandas 3.0.1** — Data filtering, sorting, DataFrame processing
- **OpenPyXL 3.1.5** — Excel dataset reading

### Deployment
- **Git / GitHub** — Version control (Pathak0806/mba-eligify)
- **Render** — Free cloud deployment with GitHub CI/CD

---

## 📊 Dataset

| File | Description | Records |
|---|---|---|
| `CatScore_MBA_Dataset.xlsx` | 70 top Indian MBA colleges with 30 attributes | 70 |

### Columns Included
| Category | Columns |
|---|---|
| Identity | college_name, city, state, country |
| CAT Cutoffs | CAT_General, CAT_EWS, CAT_OBC, CAT_SC, CAT_ST |
| Financials | Fees (Lakhs), Avg Package (LPA), Highest Package (LPA) |
| Performance | Placement %, roi_score, tier, ownership_type |
| Rankings | nirf_applicable, nirf_2025_management_rank |
| Programs | specializations, program_duration, institute_category |
| Campus | scholarships_available, scholarship_type |
| Features | internship_mandatory, exchange_program_available |
| Web | official_website |

### Colleges Covered
```
IIMs  ·  NITs  ·  XLRI  ·  MDI  ·  IMT  ·  SIBM  ·  NMIMS  ·  SPJain
Tier 1  ·  Tier 2  ·  Tier 3  ·  Government  ·  Private
```

---

## ⚙️ How It Works

```
Student Profile Input
        ↓
Category → CATEGORY_MAP → DataFrame Column (e.g. OBC → CAT_OBC)
        ↓
Filter: CAT Score ≥ Cutoff  AND  12th % ≥ Minimum
        ↓
Sort: roi_score = Avg Package / Fees  (descending)
        ↓
Return: JSON → Frontend Renders College Cards
        ↓
Click Card → /api/college/<n> → Full Detail Modal
```

### Eligibility Algorithm
```python
CATEGORY_MAP = {
    "GENERAL": "CAT_General",
    "EWS":     "CAT_EWS",
    "OBC":     "CAT_OBC",
    "SC":      "CAT_SC",
    "ST":      "CAT_ST",
}

for _, row in df.iterrows():
    if cat_score >= row[col] and twelfth >= row["12th %"]:
        eligible.append(college)

eligible.sort(key=lambda x: x["roi_score"], reverse=True)
```

---

## 📁 Project Structure

```
mba_eligify/
│
├── app.py                      # Flask backend — API routes + eligibility logic
├── requirements.txt            # Python dependencies
├── Procfile                    # Render start command: web: gunicorn app:app
├── runtime.txt                 # Python version: python-3.11.0
├── render.yaml                 # Render service auto-configuration
├── .gitignore                  # Excludes __pycache__, .env from Git
│
├── CatScore_MBA_Dataset.xlsx   # College dataset (70 colleges × 30 attributes)
│
├── templates/
│   └── index.html              # Single page frontend (Jinja2 template)
│
└── static/
    ├── css/
    │   └── style.css           # Custom CSS — animations, grid, responsive
    └── js/
        └── main.js             # Vanilla JS — fetch API, filtering, modal
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.11 or higher
- pip
- Git

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Pathak0806/mba-eligify.git
cd mba-eligify
```

**2. Create virtual environment**
```bash
python -m venv venv
```

**3. Activate virtual environment**
```bash
# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

**4. Install dependencies**
```bash
pip install -r requirements.txt
```

**5. Run the application**
```bash
python app.py
```

**6. Open in browser**
```
http://127.0.0.1:5000
```

---

## 🚀 Usage

### Home Page
- Overview of the platform with hero section and statistics
- Click **"Start Matching"** to go to the eligibility form

### Eligibility Form
- Enter your **Name**, **Date of Birth**, **12th Percentage**, **CAT Percentile**
- Select your **reservation category** (General / EWS / OBC / SC / ST)
- Click **"Find My Colleges"**

### Results Page
- View all eligible colleges as interactive cards
- **Search** by college name or city
- **Filter** by tier (Tier 1 / Tier 2 / Tier 3)
- **Sort** by ROI Score, Highest Package, Lowest Fees, Best Placement

### College Detail Modal
- Click any college card to open full details
- View financial overview, NIRF rank, specializations
- See category-wise CAT cutoffs for all 5 categories
- Check scholarship, internship, exchange program details
- Click official website link for further research

---

## 🌐 Deployment

This project is deployed on **Render** with automatic GitHub CI/CD.

Every push to `main` branch triggers automatic redeployment.

```bash
# Deploy update
git add .
git commit -m "your update"
git push
# Render auto-redeploys in ~60 seconds
```

**Live URL:** https://mba-eligify.onrender.com

---

## 🙏 Acknowledgements

- National Institutional Ranking Framework (NIRF) — Rankings data
- All India Council for Technical Education (AICTE)
- IIM official portals — Cutoff and placement data
- Pandas and Flask open source communities

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| **Vivek Pathak** | Developer — Full Stack + Data + Deployment |

---

Made with ❤️ for CAT aspirants across India

© 2025 MBA Eligify — From Score to B-School
