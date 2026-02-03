const getAnswerLetter = (indexCount: number): string => {
  const clamped = Math.max(0, Math.floor(indexCount));
  const code = 65 + (clamped % 26);
  return String.fromCharCode(code);
};

export default getAnswerLetter;
