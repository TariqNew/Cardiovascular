import React, { useEffect, useState } from 'react';

interface Recommendation {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  wordCount?: number;
}

interface AIResponse {
  success: boolean;
  data: {
    fullResponse: string;
    sections: Recommendation[];
    metadata: {
      generatedAt: string;
      userId: number;
      profileData: any;
    };
    summary: {
      totalSections: number;
      wordCount: number;
      hasHighPriorityItems: boolean;
    };
  };
}

const HealthRecommendations: React.FC = () => {
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'formatted' | 'full' | 'raw'>('formatted');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('🚀 Fetching AI recommendations...');
        const response = await fetch('http://localhost:5050/api/recommendations/docs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Complete AI Response:', data);
        
        if (data.success && data.data) {
          setAiData(data);
        } else {
          // Handle old format for backward compatibility
          if (data.tips) {
            const fallbackData: AIResponse = {
              success: true,
              data: {
                fullResponse: data.tips,
                sections: parseAIRecommendations(data.tips),
                metadata: {
                  generatedAt: new Date().toISOString(),
                  userId: 0,
                  profileData: {}
                },
                summary: {
                  totalSections: 0,
                  wordCount: data.tips?.split(/\s+/).length || 0,
                  hasHighPriorityItems: false
                }
              }
            };
            setAiData(fallbackData);
          } else {
            throw new Error('No recommendations data received');
          }
        }
      } catch (err: any) {
        console.error('❌ Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const parseAIRecommendations = (aiResponse: string): Recommendation[] => {
    // Parse the AI response and convert to structured recommendations
    const lines = aiResponse.split('\n').filter(line => line.trim());
    const recommendations: Recommendation[] = [];
    let currentRecommendation: Partial<Recommendation> = {};
    let id = 1;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if it's a title (starts with ##, #, or is in bold)
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('#') || 
          trimmedLine.startsWith('**') || trimmedLine.match(/^\d+\./)) {
        
        // Save previous recommendation if exists
        if (currentRecommendation.title) {
          recommendations.push({
            id: id++,
            title: currentRecommendation.title,
            content: currentRecommendation.content || '',
            type: 'health_tip',
            priority: determinePriority(currentRecommendation.title || ''),
            category: determineCategory(currentRecommendation.title || ''),
          });
        }

        // Start new recommendation
        currentRecommendation = {
          title: trimmedLine.replace(/^#+\s*|^\*\*|\*\*$|^\d+\.\s*/g, ''),
          content: '',
        };
      } else if (trimmedLine && currentRecommendation.title) {
        // Add to content
        currentRecommendation.content = (currentRecommendation.content || '') + 
          (currentRecommendation.content ? '\n' : '') + trimmedLine;
      }
    });

    // Add the last recommendation
    if (currentRecommendation.title) {
      recommendations.push({
        id: id++,
        title: currentRecommendation.title,
        content: currentRecommendation.content || '',
        type: 'health_tip',
        priority: determinePriority(currentRecommendation.title || ''),
        category: determineCategory(currentRecommendation.title || ''),
      });
    }

    return recommendations;
  };

  const determinePriority = (title: string): 'high' | 'medium' | 'low' => {
    const highPriorityKeywords = ['urgent', 'critical', 'important', 'blood pressure', 'cholesterol'];
    const lowPriorityKeywords = ['general', 'tip', 'suggestion', 'consider'];
    
    const lowerTitle = title.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'high';
    }
    if (lowPriorityKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'low';
    }
    return 'medium';
  };

  const determineCategory = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('diet') || lowerTitle.includes('food') || lowerTitle.includes('nutrition')) {
      return 'nutrition';
    }
    if (lowerTitle.includes('exercise') || lowerTitle.includes('activity') || lowerTitle.includes('workout')) {
      return 'exercise';
    }
    if (lowerTitle.includes('medication') || lowerTitle.includes('drug') || lowerTitle.includes('medicine')) {
      return 'medication';
    }
    if (lowerTitle.includes('lifestyle') || lowerTitle.includes('habit')) {
      return 'lifestyle';
    }
    return 'general';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return 'fa-utensils';
      case 'exercise': return 'fa-dumbbell';
      case 'medication': return 'fa-pills';
      case 'lifestyle': return 'fa-heart';
      default: return 'fa-info-circle';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading recommendations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Recommendations</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = aiData?.data?.sections || [];
  const fullResponse = aiData?.data?.fullResponse || '';
  const summary = aiData?.data?.summary;
  const metadata = aiData?.data?.metadata;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            AI Health Recommendations
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Personalized recommendations based on your health profile and latest medical research.
          </p>
          {summary && (
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span><i className="fas fa-list mr-1"></i>{summary.totalSections} sections</span>
              <span><i className="fas fa-file-word mr-1"></i>{summary.wordCount} words</span>
              {summary.hasHighPriorityItems && (
                <span className="text-red-600"><i className="fas fa-exclamation-triangle mr-1"></i>High priority items</span>
              )}
              {metadata && (
                <span><i className="fas fa-calendar mr-1"></i>{new Date(metadata.generatedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          {/* View Mode Selector */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-2 text-sm font-medium border ${
                viewMode === 'formatted'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-l-md`}
            >
              <i className="fas fa-th-list mr-1"></i>Formatted
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-2 text-sm font-medium border-t border-b ${
                viewMode === 'full'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-expand mr-1"></i>Full Text
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-2 text-sm font-medium border ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } rounded-r-md`}
            >
              <i className="fas fa-code mr-1"></i>Raw
            </button>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Raw View */}
      {viewMode === 'raw' && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">{fullResponse}</pre>
        </div>
      )}

      {/* Full Text View */}
      {viewMode === 'full' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-line">{fullResponse}</div>
          </div>
        </div>
      )}

      {/* Formatted View */}
      {viewMode === 'formatted' && (
        <>
          {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-clipboard-list text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
          <p className="text-gray-500">Complete your health profile to get personalized recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className={`fas ${getCategoryIcon(recommendation.category)} text-indigo-600 text-lg`}></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {recommendation.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {recommendation.content}
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    <i className="fas fa-robot mr-1"></i>
                    Generated by AI based on your health profile
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                    Learn more <i className="fas fa-external-link-alt ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default HealthRecommendations;
