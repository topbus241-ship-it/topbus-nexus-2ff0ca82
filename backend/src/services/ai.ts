import fetch from 'node-fetch';

const OLLAMA = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function generateFromOllama(prompt: string) {
  const url = `${OLLAMA}/v1/generate`;
  const body = { model: 'llama2', prompt };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Ollama error: ${resp.status}`);
  const json = await resp.json();
  return json;
}
