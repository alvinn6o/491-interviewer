// Author: Brandon Christian
// Date: 1-25-2026
// Take already transcribed text and process the content into tokens and count
// Date: 1-30-2026
// Refactored from CS to be JS instead

import type { Dict } from "@trpc/server";

class TokenizeText {
    // INPUT: string containing the textified audio
    // OUTPUT: object mapping tokens -> count
    static textToTokensByCount(text: string) {
        const tokens = TokenizeText.textToTokens(text);
        const tokensByCount = TokenizeText.groupTokens(tokens);
        return tokensByCount;
    }

    static textToTokens(text: string) {
        const words = text
            .split(/[\s\n]+/)
            .filter(w => w.length > 0);

        const tokens = [];
        let currentToken = "";

        for (const word of words) {

            //Current implementation assumes single word tokens only
            if (TokenizeText.partOfCombinedToken(currentToken, word)) {
                // Combine or create new token
                currentToken = currentToken + " " + word;
            } else {
                // Add and reset
                tokens.push(currentToken);
                currentToken = "";
            }
        }

        return tokens;
    }

    // INPUT: list of non-unique tokens ordered by appearance
    // OUTPUT: object of tokens as keys and their count as values
    static groupTokens(allTokens: string[]) {
        const tokensByCount: Dict<number> = {};

        for (const t of allTokens) {
            const normalized = TokenizeText.normalizeToken(t);

            if (normalized === "") continue;

            if (!tokensByCount[normalized]) {
                tokensByCount[normalized] = 1;
            } else {
                tokensByCount[normalized]++;
            }
        }

        return tokensByCount;
    }

    // INPUT: unparsed token
    // OUTPUT: token with capitals lowered and non-letters removed
    static normalizeToken(token: string) {
        const lower = token.toLowerCase();
        let noPunct = "";

        for (const c of lower) {
            if (/[a-z]/.test(c)) {
                noPunct += c;
            }
        }

        return noPunct;
    }

    // INPUT: previous token and current word
    // OUTPUT: whether the token and word should be combined
    // TODO: refer to some pre-existing list of multi-word tokens
    static partOfCombinedToken(lastToken : string, word : string) {
        if (lastToken === "")
            return true;
        else
            return false;
    }
}

export default TokenizeText;