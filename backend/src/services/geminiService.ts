import { GoogleGenAI } from '@google/genai';
import logger from '../utils/logger';
import { SpendingSummary } from '../types';

// Lazy initialization to ensure environment variables are loaded
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    ai = new GoogleGenAI({
      apiKey: apiKey,
    });
  }
  
  return ai;
};

/**
 * Auto-categorize transaction descriptions using Gemini AI
 */
export const categorizeTransactions = async (
  descriptions: string[]
): Promise<Array<{ description: string; category: string }>> => {
  try {
    const prompt = `
      Categorize each transaction description into ONE of these categories:
      Food & Dining, Rent & Housing, Utilities, Shopping, Entertainment, 
      Transportation, Healthcare, Education, Salary, Savings, Other
      
      Input descriptions: ${JSON.stringify(descriptions)}
      
      Return ONLY a valid JSON array of objects (no markdown, no extra text): 
      [{ "description": "...", "category": "..." }, ...]
      
      Ensure the response is valid JSON only.
    `;

    const client = getAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      logger.warn('Could not extract JSON from Gemini response');
      return descriptions.map((desc) => ({
        description: desc,
        category: 'Uncategorized',
      }));
    }

    const categorized = JSON.parse(jsonMatch[0]);
    logger.info(`✅ Categorized ${categorized.length} transactions`);
    return categorized;
  } catch (error) {
    logger.error('Error categorizing transactions:', error instanceof Error ? error.message : JSON.stringify(error));
    return descriptions.map((desc) => ({
      description: desc,
      category: 'Uncategorized',
    }));
  }
};

/**
 * Generate spending insights using Gemini AI
 */
export const getSpendingInsights = async (
  transactions: any[],
  summary: SpendingSummary
): Promise<string> => {
  try {
    const topCategoriesStr = summary.topCategories
      .map((c) => `${c.category}: $${c.amount}`)
      .join('\n      ');

    const prompt = `
      You are a financial advisor. Analyze this user's spending and provide actionable insights:
      
      📊 Spending Summary:
      - Total Spend: $${summary.totalSpend}
      - Monthly Average: $${summary.monthlyAverage}
      - Transaction Count: ${summary.transactionCount}
      - Top Categories:
      ${topCategoriesStr}
      
      Spending Period: ${summary.dateRange.start.toDateString()} to ${summary.dateRange.end.toDateString()}
      
      Sample Transactions (last 10):
      ${transactions
        .slice(0, 10)
        .map((t) => `- ${t.date.toDateString()}: $${t.amount} on ${t.description} (${t.category})`)
        .join('\n')}
      
      Provide a brief intro sentence, followed by 5-7 actionable insights as bullet points.
      
      Use this EXACT format:
      Here's an analysis of your spending with actionable recommendations:
      
      * **Title:** Explanation and specific recommendation
      * **Title:** Explanation and specific recommendation
      
      Keep each point concise (2-3 sentences max). Be specific and actionable.
      Focus on: budgeting, savings opportunities, spending patterns, and financial goals.
    `;

    const client = getAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const insights = response.text || 'Unable to generate insights at this time. Please try again later.';
    logger.info('✅ Generated spending insights');
    return insights;
  } catch (error) {
    logger.error('Error generating insights:', error instanceof Error ? error.message : JSON.stringify(error));
    return 'Unable to generate insights at this time. Please try again later.';
  }
};
