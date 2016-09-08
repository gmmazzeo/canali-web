var CanaliInput = (function () {
    function CanaliInput(inputDivId, autocompleterUrl, translateUrl, queryUrl, resultDivId, settingsDivId, minChars, searchDelay) {
        this.acceptedTokens = new Array(); //The accepted tokens
        this.inputDivId = inputDivId;
        this.autocompleterUrl = autocompleterUrl;
        this.translateUrl = translateUrl;
        this.queryUrl = queryUrl;
        this.resultDivId = resultDivId;
        this.settingsDivId = settingsDivId;
        this.minChars = minChars;
        this.searchDelay = searchDelay;
        //fill the settings div
        var settingsDiv = $("#" + this.settingsDivId);
        this.endpointInput = $("<input value=\"default\" title=\"The sparql end-point url\" />");
        this.limitInput = $("<input value=\"100\" title=\"The maximum number of results\" />");
        this.contextRulesDisabledInput = $("<input type=\"checkbox\" title=\"Disable the use of context rules\" />");
        this.autoAcceptanceDisabledInput = $("<input type=\"checkbox\" title=\"Disable the use of automatic acceptance of tokens\" />");
        this.subClassesDisabledInput = $("<input type=\"checkbox\" title=\"Disable the search of subclasses\" />");
        settingsDiv.empty();
        settingsDiv.append($("<span>Endpoint: </span>")).append(this.endpointInput).append($("<br />")).append($("<br />"));
        settingsDiv.append($("<span>Limit: </span>")).append(this.limitInput).append($("<br />")).append($("<br />"));
        settingsDiv.append($("<span>Disable context rules: </span>")).append(this.contextRulesDisabledInput).append($("<br />")).append($("<br />"));
        settingsDiv.append($("<span>Disable auto-acceptance: </span>")).append(this.autoAcceptanceDisabledInput).append($("<br />")).append($("<br />"));
        settingsDiv.append($("<span>Disable subclasses: </span>")).append(this.subClassesDisabledInput).append($("<br />")).append($("<br />"));
        var inputDiv = $("#" + this.inputDivId);
        //empty the input div
        inputDiv.html("");
        var self = this;
        //create the inputBox, that is the box where the user can type
        this.inputBox = $("<input />")
            .attr("type", "text")
            .attr("autocomplete", "off")
            .attr("autocapitalize", "off")
            .css({
            outline: "none"
        })
            .focus(function () {
            self.tokenList.addClass(CanaliInput.CSS_CLASSES['focused']);
        })
            .blur(function () {
            self.tokenList.removeClass(CanaliInput.CSS_CLASSES['focused']);
        })
            .keyup(function (event) {
            self.resizeInput();
        })
            .blur(function (event) {
            self.resizeInput();
        })
            .keydown(function (event) {
            var code = event.keyCode;
            if (code !== CanaliInput.BACKSPACE && code !== CanaliInput.ENTER &&
                self.getCurrentState() == AutocompleteObject.FINAL_STATE_SF) {
                return false; //cannot type anymore
            }
            switch (code) {
                case CanaliInput.LEFT:
                case CanaliInput.RIGHT:
                    break; //just move the cursor in input
                case CanaliInput.UP:
                    self.selectNextDropdownItem();
                    break;
                case CanaliInput.DOWN:
                    self.selectPreviousDropdownItem();
                    break;
                case CanaliInput.BACKSPACE:
                    if (String(self.inputBox.val()).length == 0) {
                        self.reactivateLastAcceptedToken();
                        self.resizeInput();
                        return false;
                    }
                    else if (String(self.inputBox.val()).length === 1) {
                        self.hideDropdown();
                    }
                    else {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function () {
                            self.doAutocompleterSearch();
                        }, 5);
                    }
                    break;
                case CanaliInput.TAB:
                case CanaliInput.NUMPAD_ENTER:
                    if (self.selectedDropdownItem != null) {
                        self.addAcceptedToken(self.selectedDropdownItem.data['token']);
                    }
                    else {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    return false;
                case CanaliInput.ENTER:
                    if (self.getCurrentState() === AutocompleteObject.FINAL_STATE_SF) {
                        self.doTranslation();
                        break;
                    }
                    return false;
                case CanaliInput.ESCAPE:
                    self.hideDropdown();
                    return true;
                default:
                    if (String.fromCharCode(event.which)) {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function () {
                            self.doAutocompleterSearch();
                        }, 5);
                    }
                    break;
            }
        });
        //create the tokenList, that appears to be a complex input, inside the inputDiv
        this.tokenList = $("<ul />")
            .addClass(CanaliInput.CSS_CLASSES['tokenList'])
            .click(function (event) {
            var li = $(event.target).closest("li");
            if (li && li.get(0) && $.data(li.get(0), "tokeninput")) {
                self.toggleSelectedToken(li);
            }
            else {
                // Deselect selected token
                if (self.selectedToken) {
                }
                //Focus input box
                self.focusWithTimeout(self.inputBox);
            }
        })
            .mouseover(function (event) {
            var li = $(event.target).closest("li");
            if (li && self.selectedToken !== this) {
                li.addClass(CanaliInput.CSS_CLASSES['highlightedToken']);
            }
        })
            .mouseout(function (event) {
            var li = $(event.target).closest("li");
            if (li && self.selectedToken !== this) {
                li.removeClass(CanaliInput.CSS_CLASSES['highlightedToken']);
            }
        });
        this.inputToken = $("<li />")
            .addClass(CanaliInput.CSS_CLASSES['inputToken'])
            .appendTo(this.tokenList)
            .append(this.inputBox);
        this.dropdown = $("<div/>")
            .addClass(CanaliInput.CSS_CLASSES['dropdown'])
            .appendTo("body")
            .hide();
        inputDiv.append(this.tokenList);
        this.inputResizer = $("<tester/>")
            .insertAfter(this.inputBox)
            .css({
            position: "absolute",
            top: -9999,
            left: -9999,
            width: "auto",
            fontSize: this.inputBox.css("fontSize"),
            fontFamily: this.inputBox.css("fontFamily"),
            fontWeight: this.inputBox.css("fontWeight"),
            letterSpacing: this.inputBox.css("letterSpacing"),
            whiteSpace: "nowrap"
        });
    }
    CanaliInput.coerceToString = function (val) {
        return String((val === null || val === undefined) ? '' : val);
    };
    CanaliInput._escapeHTML = function (text) {
        return CanaliInput.coerceToString(text).replace(CanaliInput.HTML_ESCAPE_CHARS, function (match) {
            return CanaliInput.HTML_ESCAPES[match];
        });
    };
    CanaliInput.prototype.toggleSelectedToken = function (token) {
        var previousSelectedToken = this.selectedToken;
        if (this.selectedToken) {
            this.deselectToken($(this.selectedToken), CanaliInput.POSITION['END']);
        }
        if (previousSelectedToken === $(token.get(0))) {
            this.deselectToken(token, CanaliInput.POSITION['END']);
        }
        else {
            this.selectToken(token);
        }
    };
    // Select a token in the token list
    CanaliInput.prototype.selectToken = function (token) {
        token.addClass(CanaliInput.CSS_CLASSES['selectedToken']);
        this.selectedToken = $(token.get(0));
        // Hide input box
        this.inputBox.val("");
        // Hide dropdown if it is visible (eg if we clicked to select token)
        this.hideDropdown();
    };
    // Deselect a token in the token list
    CanaliInput.prototype.deselectToken = function (token, position) {
        token.removeClass(CanaliInput.CSS_CLASSES['selectedToken']);
        this.selectedToken = null;
        if (position === CanaliInput.POSITION['BEFORE']) {
            this.inputToken.insertBefore(token);
            this.selectedTokenIndex--;
        }
        else if (position === CanaliInput.POSITION['AFTER']) {
            this.inputToken.insertAfter(token);
            this.selectedTokenIndex++;
        }
        else {
            this.inputToken.appendTo(this.tokenList);
            this.selectedTokenIndex = this.acceptedTokens.length;
        }
        // Show the input box and give it focus again
        this.focusWithTimeout(this.inputBox);
    };
    // Hide and clear the results dropdown
    CanaliInput.prototype.hideDropdown = function () {
        this.dropdown.hide().empty();
        this.selectedDropdownItem = null;
    };
    CanaliInput.prototype.focusWithTimeout = function (object) {
        setTimeout(function () {
            object.focus();
        }, 50);
    };
    CanaliInput.prototype.resizeInput = function () {
        var oldInputVal = this.inputVal;
        this.inputVal = this.inputBox.val();
        if (this.inputVal === oldInputVal) {
            return;
        }
        // Get width left on the current line
        var width_left = this.tokenList.width() - this.inputBox.offset().left - this.tokenList.offset().left;
        // Enter new content into resizer and resize input accordingly
        this.inputResizer.html(CanaliInput._escapeHTML(this.inputVal));
        // Get maximum width, minimum the size of input and maximum the widget's width
        this.inputBox.width(Math.min(this.tokenList.width(), Math.max(width_left, this.inputResizer.width() + 30)));
    };
    CanaliInput.prototype.reactivateLastAcceptedToken = function () {
        if (this.acceptedTokens.length == 0) {
            return;
        }
        var previousToken = this.inputToken.prev();
        if (!previousToken) {
            return;
        }
        // Delete the token
        previousToken.remove();
        this.selectedToken = null;
        // Show the input box and give it focus again
        this.focusWithTimeout(this.inputBox);
        var reactivated = this.acceptedTokens.pop();
        // Refill input box
        this.inputBox.val(reactivated.text);
        if (this.acceptedTokens.length === 0) {
            this.inputBox.attr("placeholder", "Type something");
        }
        this.hideDropdown();
        this.doAutocompleterSearch();
    };
    CanaliInput.prototype.getCurrentState = function () {
        if (this.acceptedTokens.length == 0) {
            return AutocompleteObject.INITIAL_STATE_S0;
        }
        return this.acceptedTokens[this.acceptedTokens.length - 1].state;
    };
    CanaliInput.prototype.getLastAcceptedProperty = function () {
        var i = this.acceptedTokens.length - 1;
        while (i > 0) {
            if (this.acceptedTokens[i - 1].state !== AutocompleteObject.ACCEPT_PROPERTY_FOR_RANK_STATE_S9 &&
                this.acceptedTokens[i].tokenType === AutocompleteObject.PROPERTY) {
                return this.acceptedTokens[i].labels;
            }
            i--;
        }
        return null;
    };
    CanaliInput.prototype.getOpenVariables = function (onlyLast) {
        var i = this.acceptedTokens.length - 1;
        var res = ["", "", ""];
        var contextVariablePosition;
        while (i >= 0) {
            if (this.acceptedTokens[i].tokenType === AutocompleteObject.PROPERTY) {
                if (!contextVariablePosition || contextVariablePosition === i) {
                    var ll = this.acceptedTokens[i].labels.split("|");
                    for (var k = 0; k < ll.length; k++) {
                        if (res[0].length > 0) {
                            res[0] += ",";
                            res[1] += ",";
                            res[2] += ",";
                        }
                        res[0] += ll[k];
                        res[1] += this.acceptedTokens[i].text;
                        res[2] += i;
                    }
                    contextVariablePosition = this.acceptedTokens[i].relatedTokenPosition;
                    if (onlyLast) {
                        break;
                    }
                }
            }
            else if (this.acceptedTokens[i].tokenType === AutocompleteObject.CLASS) {
                if (!contextVariablePosition || contextVariablePosition === i) {
                    if (res[0].length > 0) {
                        res[0] += ",";
                        res[1] += ",";
                        res[2] += ",";
                    }
                    res[0] += this.acceptedTokens[i].labels;
                    res[1] += this.acceptedTokens[i].text;
                    res[2] += i;
                    contextVariablePosition = this.acceptedTokens[i].relatedTokenPosition;
                    if (onlyLast) {
                        break;
                    }
                }
            }
            else if (this.acceptedTokens[i].tokenType === AutocompleteObject.QUESTION_START && /has$/.test(this.acceptedTokens[i].labels)) {
                if (res[0].length > 0) {
                    res[0] += ",";
                    res[1] += ",";
                    res[2] += ",";
                }
                res[0] += "http://www.w3.org/2002/07/owl#Thing";
                res[1] += this.acceptedTokens[i].text;
                res[2] += i;
                contextVariablePosition = 0;
                if (onlyLast) {
                    break;
                }
            }
            i--;
        }
        return res;
    };
    CanaliInput.prototype.getFinalPunctuation = function () {
        if (this.acceptedTokens.length === 0) {
            return "?";
        }
        return this.acceptedTokens[0].finalPuntuation;
    };
    ;
    // Highlight an item in the results dropdown
    CanaliInput.prototype.selectDropdownItem = function (item) {
        if (this.selectedDropdownItem) {
            this.selectedDropdownItem.removeClass(CanaliInput.CSS_CLASSES['selectedDropdownItem']);
        }
        if (item) {
            item.addClass(CanaliInput.CSS_CLASSES['selectedDropdownItem']);
            this.selectedDropdownItem = item;
        }
    };
    // Remove highlighting from an item in the results dropdown
    CanaliInput.prototype.deselectDropdownItem = function (item) {
        if (item != null) {
            item.removeClass(CanaliInput.CSS_CLASSES['selectedDropdownItem']);
            this.selectedDropdownItem = null;
        }
    };
    CanaliInput.prototype.selectNextDropdownItem = function () {
        if (this.selectedDropdownItem == null) {
            this.selectDropdownItem(this.dropdown.find('li').first());
        }
        else {
            var lastItem = this.dropdown.find('li').last();
            if (this.selectedDropdownItem != lastItem) {
                this.selectDropdownItem(this.selectedDropdownItem.next());
            }
        }
    };
    CanaliInput.prototype.selectPreviousDropdownItem = function () {
        if (this.selectedDropdownItem == null) {
            this.selectDropdownItem(this.dropdown.find('li').first());
        }
        else {
            var firstItem = this.dropdown.find('li').first();
            if (this.selectedDropdownItem != firstItem) {
                this.selectDropdownItem(this.selectedDropdownItem.prev());
            }
        }
    };
    CanaliInput.prototype.getAutocompleteObject = function (item) {
        return item.data('token');
    };
    // Do a search and show the "searching" dropdown if the input is longer
    // than $(input).data("settings").minChars
    CanaliInput.prototype.doAutocompleterSearch = function () {
        var query = String(this.inputBox.val());
        if (query && query.length) {
            if (this.selectedToken != null) {
                this.deselectToken(this.selectedToken, CanaliInput.POSITION['AFTER']);
            }
            var self_1 = this;
            if (query.length >= this.minChars || query.length > 0 && (query[0] === '?' || query[0] === '.')) {
                this.showDropdownMessage("Searching");
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    self_1.runAutocompleterSearch(query);
                }, this.searchDelay);
            }
            else {
                this.hideDropdown();
            }
        }
    };
    CanaliInput.prototype.runAutocompleterSearch = function (query) {
        var self = this;
        this.runSearchAutocompleterGeneric(query, function (results, query) {
            // populate the dropdown only if the results are associated with the active search query
            if (!results || results.length === 0) {
                if (self.acceptedTokens.length > 1 && self.getCurrentState() === AutocompleteObject.FINAL_STATE_SF) {
                    self.hideDropdown();
                }
                else if (query.length == 0 && self.acceptedTokens.length === 0) {
                    self.showDropdownMessage("Start typing a question (e.g., What is the ...)");
                }
                else if (query.length < 4) {
                    self.showDropdownMessage("Continue typing the question");
                }
                else {
                    self.showDropdownMessage("No results");
                }
            }
            else {
                if (String(self.inputBox.val()) === query) {
                    if (results[0].mustBeAccepted && results.length === 1) {
                        self.addAcceptedToken(results[0]);
                    }
                    else {
                        self.populateDropdown(results);
                    }
                }
                else {
                    self.hideDropdown();
                }
            }
        });
    };
    // Do the actual autocomplete search
    CanaliInput.prototype.runSearchAutocompleterGeneric = function (query, successFunction) {
        // Extract existing get params
        var ajaxParams = {};
        ajaxParams.data = {};
        ajaxParams.data[CanaliInput.STATE] = this.getCurrentState();
        ajaxParams.data[CanaliInput.CONTEXT_RULES_DISABLED] = this.contextRulesDisabledInput.is(':checked');
        ajaxParams.data[CanaliInput.AUTO_ACCEPTANCE] = !this.autoAcceptanceDisabledInput.is(':checked');
        var lastAcceptedProperty;
        var openVariables;
        if (this.acceptedTokens.length > 0) {
            if ((this.acceptedTokens[this.acceptedTokens.length - 1].state == AutocompleteObject.ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S4 ||
                this.acceptedTokens[this.acceptedTokens.length - 1].state == AutocompleteObject.ACCEPT_DIRECT_OPERAND_STATE_S5)
                &&
                    (this.acceptedTokens[this.acceptedTokens.length - 1].labels === 'year=' ||
                        this.acceptedTokens[this.acceptedTokens.length - 1].labels === 'month=')) {
                ajaxParams.data[CanaliInput.DATE_TO_NUMBER] = 'true';
            }
            lastAcceptedProperty = this.getLastAcceptedProperty();
            if (lastAcceptedProperty) {
                ajaxParams.data[CanaliInput.LAST_ACCEPTED_PROPERTY] = lastAcceptedProperty;
            }
            var propertyHaving = this.acceptedTokens.length > 2 &&
                this.acceptedTokens[this.acceptedTokens.length - 1].state === AutocompleteObject.ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S3 &&
                this.acceptedTokens[this.acceptedTokens.length - 2].state === AutocompleteObject.ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S4;
            openVariables = this.getOpenVariables(propertyHaving);
            if (openVariables) {
                ajaxParams.data[CanaliInput.OPEN_VARIABLES_URI] = openVariables[0];
                ajaxParams.data[CanaliInput.OPEN_VARIABLES_POSITION] = openVariables[2];
            }
            ajaxParams.data[CanaliInput.FINAL_PUNCTUATION] = this.getFinalPunctuation();
        }
        if (this.autocompleterUrl.indexOf("?") > -1) {
            var parts = this.autocompleterUrl.split("?");
            ajaxParams.url = parts[0];
            var param_array = parts[1].split("&");
            $.each(param_array, function (index, value) {
                var kv = value.split("=");
                ajaxParams.data[kv[0]] = kv[1];
            });
        }
        else {
            ajaxParams.url = this.autocompleterUrl;
        }
        // Prepare the request
        ajaxParams.data[CanaliInput.QUERY] = query;
        ajaxParams.type = "POST";
        ajaxParams.dataType = "json";
        var self = this;
        // Attach the success callback
        ajaxParams.success = function (results) {
            var autocompleterResults = self.postProcessResults(results, query);
            successFunction(autocompleterResults, query);
        };
        // Make the request
        $.ajax(ajaxParams);
    };
    CanaliInput.prototype.showDropdown = function () {
        this.dropdown
            .css({
            position: "absolute",
            top: this.tokenList.offset().top + this.tokenList.outerHeight(true),
            left: this.tokenList.offset().left,
            width: this.tokenList.width(),
            'z-index': $(this.tokenList).css("zindex")
        })
            .show();
    };
    CanaliInput.prototype.showDropdownMessage = function (msg) {
        this.dropdown.html("<p>" + msg + "</p>");
        this.showDropdown();
    };
    CanaliInput.prototype.compare = function (a, b) {
        if (b.relatedTokenPosition === -1) {
            if (a.relatedTokenPosition !== -1) {
                return 1;
            }
            else {
                return -1;
            }
        }
        if (a.similarity < b.similarity)
            return 1;
        if (a.similarity > b.similarity)
            return -1;
        if (a.tokenType < b.tokenType)
            return -1;
        if (a.tokenType > b.tokenType)
            return 1;
        if (a.restrictedText < b.restrictedText)
            return -1;
        if (a.restrictedText > b.restrictedText)
            return 1;
        if (a.relatedTokenPosition < b.relatedTokenPosition)
            return 1;
        if (a.relatedTokenPosition > b.relatedTokenPosition)
            return -1;
        return 0;
        //return (/Inv$/.test(a[LABEL])?"1" :"0") ^ (/Inv$/.test(b[LABEL])?"1" :"0");
    };
    //create the AutocompleteObjects from JSON and merge the tokens of the same type with the same label
    CanaliInput.prototype.postProcessResults = function (results, query) {
        var finalResults = new Array();
        var self = this;
        if (results) {
            $.each(results, function (index, value) {
                if (!value[AutocompleteObject.RESTRICTED_TEXT_FIELD]) {
                    value[AutocompleteObject.RESTRICTED_TEXT_FIELD] = value[AutocompleteObject.TEXT_FIELD];
                }
                if (typeof value[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD] !== 'undefined' && value[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD] !== -1) {
                    value[AutocompleteObject.RELATED_TOKEN_TEXT_FIELD] = self.acceptedTokens[value[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD]].restrictedText;
                }
                //check if it is possibile to merge this result with the previous one
                if (finalResults.length > 0 && value[AutocompleteObject.TOKEN_TYPE_FIELD] === AutocompleteObject.PROPERTY &&
                    value[AutocompleteObject.TOKEN_TYPE_FIELD] === finalResults[finalResults.length - 1].tokenType &&
                    value[AutocompleteObject.RESTRICTED_TEXT_FIELD] === finalResults[finalResults.length - 1].restrictedText &&
                    value[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD] === finalResults[finalResults.length - 1].relatedTokenPosition) {
                    finalResults[finalResults.length - 1].labels += "|" + results[index - 1][AutocompleteObject.LABELS_FIELD];
                }
                else {
                    finalResults.push(AutocompleteObject.fromJQueryItem(value));
                }
            });
            finalResults.sort(this.compare);
            if (finalResults.length > 0) {
                var threshold = Math.max(0, results[0].sim * 0.67);
                var i = 1;
                while (i < finalResults.length) {
                    //if (results[i].sim < threshold) {
                    //    break;
                    //}
                    //check if it is possibile to merge this result with the previous one
                    i++;
                }
                finalResults = finalResults.slice(0, i);
            }
        }
        return finalResults;
    };
    CanaliInput.prototype.addAcceptedToken = function (token) {
        // Clear input box
        if (token.remainder && token.remainder.length > 0) {
            this.inputBox.val(token.remainder);
        }
        else {
            this.inputBox.val("");
        }
        // Squeeze input_box so we force no unnecessary line break
        if (token.remainder && token.remainder.length > 0) {
            this.resizeInput();
        }
        else {
            this.inputBox.width(1);
        }
        // Insert the new tokens
        //debugger;
        var item = token.toLiForInput();
        //check the following
        item.addClass(CanaliInput.CSS_CLASSES['tokenReadOnly']);
        item.addClass(CanaliInput.CSS_CLASSES['token']).insertBefore(this.inputToken);
        this.acceptedTokens.push(token);
        // Remove the placeholder so it's not seen after you've added a token
        this.inputBox.attr("placeholder", null);
        // Don't show the help dropdown, they've got the idea
        this.hideDropdown();
        if (token.remainder && token.remainder.length > 0) {
            this.doAutocompleterSearch();
        }
        else if (token.state === AutocompleteObject.FINAL_STATE_SF) {
            this.doTranslation();
        }
    };
    CanaliInput.prototype.populateDropdown = function (results) {
        if (results && results.length > 0) {
            var j = results.length;
            while (j > 0 && results[j - 1].relatedTokenPosition === -1) {
                j--;
            }
            if (j < results.length) {
                var entityCount = 0;
                var lastEntityIndex = 0;
                var classCount = 0;
                var msg = "If you are searching for";
                if (j < results.length - 1) {
                    msg += " one of the following";
                }
                msg += "<br /><br /><ul>";
                var k = j;
                while (k < results.length) {
                    if (results[k].tokenType === AutocompleteObject.ENTITY) {
                        msg += "<li><b>" + results[k].restrictedText + "</b> &lt<a href=\"javascript:void(0);\" onclick=\"openEntityDialog('" + results[k].restrictedText + "','" + results[k].labels + "')\" >" + results[k].labels + "</a>&gt</li>";
                        entityCount++;
                        lastEntityIndex = k;
                    }
                    else {
                        msg += "<li><b>" + results[k].restrictedText + "</b> &lt" + results[k].restrictedText + "&gt</li>";
                    }
                    k++;
                }
                msg += "</ul><br />please, be advised that there are no matches for your question in the currently adopted KB.<br /><br />";
                if (entityCount > 0) {
                    if (entityCount > 1) {
                        msg += "Click on one of the links above for a list of the properties of the entity you are searching.";
                    }
                    else {
                        msg += "Click on the link above for a list of the properties of <b>" + results[lastEntityIndex].restrictedText + "</b>.";
                    }
                }
                console.log(msg);
            }
            this.dropdown.empty();
            var self = this;
            var dropdown_ul = $("<ul/>")
                .appendTo(this.dropdown)
                .mouseover(function (event) {
                self.selectDropdownItem($(event.target).closest("li"));
            })
                .mousedown(function (event) {
                self.addAcceptedToken($(event.target).closest("li").data("tokeninput"));
                return false;
            })
                .hide();
            var query = this.inputBox.val();
            $.each(results, function (index, value) {
                var this_li = value.toLiForDropdown(query);
                this_li = $(this_li).appendTo(dropdown_ul);
                if (index % 2) {
                    this_li.addClass(CanaliInput.CSS_CLASSES['dropdownItem']);
                }
                else {
                    this_li.addClass(CanaliInput.CSS_CLASSES['dropdownItem2']);
                }
                if (index === 0) {
                    self.selectDropdownItem(this_li);
                }
                $.data(this_li.get(0), "tokeninput", value);
            });
            this.showDropdown();
            dropdown_ul.show();
        }
        else {
            //TODO: suggest what to type according to the state
            this.dropdown.html("<p>No results</p>");
            this.showDropdown();
        }
    };
    CanaliInput.prototype.doTranslation = function () {
        this.hideDropdown();
        var ajaxParams = {};
        ajaxParams.data = {};
        var states = [];
        for (var i = 0; i < this.acceptedTokens.length; i++) {
            var t = {};
            t[AutocompleteObject.STATE_FIELD] = this.acceptedTokens[i].state;
            t[AutocompleteObject.LABELS_FIELD] = this.acceptedTokens[i].labels;
            t[AutocompleteObject.TOKEN_TYPE_FIELD] = this.acceptedTokens[i].tokenType;
            t[AutocompleteObject.RESTRICTED_TEXT_FIELD] = this.acceptedTokens[i].restrictedText;
            t[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD] = this.acceptedTokens[i].relatedTokenPosition;
            states.push(t);
        }
        ajaxParams.data[CanaliInput.STATES] = JSON.stringify(states);
        ajaxParams.data[CanaliInput.ENDPOINT] = this.endpointInput.val();
        ajaxParams.data[CanaliInput.LIMIT] = this.limitInput.val();
        ajaxParams.data[CanaliInput.USE_OF_SUBCLASS] = !this.subClassesDisabledInput.is(':checked');
        if (this.translateUrl.indexOf("?") > -1) {
            var parts = this.translateUrl.split("?");
            ajaxParams.url = parts[0];
            var param_array = parts[1].split("&");
            $.each(param_array, function (index, value) {
                var kv = value.split("=");
                ajaxParams.data[kv[0]] = kv[1];
            });
        }
        else {
            ajaxParams.url = this.translateUrl;
        }
        // Prepare the request
        ajaxParams.type = "POST";
        ajaxParams.dataType = "json";
        // Attach the success callback
        var self = this;
        ajaxParams.success = function (result) {
            self.showTranslation(result);
        };
        // Make the request
        $.ajax(ajaxParams);
    };
    CanaliInput.prototype.showTranslation = function (result) {
        var div = $("#" + this.resultDivId);
        if (result['error']) {
            div.text(result['error']);
        }
        else {
            div.html("<img src='img/processing.gif' /><br />Executing the following SPARQL query @ " + result['endPoint'] + "<br /><br />");
            var pre = $('<pre style="clear: both; margin: 30px;"></pre>');
            var question = "";
            for (var i = 0; i < this.acceptedTokens.length; i++) {
                if (i > 0 && i < this.acceptedTokens.length - 1) {
                    question += " ";
                }
                question += this.acceptedTokens[i].text;
            }
            pre.text(question + "\n\n" + result['query'] + "\n\n" + Date.now());
            $(div).append(pre);
            this.doQuery();
        }
    };
    CanaliInput.prototype.doQuery = function () {
        this.hideDropdown();
        var ajaxParams = {};
        ajaxParams.data = {};
        var states = [];
        for (var i = 0; i < this.acceptedTokens.length; i++) {
            var t = {};
            t[AutocompleteObject.STATE_FIELD] = this.acceptedTokens[i].state;
            t[AutocompleteObject.LABELS_FIELD] = this.acceptedTokens[i].labels;
            t[AutocompleteObject.TOKEN_TYPE_FIELD] = this.acceptedTokens[i].tokenType;
            t[AutocompleteObject.RESTRICTED_TEXT_FIELD] = this.acceptedTokens[i].restrictedText;
            t[AutocompleteObject.RELATED_TOKEN_POSITION_FIELD] = this.acceptedTokens[i].relatedTokenPosition;
            states.push(t);
        }
        ajaxParams.data[CanaliInput.STATES] = JSON.stringify(states);
        ajaxParams.data[CanaliInput.ENDPOINT] = this.endpointInput.val();
        ajaxParams.data[CanaliInput.LIMIT] = this.limitInput.val();
        ajaxParams.data[CanaliInput.USE_OF_SUBCLASS] = !this.subClassesDisabledInput.is(':checked');
        if (this.translateUrl.indexOf("?") > -1) {
            var parts = this.translateUrl.split("?");
            ajaxParams.url = parts[0];
            var param_array = parts[1].split("&");
            $.each(param_array, function (index, value) {
                var kv = value.split("=");
                ajaxParams.data[kv[0]] = kv[1];
            });
        }
        else {
            ajaxParams.url = this.queryUrl;
        }
        // Prepare the request
        ajaxParams.type = "POST";
        ajaxParams.dataType = "json";
        // Attach the success callback
        var self = this;
        ajaxParams.success = function (result) {
            self.showAnswers(result);
        };
        // Make the request
        $.ajax(ajaxParams);
    };
    CanaliInput.prototype.showAnswers = function (result) {
        var self = this;
        var div = $("#" + this.resultDivId);
        if (result['error']) {
            div.text(result['error']);
        }
        else {
            var results = result['results'];
            div.html("");
            if (!results) {
                div.html("No results");
            }
            else {
                //var table = $('<table></table>');
                //table.attr("class", "query-results");                
                $.each(results, function (index, value) {
                    var resultDiv = $('<div></div>');
                    div.append(resultDiv);
                    resultDiv.addClass("result-container");
                    var resultTitle = $('<div></div>');
                    resultDiv.append(resultTitle);
                    resultTitle.addClass("result-title");
                    if (typeof (value.ask) !== 'undefined') {
                        if (value.ask) {
                            resultTitle.text('Yes');
                        }
                        else {
                            resultTitle.text('No');
                        }
                    }
                    else {
                        if (value[CanaliInput.URL]) {
                            var a = $("<a></a>").text(value[CanaliInput.LABEL]);
                            a.attr("href", value[CanaliInput.URL]);
                            resultTitle.append(a);
                        }
                        else {
                            resultTitle.text(value[CanaliInput.LABEL]);
                        }
                        if (value[CanaliInput.LABEL_ENTITY]) {
                            var explanation = value[CanaliInput.PROPERTY_TEXT];
                            if (/ of$/.test(explanation)) {
                                explanation += " for ";
                            }
                            else {
                                explanation += " of ";
                            }
                            if (value[CanaliInput.URL_ENTITY]) {
                                var a = "<a href=\"" + value[CanaliInput.URL_ENTITY] + "\">" + value[CanaliInput.LABEL_ENTITY] + "</a>";
                                explanation += a;
                            }
                            else {
                                explanation += value[CanaliInput.LABEL_ENTITY];
                            }
                            var resultExplanation = $("<div></div>");
                            resultDiv.append(resultExplanation);
                            resultExplanation.addClass("result-explanation");
                            resultExplanation.html(explanation);
                        }
                        if (value[CanaliInput.SORTING_PROPERTY_TEXT]) {
                            var orderingValue = value[CanaliInput.SORTING_PROPERTY_TEXT] + " ";
                            orderingValue += value[CanaliInput.SORTING_PROPERTY_VALUE];
                            var resultOrdering = $("<div></div>");
                            resultDiv.append(resultOrdering);
                            resultOrdering.addClass("result-ordering");
                            resultOrdering.text(orderingValue);
                        }
                        //row1.append(td1);
                        //table.append(row1);
                        //var row2 = $('<tr></tr>');
                        if (value[CanaliInput.PICTURE]) {
                            //var td3 = $('<td></td>');
                            var img = $('<img />');
                            img.attr("src", value[CanaliInput.PICTURE]);
                            //td3.append(img);
                            //var td2 = $('<td></td>').text(value[ABSTRACT]);
                            //row2.append(td3);
                            //row2.append(td2);
                            var resultImg = $("<div></div>");
                            resultDiv.append(resultImg);
                            resultImg.addClass("result-img");
                            resultImg.append(img);
                        }
                        else {
                        }
                        if (value[CanaliInput.URL]) {
                            //var row3 = $('<tr></tr>');
                            //var td4 = $('<td colspan="2"></td>').text(value[URL]);
                            //row3.append(td4);
                            //table.append(row3);
                            var resultUrl = $("<div></div>");
                            resultDiv.append(resultUrl);
                            resultUrl.addClass("result-url");
                            resultUrl.text(value[URL]);
                        }
                        if (value[CanaliInput.ABSTRACT]) {
                            var resultAbstract = $("<div></div>");
                            resultDiv.append(resultAbstract);
                            resultAbstract.addClass("result-abstract");
                            resultAbstract.text(value[CanaliInput.ABSTRACT]);
                        }
                    }
                });
            }
        }
        var pre = $('<pre style="clear: both; margin: 30px;"></pre>');
        var question = "";
        for (var i = 0; i < this.acceptedTokens.length; i++) {
            if (i > 0 && i < this.acceptedTokens.length - 1) {
                question += " ";
            }
            question += this.acceptedTokens[i].text;
        }
        pre.text(question + "\n\n" + result['query'] + "\n\n" + Date.now());
        $(div).append(pre);
    };
    //constants used to encode the AutocompleteObject   
    CanaliInput.HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
    CanaliInput.HTML_ESCAPE_CHARS = /[&<>"'\/]/g;
    CanaliInput.BACKSPACE = 8;
    CanaliInput.TAB = 9;
    CanaliInput.ENTER = 13;
    CanaliInput.ESCAPE = 27;
    CanaliInput.SPACE = 32;
    CanaliInput.PAGE_UP = 33;
    CanaliInput.PAGE_DOWN = 34;
    CanaliInput.END = 35;
    CanaliInput.HOME = 36;
    CanaliInput.LEFT = 37;
    CanaliInput.UP = 38;
    CanaliInput.RIGHT = 39;
    CanaliInput.DOWN = 40;
    CanaliInput.NUMPAD_ENTER = 108;
    CanaliInput.COMMA = 188;
    CanaliInput.QUESTION_MARK = 219;
    CanaliInput.PERIOD1 = 190;
    CanaliInput.PERIOD2 = 110;
    CanaliInput.POSITION = {
        BEFORE: 0,
        AFTER: 1,
        END: 2
    };
    CanaliInput.CSS_CLASSES = {
        tokenList: "token-input-list",
        token: "token-input-token",
        tokenReadOnly: "token-input-token-readonly",
        tokenDelete: "token-input-delete-token",
        selectedToken: "token-input-selected-token",
        highlightedToken: "token-input-highlighted-token",
        dropdown: "token-input-dropdown",
        dropdownItem: "token-input-dropdown-item",
        dropdownItem2: "token-input-dropdown-item2",
        selectedDropdownItem: "token-input-selected-dropdown-item",
        inputToken: "token-input-input-token",
        focused: "token-input-focused",
        disabled: "token-input-disabled"
    };
    CanaliInput.ENDPOINT = "e";
    CanaliInput.LIMIT = "l";
    CanaliInput.LABEL = "l";
    CanaliInput.USE_OF_SUBCLASS = "us";
    CanaliInput.STATES = "s";
    CanaliInput.URL = "u";
    CanaliInput.ABSTRACT = "a";
    CanaliInput.PICTURE = "p";
    CanaliInput.LABEL_ENTITY = "le";
    CanaliInput.URL_ENTITY = "ue";
    CanaliInput.PROPERTY_TEXT = "pt";
    CanaliInput.SORTING_PROPERTY_TEXT = "spt";
    CanaliInput.SORTING_PROPERTY_VALUE = "spv";
    //parameter names for servlets
    CanaliInput.QUERY = "q";
    CanaliInput.LAST_ACCEPTED_PROPERTY = "p";
    CanaliInput.OPEN_VARIABLES_URI = "ou";
    CanaliInput.OPEN_VARIABLES_POSITION = "op";
    CanaliInput.STATE = "s";
    CanaliInput.FINAL_PUNCTUATION = "f";
    CanaliInput.CONTEXT_RULES_DISABLED = "crd";
    CanaliInput.AUTO_ACCEPTANCE = "aa";
    CanaliInput.DATE_TO_NUMBER = "dtn";
    CanaliInput.USE_KEYWORDS = "k";
    return CanaliInput;
}());
