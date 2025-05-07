import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private readonly GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) { }

  corregirConsultaConGPT(texto: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });
  
    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": `
            You are a search query correction assistant. Your task is:
            1. Fix spelling, grammar, and typographical errors.
            2. Preserve technical terms, abbreviations (e.g., "AI", "SQL"), and proper nouns.
            3. Remove special characters (e.g., "&", "$", "¿", "¡").
            4. Normalize spaces (collapse multiple spaces into one).
            5. Return ONLY the corrected text, no explanations or formatting.
  
            Examples:
          - Input: "&&& AI && Machine Learning in healthcare $$$"
            Output: "artificial intelligence machine learning healthcare"
          - Input: "Cancer therapy AND (deep learning OR neural networks)"
            Output: "cancer therapy deep learning neural networks"
          - Input: "Tesla OR (electric cars) AND sustainability"
            Output: "Tesla electric cars sustainability"
          `
        },
        {
          "role": "user",
          "content": `Correct this search query following the rules above: "${texto}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    };
  
    return this.http.post(this.GPT_API_URL, body, { headers });
  }

}
