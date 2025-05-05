export interface User {
  uid?: string;
  email: string;
  password?: string;
  name?: string; // Asegúrate de que esta línea esté presente
  institution?: string;
  researchGroup?: string;
  researchLines?: string[];
  interestAreas?: string[];
  apiKeyChatGPT?: string;  // Campo adicional si es necesario
}
