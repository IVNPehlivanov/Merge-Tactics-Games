export type GameMode = "classic" | "pixel" | "skin";
export type GuessResult = "correct" | "higher" | "lower" | "wrong";

export interface AttributeResult {
  value: string | number | boolean;
  result: "correct" | "wrong" | "higher" | "lower";
}

// Classic game guess row — 7 attributes
export interface ClassicGuessAttributes {
  elixirCost:     AttributeResult; // numeric: higher/lower/correct
  hitSpeed:       AttributeResult; // numeric seconds: higher/lower/correct
  speed:          AttributeResult; // ordered tier: very_slow→very_fast
  primaryTrait:   AttributeResult; // categorical: correct/wrong
  secondaryTrait: AttributeResult; // categorical: correct/wrong
  cardType:       AttributeResult; // categorical: Troop/Building
  releaseYear:    AttributeResult; // numeric (year only): higher/lower/correct
}

export interface ClassicGuess {
  cardKey:   string;
  cardName:  string;
  attributes: ClassicGuessAttributes;
}
