//Author: Brandon Christian
//Date: 1-25-2026
//Take already transcribed text and process the content into tokens and count
using System.Collections.Generic;
using System;

class TokenizeText
{
    //INPUT: string containing the textified audio
    //OUTPUT: list of words (tokens)
    public static Dictionary<string, int> TextToTokensCount(string text)
    {
        List<string> tokens = TextToTokens(text);
        Dictionary<string, int> tokensByCount = GroupTokens(tokens);

        return tokensByCount;
    }

    private static List<string> TextToTokens(string text)
    {
        string[] words = text.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
        List<string> tokens = new List<string>();

        string currentToken = "";

        foreach (string word in words)
        {
            if (PartOfCombinedToken(currentToken, word))
            {
                //Combine or create new token
                currentToken = currentToken + " " + word;
            }
            else
            {
                //Add and reset
                tokens.Add(currentToken);
                currentToken = "";
            }
        }

        return tokens;
    }

    //INPUT: list of non-unique tokens ordered by appearence
    //OUTPUT: dict of strings (tokens) as keys and their count as values
    private static Dictionary<string, int> GroupTokens(List<string> allTokens)
    {
        Dictionary<string, int> tokensByCount = new Dictionary<string, int>;

        foreach (string t in allTokens)
        {
            //remove capitals, punctuation, etc.
            string normalized_t = NormalizeToken(t);

            if (normalized_t == "")
                continue; //skip empty tokens

            if (!tokensByCount.ContainsKey(normalized_t))
                tokensByCount.Add(normalized_t, 1);
            else
                tokensByCount[normalized_t] = tokensByCount[normalized_t] + 1;
        }

        return tokensByCount;
    }

    //INPUT: unparsed token
    //OUTPUT: token with capitals lowered and non-letters removed
    private static string NormalizeToken(string token)
    {
        string no_uppercase = token.ToLower();

        string no_punct = "";

        foreach (char c in no_uppercase)
        {
            if (char.IsLetter(c))
                no_punct = no_punct + c;
        }

        return no_punct;
    }

    //INPUT: previous token and current words
    //OUTPUT: whether the token and would should be combined
    //to create a new, longer token 
    //TODO: refer to some pre-existing list of multi-word tokens
    private static bool PartOfCombinedToken(string lastToken, string word)
    {
        if (lastToken == "") //no current token
            return true;
        else
            return false;
    }
}

