import { useState, type FC } from 'react';
import { AIInsight } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface AIInsightsProps {
  insight: AIInsight | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export const AIInsights: FC<AIInsightsProps> = ({
  insight,
  loading = false,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  // Initial loading state (no data yet)
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <svg className="w-7 h-7 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Insights
          </h3>
          <div className="flex items-center gap-2 text-purple-200 text-sm">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Analyzing...</span>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="animate-pulse">
                <div className="h-3 bg-purple-400 bg-opacity-30 rounded mb-2"></div>
                <div className="h-6 bg-purple-300 bg-opacity-40 rounded w-20"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-3 bg-purple-400 bg-opacity-30 rounded mb-2"></div>
                <div className="h-6 bg-purple-300 bg-opacity-40 rounded w-20"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-3 bg-purple-400 bg-opacity-30 rounded mb-2"></div>
                <div className="h-6 bg-purple-300 bg-opacity-40 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 bg-white bg-opacity-5 p-4 rounded-lg backdrop-blur-sm animate-pulse">
              <div className="w-2 h-2 bg-yellow-300 bg-opacity-50 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-purple-400 bg-opacity-30 rounded" style={{ width: `${Math.random() * 30 + 60}%` }}></div>
                <div className="h-3 bg-purple-400 bg-opacity-20 rounded w-full"></div>
                <div className="h-3 bg-purple-400 bg-opacity-20 rounded" style={{ width: `${Math.random() * 20 + 70}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-purple-200 text-sm">
          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>Generating personalized financial insights...</span>
        </div>
      </div>
    );
  }

  if (!insight || !insight.insights) {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <svg className="w-7 h-7 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Insights
        </h3>
        <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm text-center border border-white border-opacity-20">
          <svg className="w-20 h-20 mx-auto mb-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-purple-100 text-lg font-medium">No insights available yet.</p>
          <p className="text-purple-200 text-sm mt-2">Upload transactions to get AI-powered financial analysis.</p>
        </div>
      </div>
    );
  }

  // Handle case where summary might not exist (during initial load)
  const hasSummary = insight.summary && insight.summary.totalSpend !== undefined;

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl shadow-lg p-6 text-white relative">
      {/* Loading Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-purple-900 bg-opacity-90 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white text-lg font-medium">Refreshing insights...</p>
            <p className="text-purple-200 text-sm mt-2">Analyzing your latest spending data</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <svg className="w-7 h-7 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Insights
        </h3>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white border-opacity-20"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      {hasSummary && (
        <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-purple-200 text-xs uppercase tracking-wide mb-1">Total Spend</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(insight.summary!.totalSpend)}
              </div>
            </div>
            <div className="text-center border-l border-r border-white border-opacity-20">
              <div className="text-purple-200 text-xs uppercase tracking-wide mb-1">Monthly Avg</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(insight.summary!.monthlyAverage)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-purple-200 text-xs uppercase tracking-wide mb-1">Generated</div>
              <div className="text-sm font-semibold text-white mt-1">
                {formatDate(insight.generatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 text-sm max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {insight.insights.split('\n').map((line: string, index: number) => {
          const trimmedLine = line.trim();
          
          // Skip empty lines
          if (!trimmedLine) return null;
          
          // Handle bullet points (markdown style: * **Title:** text)
          if (trimmedLine.startsWith('*')) {
            const content = trimmedLine.substring(1).trim();
            
            // Parse bold text: **text**
            const parts = content.split(/(\*\*.*?\*\*)/g);
            
            return (
              <div key={index} className="flex items-start gap-3 bg-white bg-opacity-5 p-4 rounded-lg hover:bg-opacity-10 transition-all border border-white border-opacity-0 hover:border-opacity-10 backdrop-blur-sm group">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <p className="flex-1 leading-relaxed text-purple-50">
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={i} className="font-bold text-white">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </p>
              </div>
            );
          }
          
          // Regular text (intro paragraph)
          return (
            <p key={index} className="text-purple-100 leading-relaxed bg-white bg-opacity-5 border-l-4 border-yellow-400 pl-4 py-2 rounded-r-lg backdrop-blur-sm">
              {trimmedLine}
            </p>
          );
        })}
      </div>
    </div>
  );
};
