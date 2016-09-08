class AutocompleteObject {

    static TEXT_FIELD = "t";
    static RESTRICTED_TEXT_FIELD = "r";
    static STATE_FIELD = "s";
    static LABELS_FIELD = "l";
    static TOKEN_TYPE_FIELD = "k";
    static RELATED_TOKEN_POSITION_FIELD = "c";
    static KEYWORDS_FIELD = "f";
    static FINAL_PUNCTUATION_FIELD = "p";
    static RELATED_TOKEN_TEXT_FIELD = "d";
    static IS_PREFIX_FIELD = "ip";
    static MUST_BE_ACCEPTED_FIELD = "mba";
    static REMAINDER_FIELD = "b";
    static SIMILARITY_FIELD = "sim";


    static INITIAL_STATE_S0 = "0";
    static FINAL_STATE_SF = "f";
    static ACCEPT_CONCEPT_STATE_S1 = "1";
    static ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2 = "2";    
    static ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S3 = "3";
    static ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S4 = "4";
    static ACCEPT_DIRECT_OPERAND_STATE_S5 = "5";
    static ACCEPT_INDIRECT_OPERAND_STATE_S6 = "6";
    static ACCEPT_SELF_PROPERTY_AS_DIRECT_OPERAND_STATE_S7 = "7";
    static ACCEPT_SELF_PROPERTY_AS_INDIRECT_OPERAND_STATE_S8 = "8";
    static ACCEPT_PROPERTY_FOR_RANK_STATE_S9 = "9";
    static ACCEPT_PROPERTY_FOR_UNARY_OPERATOR_S10 = "10";

    //token type
    static ENTITY = "entity";
    static PROPERTY = "property";
    static CLASS = "class";
    static QUESTION_START = "question_start";

    text: string;
    restrictedText: string;
    state: string;
    labels: string;
    tokenType: string;
    relatedTokenPosition: number;
    relatedTokenText: string;
    keywords: string[];
    finalPuntuation: string;
    isPrefix: boolean;
    mustBeAccepted: boolean;
    remainder: string;
    similarity: number;

    constructor(text: string, restrictedText: string, state: string,
        labels: string, tokenType: string, relatedTokenPosition: number,
        relatedTokenText: string, keywords: string[], finalPunctuation: string,
        isPrefix: boolean, mustBeAccepted: boolean, remainder: string, similarity: number) {
        this.text = text;
        this.restrictedText = restrictedText;
        this.state = state;
        this.labels = labels;
        this.tokenType = tokenType;
        this.relatedTokenPosition = relatedTokenPosition;
        this.relatedTokenText = relatedTokenText;
        this.keywords = keywords;
        this.finalPuntuation = finalPunctuation;
        this.isPrefix = isPrefix;
        this.mustBeAccepted = mustBeAccepted;
        this.remainder = remainder;
        this.similarity = similarity;
    }

    private static highlight(template: JQuery, value, term) {

    }

    public toLiForDropdown(highlightedText: string): JQuery {
        let res = $('<li></li>');
        let p = $('<p></p>');
        p.addClass(this.tokenType);
        let text = this.text;
        if (this.relatedTokenPosition) {
            text += " (related to " + this.relatedTokenText + ")";
        }
        /*
        if (this.keywords && this.keywords.length > 0) {
            text += " (" + this.keywords[0];
            for (var i = 1; i < this.keywords.length; i++) {
                text += " " + this.keywords[i];
            }
            text += ")";
        }
        */
        if (this.labels && this.labels !== this.text) {
            text += " <" + this.labels + ">";
        }
        p.text(text);
        res.append(p);
        res.data('token', this);
        return res;
    }

    public toLiForInput(): JQuery {
        let res = $('<li></li>');
        let p = $('<p></p>');
        p.addClass(this.tokenType);
        if (this.labels) {
            let title = this.labels;
            if (this.relatedTokenPosition) {
                title += " related to " + this.relatedTokenText;
            }
            p.attr('title', title);
        }
        let text = this.text.trim();
        /*
            if (this.keywords && this.keywords.length > 0) {
            text += " (" + this.keywords[0];
            for (var i = 1; i < this.keywords.length; i++) {
                text += " " + this.keywords[i];
            }
            text += ")";
        }
        */
        p.text(text);
        res.append(p);
        res.data('token', this);
        return res;
    }

    public static fromJQueryItem(item: JQuery): AutocompleteObject {
        let text: string = item[AutocompleteObject.TEXT_FIELD];
        let restrictedText: string = item[AutocompleteObject.RESTRICTED_TEXT_FIELD];
        let state: string = item[AutocompleteObject.STATE_FIELD];
        let labels: string = item[AutocompleteObject.LABELS_FIELD];
        let tokenType: string = item[AutocompleteObject.TOKEN_TYPE_FIELD];
        let relatedTokenPosition: number = item[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD];
        let relatedTokenText: string = item[AutocompleteObject.RELATED_TOKEN_TEXT_FIELD];
        let keywords: string[] = item[AutocompleteObject.KEYWORDS_FIELD];
        let finalPunctuation: string = item[AutocompleteObject.FINAL_PUNCTUATION_FIELD];
        let isPrefix: boolean = item[AutocompleteObject.IS_PREFIX_FIELD];
        let mustBeAccepted: boolean = item[AutocompleteObject.MUST_BE_ACCEPTED_FIELD];
        let remainder: string = item[AutocompleteObject.REMAINDER_FIELD];
        let similarity: number = item[AutocompleteObject.SIMILARITY_FIELD];
        return new AutocompleteObject(text, restrictedText, state,
            labels, tokenType, relatedTokenPosition,
            relatedTokenText, keywords, finalPunctuation,
            isPrefix, mustBeAccepted, remainder, similarity);
    }

}
