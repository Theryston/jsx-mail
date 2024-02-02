const TOKENS = /(\S+)|(.)/g;
const IS_SPECIAL_CASE = /[\.#]\p{Alphabetic}/u; // #tag, example.com, etc.
const IS_MANUAL_CASE = /\p{Ll}(?=[\p{Lu}])/u; // iPhone, iOS, etc.
const ALPHANUMERIC_PATTERN = /\p{Alphabetic}+/gu;
const IS_ACRONYM = /^(\P{Alphabetic})*(?:\p{Alphabetic}\.){2,}(\P{Alphabetic})*$/u;
export const WORD_SEPARATORS = new Set(["—", "–", "-", "―", "/"]);
export const SENTENCE_TERMINATORS = new Set([".", "!", "?"]);
export const TITLE_TERMINATORS = new Set([
	...SENTENCE_TERMINATORS,
	":",
	'"',
	"'",
	"”",
]);
export const SMALL_WORDS = new Set([
	"a",
	"an",
	"and",
	"as",
	"at",
	"because",
	"but",
	"by",
	"en",
	"for",
	"if",
	"in",
	"neither",
	"nor",
	"of",
	"on",
	"only",
	"or",
	"over",
	"per",
	"so",
	"some",
	"than",
	"that",
	"the",
	"to",
	"up",
	"upon",
	"v",
	"versus",
	"via",
	"vs",
	"when",
	"with",
	"without",
	"yet",
]);

export function titleCase(input: string, options: any = {}) {
	const { locale = undefined, sentenceCase = false, sentenceTerminators = SENTENCE_TERMINATORS, titleTerminators = TITLE_TERMINATORS, smallWords = SMALL_WORDS, wordSeparators = WORD_SEPARATORS, } = typeof options === "string" || Array.isArray(options)
		? { locale: options }
		: options;
	const terminators = sentenceCase ? sentenceTerminators : titleTerminators;
	let result = "";
	let isNewSentence = true;
	for (const m of input.matchAll(TOKENS)) {
		const { 1: token, 2: whiteSpace, index = 0 } = m;
		if (whiteSpace) {
			result += whiteSpace;
			continue;
		}
		if (IS_SPECIAL_CASE.test(token)) {
			const acronym = token.match(IS_ACRONYM);
			if (acronym) {
				const [_, prefix = "", suffix = ""] = acronym;
				result +=
					sentenceCase && !isNewSentence
						? token
						: upperAt(token, prefix.length, locale);
				isNewSentence = terminators.has(suffix.charAt(0));
				continue;
			}
			result += token;
			isNewSentence = terminators.has(token.charAt(token.length - 1));
		}
		else {
			const matches = Array.from(token.matchAll(ALPHANUMERIC_PATTERN));
			let value = token;
			let isSentenceEnd = false;
			for (let i = 0; i < matches.length; i++) {
				const { 0: word, index: wordIndex = 0 } = matches[i] as any;
				const nextChar = token.charAt(wordIndex + word.length);
				isSentenceEnd = terminators.has(nextChar);
				if (isNewSentence) {
					isNewSentence = false;
				}
				else if (sentenceCase || IS_MANUAL_CASE.test(word)) {
					continue;
				}
				else if (matches.length === 1) {
					if (smallWords.has(word)) {
						const isFinalToken = index + token.length === input.length;
						if (!isFinalToken && !isSentenceEnd) {
							continue;
						}
					}
				}
				else if (i > 0) {
					if (!wordSeparators.has(token.charAt(wordIndex - 1))) {
						continue;
					}
					if (smallWords.has(word) && wordSeparators.has(nextChar)) {
						continue;
					}
				}
				value = upperAt(value, wordIndex, locale);
			}
			result += value;
			isNewSentence =
				isSentenceEnd || terminators.has(token.charAt(token.length - 1));
		}
	}
	return result;
}

function upperAt(input, index, locale) {
	return (input.slice(0, index) +
		input.charAt(index).toLocaleUpperCase(locale) +
		input.slice(index + 1));
}