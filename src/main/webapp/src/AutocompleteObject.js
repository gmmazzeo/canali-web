var AutocompleteObject = (function () {
    function AutocompleteObject(text, restrictedText, state, labels, tokenType, relatedTokenPosition, relatedTokenText, keywords, finalPunctuation, isPrefix, mustBeAccepted, remainder, similarity) {
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
    AutocompleteObject.highlight = function (template, value, term) {
    };
    AutocompleteObject.prototype.toLiForDropdown = function (highlightedText) {
        var res = $('<li></li>');
        var p = $('<p></p>');
        p.addClass(this.tokenType);
        var text = this.text;
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
    };
    AutocompleteObject.prototype.toLiForInput = function () {
        var res = $('<li></li>');
        var p = $('<p></p>');
        p.addClass(this.tokenType);
        if (this.labels) {
            var title = this.labels;
            if (this.relatedTokenPosition) {
                title += " related to " + this.relatedTokenText;
            }
            p.attr('title', title);
        }
        var text = this.text.trim();
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
    };
    AutocompleteObject.fromJQueryItem = function (item) {
        var text = item[AutocompleteObject.TEXT_FIELD];
        var restrictedText = item[AutocompleteObject.RESTRICTED_TEXT_FIELD];
        var state = item[AutocompleteObject.STATE_FIELD];
        var labels = item[AutocompleteObject.LABELS_FIELD];
        var tokenType = item[AutocompleteObject.TOKEN_TYPE_FIELD];
        var relatedTokenPosition = item[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD];
        var relatedTokenText = item[AutocompleteObject.RELATED_TOKEN_TEXT_FIELD];
        var keywords = item[AutocompleteObject.KEYWORDS_FIELD];
        var finalPunctuation = item[AutocompleteObject.FINAL_PUNCTUATION_FIELD];
        var isPrefix = item[AutocompleteObject.IS_PREFIX_FIELD];
        var mustBeAccepted = item[AutocompleteObject.MUST_BE_ACCEPTED_FIELD];
        var remainder = item[AutocompleteObject.REMAINDER_FIELD];
        var similarity = item[AutocompleteObject.SIMILARITY_FIELD];
        return new AutocompleteObject(text, restrictedText, state, labels, tokenType, relatedTokenPosition, relatedTokenText, keywords, finalPunctuation, isPrefix, mustBeAccepted, remainder, similarity);
    };
    AutocompleteObject.TEXT_FIELD = "t";
    AutocompleteObject.RESTRICTED_TEXT_FIELD = "r";
    AutocompleteObject.STATE_FIELD = "s";
    AutocompleteObject.LABELS_FIELD = "l";
    AutocompleteObject.TOKEN_TYPE_FIELD = "k";
    AutocompleteObject.RELATED_TOKEN_POSITION_FIELD = "c";
    AutocompleteObject.KEYWORDS_FIELD = "f";
    AutocompleteObject.FINAL_PUNCTUATION_FIELD = "p";
    AutocompleteObject.RELATED_TOKEN_TEXT_FIELD = "d";
    AutocompleteObject.IS_PREFIX_FIELD = "ip";
    AutocompleteObject.MUST_BE_ACCEPTED_FIELD = "mba";
    AutocompleteObject.REMAINDER_FIELD = "b";
    AutocompleteObject.SIMILARITY_FIELD = "sim";
    AutocompleteObject.INITIAL_STATE_S0 = "0";
    AutocompleteObject.FINAL_STATE_SF = "f";
    AutocompleteObject.ACCEPT_CONCEPT_STATE_S1 = "1";
    AutocompleteObject.ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2 = "2";
    AutocompleteObject.ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S3 = "3";
    AutocompleteObject.ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S4 = "4";
    AutocompleteObject.ACCEPT_DIRECT_OPERAND_STATE_S5 = "5";
    AutocompleteObject.ACCEPT_INDIRECT_OPERAND_STATE_S6 = "6";
    AutocompleteObject.ACCEPT_SELF_PROPERTY_AS_DIRECT_OPERAND_STATE_S7 = "7";
    AutocompleteObject.ACCEPT_SELF_PROPERTY_AS_INDIRECT_OPERAND_STATE_S8 = "8";
    AutocompleteObject.ACCEPT_PROPERTY_FOR_RANK_STATE_S9 = "9";
    AutocompleteObject.ACCEPT_PROPERTY_FOR_UNARY_OPERATOR_S10 = "10";
    //token type
    AutocompleteObject.ENTITY = "entity";
    AutocompleteObject.PROPERTY = "property";
    AutocompleteObject.CLASS = "class";
    AutocompleteObject.QUESTION_START = "question_start";
    return AutocompleteObject;
}());
