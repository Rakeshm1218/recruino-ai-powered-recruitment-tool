const natural = require('natural');
const { WordTokenizer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const stopword = require('stopword');

class ScoringEngine {
  static calculateAdvancedMatch(resumeText, jobDescription, requiredSkills) {
    const textSimilarity = this.calculateTextSimilarity(resumeText, jobDescription);
    const skillMatch = this.calculateSkillMatch(resumeText, requiredSkills);
    const experienceScore = this.calculateExperienceScore(resumeText);
    
    const totalScore = (textSimilarity * 0.5) + (skillMatch * 0.3) + (experienceScore * 0.2);
    return Math.round(totalScore);
  }

  static calculateTextSimilarity(text1, text2) {
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text1);
    tfidf.addDocument(text2);
    
    const terms = {};
    tfidf.listTerms(0).forEach(item => {
      terms[item.term] = item.tfidf;
    });
    
    let similarity = 0;
    tfidf.listTerms(1).forEach(item => {
      if (terms[item.term]) {
        similarity += terms[item.term] * item.tfidf;
      }
    });
    
    return Math.min(100, Math.round(similarity * 100));
  }

  static calculateSkillMatch(resumeText, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 0;
    
    const resumeTokens = this.preprocessText(resumeText);
    let matchedSkills = 0;
    
    requiredSkills.forEach(skill => {
      const skillTokens = this.preprocessText(skill);
      if (skillTokens.some(token => resumeTokens.includes(token))) {
        matchedSkills++;
      }
    });
    
    return (matchedSkills / requiredSkills.length) * 100;
  }

  static calculateExperienceScore(resumeText) {
    const yearMatches = resumeText.match(/(\d+)\s*(years?|yrs?)/i);
    if (!yearMatches) return 0;
    const years = parseInt(yearMatches[1]);
    return Math.min(100, years * 10);
  }

  static preprocessText(text) {
    text = text.toLowerCase();
    let tokens = tokenizer.tokenize(text);
    tokens = stopword.removeStopwords(tokens);
    tokens = tokens.map(token => PorterStemmer.stem(token));
    return tokens;
  }
}

module.exports = ScoringEngine;