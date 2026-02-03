export type AnswerId = string;

export type GameAnswer = {
  id: AnswerId;
  text: string;
};

export type GameQuestion = {
  id: string;
  text: string;
  answers: GameAnswer[];
  correctAnswerIds: AnswerId[];
};

export type GameStep = {
  id: string;
  amount: number;
  question: GameQuestion;
};

export type GameConfig = {
  version: number;
  currency: string;
  steps: GameStep[];
};
