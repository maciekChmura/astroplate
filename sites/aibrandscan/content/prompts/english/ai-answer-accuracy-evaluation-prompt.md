---
title: "AI Answer Accuracy Evaluation Prompt"
meta_title: "AI Answer Accuracy Evaluation Prompt | Brand Answer Audit"
description: "Evaluate whether an AI-generated answer about your brand is accurate, complete, useful, current, and commercially safe."
image: "/sites/aibrandscan/images/og-image.png"
categories: ["Diagnose AI Visibility"]
tags: ["ai-answer-accuracy", "brand-reputation", "answer-quality"]
keywords: ["AI answer accuracy evaluation prompt", "audit AI answers about brand", "AI misinformation brand"]
author: "aibrandscan-team"
popular: false
draft: false
library_category: "Diagnose AI Visibility"
use_case: "Evaluate whether an AI-generated answer about your brand is accurate, useful, and commercially helpful."
when_to_use:
  - "AI assistants mention your brand but the answer may be incomplete or misleading."
  - "Accuracy, compliance, reputation, or buyer interpretation matters."
  - "You need a documented correction plan."
required_inputs:
  - "The exact AI answer, prompt, platform, and test date"
  - "Verified brand facts and source URLs"
  - "Important differentiators and limitations"
  - "Known regulatory or reputation sensitivities"
outputs:
  - "Overall answer score and accuracy scorecard"
  - "Correct, incorrect, outdated, and omitted elements"
  - "Sentiment and business-risk analysis"
  - "Suggested corrected answer and correction assets"
best_for: "Brands that care about reputation, accuracy, compliance, and buyer interpretation."
how_to_use_results:
  - "Correct source information before trying to influence summaries."
  - "Escalate high-risk factual errors to legal or compliance owners."
  - "Retest the same question after meaningful corrections."
prompt: |
  Act as an independent AI answer quality, brand accuracy, and reputation-risk evaluator.

  Audit the supplied AI-generated answer against verified source material. Never treat the brand's preferred marketing language as automatically true. Separate facts, interpretations, opinions, and unsupported claims.

  INPUTS
  - Original user prompt: [PROMPT]
  - AI platform/model and test date: [PLATFORM / DATE]
  - AI-generated answer: [ANSWER]
  - Brand and website: [BRAND / URL]
  - Verified facts and source URLs: [FACTS / SOURCES]
  - Important differentiators, limitations, and disclaimers: [CONTEXT]
  - Regulatory or reputation sensitivities: [RISKS]

  EVALUATE
  - Factual accuracy
  - Completeness
  - Freshness
  - Relevance to the original question
  - Entity and category clarity
  - Product/service accuracy
  - Sentiment and framing
  - Comparative fairness
  - Evidence and citation quality
  - Commercial usefulness
  - Legal, compliance, or reputation risk

  REQUIRED OUTPUT
  1. Overall Answer Quality Score from 0-100.
  2. Scorecard by evaluation dimension with evidence and confidence.
  3. Correct statements.
  4. Incorrect or unsupported statements.
  5. Outdated statements.
  6. Important omissions.
  7. Ambiguous wording and likely buyer interpretation.
  8. Sentiment analysis and business impact.
  9. Risk rating: Low, Medium, High, or Critical.
  10. A corrected answer that is factual, balanced, concise, and source-supported.
  11. Correction assets the brand should publish or update.
  12. Ten monitoring prompts for related answer risks.

  Quote the relevant passage for each issue. If a fact cannot be verified from the supplied sources, mark it Unknown.
---
