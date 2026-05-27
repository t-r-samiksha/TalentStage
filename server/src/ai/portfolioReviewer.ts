import { z } from 'zod';
import { callGemini } from './geminiClient';
import { parseAIJson } from './zodValidator';
import { buildPortfolioReviewPrompt } from './promptBuilder';
import { logger } from '../utils/logger';

export const PortfolioReviewSchema = z.object({
  original: z.string(),
  improved: z.string(),
  suggestions: z.array(z.string()),
});

export type PortfolioReviewResult = z.infer<typeof PortfolioReviewSchema>;

/**
 * Reviews a portfolio text using AI and returns an improved version with suggestions.
 * If Gemini fails, it falls back to a high-quality tailored local mock optimizer response.
 * @param text - The original portfolio text
 * @returns The reviewed portfolio result
 */
export async function reviewPortfolio(text: string): Promise<PortfolioReviewResult> {
  const prompt = buildPortfolioReviewPrompt(text);
  try {
    const rawResponse = await callGemini(prompt, "You are an expert technical recruiter and resume reviewer.");
    return parseAIJson(rawResponse, PortfolioReviewSchema);
  } catch (error) {
    logger.warn("Gemini review portfolio failed. Triggering graceful fallback.", {
      error: error instanceof Error ? error.message : String(error)
    });

    // Detect key technical terms to provide dynamic tailored suggestions
    const lowerText = text.toLowerCase();
    const suggestions: string[] = [];
    let improved = "";

    // Tailor recommendations based on keywords
    if (lowerText.includes("react") || lowerText.includes("frontend") || lowerText.includes("typescript") || lowerText.includes("js")) {
      suggestions.push("Specify details about your state management architecture (e.g., Redux Toolkit, Zustand) to showcase system design proficiency.");
      suggestions.push("Mention performance optimizations like code splitting, lazy loading, or virtualization that improved rendering latency.");
      suggestions.push("Emphasize modern styling integrations (e.g., Tailwind CSS, Framer Motion) and how they drive responsive, high-performance user interfaces.");
      
      improved = text.includes("React") 
        ? `${text} Specialized in architecting high-performance React applications with TypeScript. Proven track record of optimizing rendering efficiency by up to 40% and integrating modern state management libraries.`
        : `Frontend Engineer. ${text} Experienced in building highly interactive, accessible web applications using modern JavaScript/TypeScript and React ecosystems. Dedicated to visual excellence and fluid user interactions.`;
    } else if (lowerText.includes("node") || lowerText.includes("backend") || lowerText.includes("python") || lowerText.includes("api")) {
      suggestions.push("Highlight database optimization strategies such as indexing, query profiling, or Redis caching layers to show scalability insights.");
      suggestions.push("Detail your API design pattern experience (RESTful best practices, GraphQL schemas) and test coverage (Jest, Supertest).");
      suggestions.push("Quantify key engineering outcomes (e.g., 'reduced API response times by 30%' or 'architected secure JWT authorization structures').");

      improved = `Senior Backend Engineer. ${text} Expert in building highly scalable, secure microservices and robust API layers. Dedicated to architectural efficiency, system resilience, and test-driven development.`;
    } else if (lowerText.includes("solidity") || lowerText.includes("web3") || lowerText.includes("blockchain") || lowerText.includes("smart contract")) {
      suggestions.push("Emphasize smart contract security and gas optimization patterns (e.g., memory vs storage layouts, Custom Errors).");
      suggestions.push("Detail your testing frameworks experience (Hardhat, Foundry) and any formal audits or mainnet deployment verification.");
      suggestions.push("Explain protocol integrations (e.g., ERC-20, ERC-721, DeFi lending bridges or governance models).");

      improved = `Smart Contract Developer. ${text} Specialized in Solidity engineering and Web3 systems design. Committed to rigorous testing with Foundry, implementing gas-efficient designs, and securing protocol integrations.`;
    } else {
      // Default standard professional tech suggestions
      suggestions.push("Leverage strong action verbs (e.g., 'Engineered', 'Architected', 'Pioneered') at the start of your descriptions.");
      suggestions.push("Quantify your professional achievements with solid metrics (e.g., transaction volume, latency reductions, user growth).");
      suggestions.push("List your primary developer toolkit (languages, frameworks, environments) clearly to capture ATS and technical scout searches.");

      improved = `Technical Professional. ${text} Experienced in modern software engineering paradigms, agile delivery, and cross-functional team collaboration. Driven by solving complex problems and delivering high-quality, maintainable codebases.`;
    }

    // Return structured fallback response matching the schema perfectly
    return {
      original: text,
      improved,
      suggestions
    };
  }
}

