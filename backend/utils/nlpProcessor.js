const { NlpManager } = require("node-nlp");
const natural = require("natural");
const stopword = require("stopword");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

class NLPProcessor {
  constructor() {
    this.manager = new NlpManager({ languages: ["en"] });
    this.tokenizer = new natural.WordTokenizer();
  }

  extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : "unknown@example.com";
  }

  extractName(text) {
    // Basic heuristic: Use the first non-empty line as name
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return lines.length > 0 ? lines[0] : "Unknown Name";
  }

  async extractTextFromFile(fileBuffer, fileType) {
    try {
      if (fileType === "application/pdf") {
        const data = await pdfParse(fileBuffer);
        // console.log("PDF Text Extracted:", data.text); // Log extracted PDF text
        return data.text;
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        // console.log("DOCX Text Extracted:", result.value); // Log extracted DOCX text
        return result.value;
      } else if (fileType && fileType.startsWith("image/")) {
        const { data } = await Tesseract.recognize(fileBuffer, "eng");
        return data?.text || null;
      }
      return null;
    } catch (error) {
      console.error("Error extracting text:", error);
      return null;
    }
  }

  preprocessText(text) {
    text = text.toLowerCase();
    let tokens = this.tokenizer.tokenize(text);
    tokens = stopword.removeStopwords(tokens);
    const stemmer = natural.PorterStemmer;
    tokens = tokens.map((token) => stemmer.stem(token));
    return tokens;
  }

  extractSkills(text, jobSkills = []) {
    const tokens = this.preprocessText(text);
    const skills = new Set();

    jobSkills.forEach((skill) => {
      const processedSkill = this.preprocessText(skill)[0];
      if (tokens.includes(processedSkill)) {
        skills.add(skill);
      }
    });

    return Array.from(skills);
  }

  calculateMatchScore(resumeText, jobDescription) {
    const resumeTokens = this.preprocessText(resumeText);
    const jobTokens = this.preprocessText(jobDescription);

    const intersection = new Set(
      [...resumeTokens].filter((x) => jobTokens.includes(x))
    );
    const union = new Set([...resumeTokens, ...jobTokens]);

    const similarity = intersection.size / union.size;
    return Math.round(similarity * 100);
  }
}

module.exports = new NLPProcessor();
