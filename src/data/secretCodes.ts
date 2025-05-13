import { SecretCode } from '../types';

export const secretCodes: SecretCode[] = [
  { id: 1, code: "QUANTUM-NEXUS" },
  { id: 2, code: "CYBERVAULT-7X" },
  { id: 3, code: "MATRIX-OVERRIDE" },
  { id: 4, code: "NOVA-PROTOCOL" },
  { id: 5, code: "BYTE-PHOENIX" },
  { id: 6, code: "DIGITAL-CIPHER" },
  { id: 7, code: "TECH-ODYSSEY" },
  { id: 8, code: "BINARY-COSMOS" },
  { id: 9, code: "CODE-NEBULA" },
  { id: 10, code: "NEURAL-PULSE" }
];

export const getRandomSecretCode = (): SecretCode => {
  const randomIndex = Math.floor(Math.random() * secretCodes.length);
  return secretCodes[randomIndex];
};