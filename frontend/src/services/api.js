const API_BASE = '/api';

export const analyzeClaimApi = async ({ text, language = 'en', source_type = 'text' }) => {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, source_type })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze claim');
  }
  return response.json();
};

export const transcribeAudioApi = async (audioBlob, fileName = 'recording.webm') => {
  const formData = new FormData();
  formData.append('file', audioBlob, fileName);

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Transcription failed');
  }
  return response.json();
};

export const synthesizeSpeechApi = async ({ text, language = 'en' }) => {
  const response = await fetch(`${API_BASE}/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Speech synthesis failed');
  }
  return response.json();
};

export const fetchEducationApi = async () => {
  const response = await fetch(`${API_BASE}/education`);
  if (!response.ok) throw new Error('Failed to fetch education modules');
  return response.json();
};

export const submitQuizApi = async ({ question_id, selected_index, lang = 'en' }) => {
  const response = await fetch(`${API_BASE}/education/quiz-submit?lang=${lang}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id, selected_index })
  });
  if (!response.ok) throw new Error('Quiz evaluation failed');
  return response.json();
};

export const fetchSourcesApi = async () => {
  const response = await fetch(`${API_BASE}/sources`);
  if (!response.ok) throw new Error('Failed to fetch official sources');
  return response.json();
};

export const fetchSamplesApi = async () => {
  const response = await fetch(`${API_BASE}/samples`);
  if (!response.ok) throw new Error('Failed to fetch sample scenarios');
  return response.json();
};
