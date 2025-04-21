# 🤖 AI Matching Approach

This project uses a custom-built AI and NLP-powered scoring system to match candidates with job descriptions. The logic is implemented using libraries like `natural`, `stopword`, `pdf-parse`, and `mammoth`. Here's a breakdown of the approach:

---

## 1. 📄 Resume Text Extraction

Resumes are uploaded in either PDF or DOCX formats. The `NLPProcessor` class uses:

- **pdf-parse** to extract text from PDF files.
- **mammoth** to extract raw text from DOCX files.

This ensures uniform text content for processing, regardless of file type.

---

## 2. 🔍 Text Preprocessing

Before any NLP operations, both the resume and job description undergo preprocessing steps:

- Lowercasing the text.
- Tokenization using `WordTokenizer` from the `natural` library.
- Removal of stopwords using the `stopword` library.
- Stemming with `PorterStemmer` to normalize word forms.

This is done in both `ScoringEngine.preprocessText()` and `NLPProcessor.preprocessText()`.

---

## 3. 🧠 Skill Extraction

The system compares preprocessed resume tokens with a list of job-required skills.

- If any token in the resume matches a stemmed version of a job skill, it is considered a match.
- Extracted skills are stored for profile metadata and match scoring.

Implemented in:
javascript
NLPProcessor.extractSkills(text, jobSkills)

### 4. 📈 Text Similarity Scoring (TF-IDF)

- `ScoringEngine.calculateTextSimilarity()` method utilizes:
  - `natural.TfIdf` to compute **Term Frequency–Inverse Document Frequency**.
  - A **dot product** of the TF-IDF vectors between the resume and job description.
  - The resulting similarity value is **normalized to a 0–100 scale** for scoring.

---

### 5. 🎯 Skill Match Scoring

- `ScoringEngine.calculateSkillMatch()` compares:
  - Preprocessed and stemmed **tokens in the resume** with each **required skill phrase**.
  - A skill is considered matched if **any stemmed token** in the skill exists in the resume text.
  - Score is calculated as:  
    `matched skills / total required skills × 100`

---

### 6. 📊 Experience Score Calculation

- `ScoringEngine.calculateExperienceScore()` identifies phrases like:
  - `"3 years"`, `"5 yrs"`, etc.
- If such a value is found:
  - The number of years is **multiplied by 10** to determine a score.
  - Maximum experience score is **capped at 100**.

---

### 7. 🧮 Final Match Score

- `ScoringEngine.calculateAdvancedMatch()` combines the three components:
  - **Text Similarity** – 50% weight
  - **Skill Match** – 30% weight
  - **Experience Score** – 20% weight
- Returns a **final match score** (0–100), used to rank candidates against job requirements.

---

### 🧪 Additional Matching (Jaccard Similarity)

- `NLPProcessor.calculateMatchScore()` provides a secondary score using:
  - **Jaccard Similarity Index**:
    - Calculates intersection and union of **stemmed tokens** from both resume and job description.
    - Returns a **simple percentage match** for backup or comparative use.