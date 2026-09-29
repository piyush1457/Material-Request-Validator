import { useState, useEffect, useRef } from 'react';
import { X, Send, Copy, Sparkles, Zap, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import type { MaterialRequest } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaterialRequest;
}

const SYSTEM_PROMPT = `You are an AI Material Analyst for retail fit-out projects. 
Your role is to analyze material requests and explain severity assessments.
You have access to the request details and AI severity analysis.
Provide concise, actionable responses focused on:
1. Why the request was flagged with its severity level
2. Specific waste factors and their impact
3. Practical recommendations to improve/optimize the request
4. Industry benchmarks and best practices

Keep responses professional, specific to construction materials, and under 150 words.`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroqAPI(apiKey: string, messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages,
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}

function getInitialApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
}

function MessageContent({ content, role }: { content: string; role: 'user' | 'assistant' }) {
  if (role === 'user') {
    return <p className="whitespace-pre-wrap text-body-sm">{content}</p>;
  }
  return (
    <div className="text-body-sm prose prose-sm max-w-none prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export function AIChatModal({ isOpen, onClose, request }: AIChatModalProps) {
  if (!request) return null;
  
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>(getInitialApiKey);

  useEffect(() => {
    if (isOpen) {
      const analysis = request.aiAnalysis;
      const initialContent = `**Request Analysis for ${request.materialName} (${request.taskName} at ${request.projectName})**

**Severity: ${analysis?.severity || request.severity || 'Normal'}**
**AI Message: ${analysis?.message || 'No analysis available'}**

**Issue:** ${analysis?.issue || 'Not specified'}
**Recommendation:** ${analysis?.recommendation || 'Not specified'}
${analysis?.wasteFactors?.length ? `**Waste Factors:** ${analysis.wasteFactors.join(', ')}` : ''}
${analysis?.estimatedWaste ? `**Estimated Waste:** ${analysis.estimatedWaste}` : ''}

---

I'm ready to help you understand this assessment. You can ask me:
• Why was this marked as ${analysis?.severity || request.severity || 'Normal'}?
• How can I reduce waste for this material?
• What are the typical benchmarks?
• What should I do to improve this request?`;

      setMessages([
        { role: 'assistant', content: initialContent },
      ]);
    }
  }, [isOpen, request]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      alert('Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
      return;
    }

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const contextMessage = `Context: Material request for ${request.materialName} (${request.requestedQuantity} ${request.unit}) for ${request.taskName} at ${request.projectName}.
AI Analysis: Severity=${request.aiAnalysis?.severity}, Issue="${request.aiAnalysis?.issue}", Recommendation="${request.aiAnalysis?.recommendation}", WasteFactors=[${request.aiAnalysis?.wasteFactors?.join(', ') || 'none'}], EstimatedWaste="${request.aiAnalysis?.estimatedWaste || 'unknown'}"

User question: ${userMessage}`;

      const response = await callGroqAPI(apiKey, [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: contextMessage },
      ]);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Groq API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionButtons = [
    { label: 'Why this severity?', prompt: `Why was this request marked as ${request.aiAnalysis?.severity || request.severity || 'Normal'} severity? Explain the specific reasons.` },
    { label: 'How to reduce waste?', prompt: 'What specific actions can I take to reduce waste for this material and task?' },
    { label: 'Improve request', prompt: 'What should I do to improve this request and get it approved without flags?' },
    { label: 'Benchmarks?', prompt: 'What are the typical industry benchmarks for this material and task type?' },
    { label: 'Alternative materials', prompt: 'Are there alternative materials or methods that would be more efficient?' },
  ];

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    handleSend();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Talk with AI Assistant" size="lg">
      {!apiKey && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-[8px]">
          <p className="text-body-sm text-amber-400 mb-2">Groq API key not found in environment variables.</p>
          <p className="text-caption text-amber-400/80 mb-2">Add <code className="bg-white/5 px-1 rounded text-caption">VITE_GROQ_API_KEY=your_key</code> to your <code className="bg-white/5 px-1 rounded text-caption">.env</code> file and restart the dev server.</p>
          <p className="text-caption text-amber-400/80">Get your key at <a href="https://console.groq.com" target="_blank" className="underline text-blue-cornflower">console.groq.com</a></p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 mb-4" style={{ maxHeight: '50vh' }} role="log" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white text-page-ink' : 'bg-deep-coal border border-steel-border'}`}>
              <div className="p-4 rounded-[8px]">
                <MessageContent content={msg.content} role={msg.role} />
              </div>
              <div className="flex items-center gap-1 px-1 mt-1">
                {msg.role === 'assistant' && (
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1" title="Copy">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-deep-coal border border-steel-border p-3 rounded-[8px] max-w-[85%]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-cornflower" />
                <span className="text-body-sm text-ash">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-steel-border pt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestionButtons.map((suggestion) => (
            <Button
              key={suggestion.label}
              variant="secondary"
              size="sm"
              onClick={() => handleSuggestion(suggestion.prompt)}
              disabled={isLoading || !apiKey}
              className="text-caption"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {suggestion.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiKey ? "Ask about severity, waste, benchmarks, improvements..." : "Configure VITE_GROQ_API_KEY in .env"}
            className="flex-1 px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white placeholder:text-fog focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors text-body-sm"
            disabled={isLoading || !apiKey}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading || !apiKey} className="px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}