/*
 * Question Answering on Linked Data Autocompleter
 * Version 0.0.1
 *
 * Copyright (c) 2015 Giuseppe M. Mazzeo
 * Licensed jointly under the GPL and MIT licenses,
 * choose which one suits your project best!
 * 
 * Based on the jQuery Plugin: Tokenizing Autocomplete Text Entry
 * Version 1.6.0
 * by James Smith (http://loopj.com)
 *
 */
;
(function ($) {

    //constants used to encode the AutocompleteObject
    var TEXT_FIELD = "t";
    var RESTRICTED_TEXT_FIELD = "r";
    var STATE_FIELD = "s";
    var LABELS_FIELD = "l";
    var TOKEN_TYPE_FIELD = "k";
    var RELATED_TOKEN_POSITION_FIELD = "c";
    var FREETEXT = "f";
    var FINAL_PUNCTUATION_FIELD = "p";
    var RELATED_TOKEN_TEXT_FIELD = "d";
    var IS_PREFIX = "is";
    var MUST_BE_ACCEPTED = "mba";
    var REMAINDER = "b";

    //types of token
    var ENTITY = "entity";
    var PROPERTY = "property";
    var CLASS = "class";
    var QUESTION_START = "question_start";

    var ENDPOINT = "e";
    var LIMIT = "l";
    var LABEL = "l";
    var STATES = "s";
    var URL = "u";
    var ABSTRACT = "a";
    var PICTURE = "p";
    var LABEL_ENTITY = "le";
    var URL_ENTITY = "ue";
    var PROPERTY_TEXT = "at";
    var SORTING_PROPERTY_TEXT = "spt";
    var SORTING_PROPERTY_VALUE = "spv";
    var DATE_TO_NUMBER = "dtn"

    //automaton state names
    var INITIAL_STATE_S0 = "0";
    var FINAL_STATE_SF = "f";
    var ACCEPT_CONCEPT_STATE_S1 = "1";
    var ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2 = "2";
    var ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S3 = "3";
    var ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S4 = "4";
    var ACCEPT_DIRECT_OPERAND_STATE_S5 = "5";
    var ACCEPT_INDIRECT_OPERAND_STATE_S6 = "6";
    var ACCEPT_SELF_PROPERTY_AS_DIRECT_OPERAND_STATE_S7 = "7";
    var ACCEPT_SELF_PROPERTY_AS_INDIRECT_OPERAND_STATE_S8 = "8";
    var ACCEPT_PROPERTY_FOR_RANK_STATE_S9 = "9";
    var ACCEPT_PROPERTY_FOR_UNARY_OPERATOR_S10 = "10";


    var DEFAULT_SETTINGS = {
        // Search settings
        method: "GET",
        searchDelay: 500,
        minChars: 1,
        jsonContainer: null,
        contentType: "json",
        // Prepopulation settings
        prePopulate: null,
        processPrePopulate: false,
        // Display settings
        deleteText: "&#215;",
        animateDropdown: true,
        placeholder: null,
        theme: null,
        zindex: 999,
        resultsLimit: null,
        enableHTML: false,
        resultsFormatter: function (item) {
            var string = item[TEXT_FIELD];
            if (item[RELATED_TOKEN_TEXT_FIELD]) {
                string += " (related to " + item[RELATED_TOKEN_TEXT_FIELD] + ")";
            }
            if (item[FREETEXT]) {
                string += " (" + item[FREETEXT] + ")";
            }
            if (item[LABELS_FIELD] && item[LABELS_FIELD] !== item[TEXT_FIELD]) {
                string += " <" + item[LABELS_FIELD] + ">";
            }
            //string += " " + item.sim;
            return "<li><p class=\"" + item[TOKEN_TYPE_FIELD] + "\">" + (this.enableHTML ? string : _escapeHTML(string)) + "</p></li>";
        },
        tokenFormatter: function (item) {
            var string = item[TEXT_FIELD].trim();
            var res = "<li><p class=\"" + item[TOKEN_TYPE_FIELD] + "\"";
            if (item[LABELS_FIELD]) {
                res += " title=\"" + item[LABELS_FIELD];
                if (item[RELATED_TOKEN_TEXT_FIELD]) {
                    res += " related to " + item[RELATED_TOKEN_TEXT_FIELD];
                }
                res += "\"";
            }
            res += ">" + (this.enableHTML ? string : _escapeHTML(string));
            if (item[FREETEXT]) {
                res += " (" + item[FREETEXT] + ")";
            }
            res += "&nbsp;</p></li>";
            return res;
        },
        // Tokenization settings
        tokenDelimiter: ",",
        preventDuplicates: false,
        tokenValue: "id",
        // Behavioral settings
        allowFreeTagging: false,
        allowTabOut: false,
        autoSelectFirstResult: false,
        // Callbacks
        onResult: null,
        onAdd: null,
        onFreeTaggingAdd: null,
        onDelete: null,
        onReady: null,
        // Other settings
        idPrefix: "token-input-",
        // Keep track if the input is currently in disabled mode
        disabled: false
    };

    // Default classes to use when theming
    var DEFAULT_CLASSES = {
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

    // Input box position "enum"
    var POSITION = {
        BEFORE: 0,
        AFTER: 1,
        END: 2
    };

    // Keys "enum"
    var KEY = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        NUMPAD_ENTER: 108,
        COMMA: 188,
        QUESTION_MARK: 219,
        PERIOD1: 190,
        PERIOD2: 110
    };

    var HTML_ESCAPES = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    var HTML_ESCAPE_CHARS = /[&<>"'\/]/g;

    function coerceToString(val) {
        return String((val === null || val === undefined) ? '' : val);
    }

    function _escapeHTML(text) {
        return coerceToString(text).replace(HTML_ESCAPE_CHARS, function (match) {
            return HTML_ESCAPES[match];
        });
    }

    // Additional public (exposed) methods
    var methods = {
        init: function (autocompleterMethod, translationMethod, queryMethod, resultDiv, options) {
            var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

            return this.each(function () {
                $(this).data("settings", settings);
                $(this).data("tokenInputObject", new $.TokenList(this, autocompleterMethod, translationMethod, queryMethod, resultDiv, settings));
            });
        },
        clear: function () {
            this.data("tokenInputObject").clear();
            return this;
        },
        add: function (item) {
            this.data("tokenInputObject").add(item);
            return this;
        },
        remove: function (item) {
            this.data("tokenInputObject").remove(item);
            return this;
        },
        get: function () {
            return this.data("tokenInputObject").getTokens();
        },
        toggleDisabled: function (disable) {
            this.data("tokenInputObject").toggleDisabled(disable);
            return this;
        },
        setOptions: function (options) {
            $(this).data("settings", $.extend({}, $(this).data("settings"), options || {}));
            return this;
        },
        destroy: function () {
            if (this.data("tokenInputObject")) {
                this.data("tokenInputObject").clear();
                var tmpInput = this;
                var closest = this.parent();
                closest.empty();
                tmpInput.show();
                closest.append(tmpInput);
                return tmpInput;
            }
        }
    };

    // Expose the .tokenInput function to jQuery as a plugin
    $.fn.tokenInput = function (autocompleteMethod, translationMethod, queryMethod, resultDiv) {
        // Method calling and initialization logic
        //if (methods[autocompleteMethod]) {
        //    return methods[autocompleteMethod].apply(this, Array.prototype.slice.call(arguments, 1));
        //} else {
        return methods.init.apply(this, arguments);
        //}
    };

    // TokenList class for each input
    $.TokenList = function (input, autocompleteMethod, translationMethod, queryMethod, resultDiv, settings) {
        //
        // Initialization
        //      
        // Configure the data source

        $(input).data("settings").local_data = autocompleteMethod;
        $(input).data("settings").local_data = translationMethod;
        $(input).data("settings").local_data = queryMethod;
        $(input).data("settings").resultDiv = resultDiv;

        // Build class names
        if ($(input).data("settings").classes) {
            // Use custom class names
            $(input).data("settings").classes = $.extend({}, DEFAULT_CLASSES, $(input).data("settings").classes);
        } else if ($(input).data("settings").theme) {
            // Use theme-suffixed default class names
            $(input).data("settings").classes = {};
            $.each(DEFAULT_CLASSES, function (key, value) {
                $(input).data("settings").classes[key] = value + "-" + $(input).data("settings").theme;
            });
        } else {
            $(input).data("settings").classes = DEFAULT_CLASSES;
        }

        // The saved tokens
        var saved_tokens = [];

        // Keep track of the number of tokens in the list
        var token_count = 0;

        // Keep track of the timeout, old vals
        var timeout;
        var input_val;

        // Create a new text input an attach keyup events
        var input_box = $("<input type=\"text\" autocomplete=\"off\" autocapitalize=\"off\"/>")
                .css({
                    outline: "none"
                })
                .attr("id", $(input).data("settings").idPrefix + input.id)
                .focus(function () {
                    if ($(input).data("settings").disabled) {
                        return false;
                    } else
                        token_list.addClass($(input).data("settings").classes.focused);
                })
                .blur(function () {
                    //hide_dropdown();

                    if ($(input).data("settings").allowFreeTagging) {
                        add_freetagging_tokens();
                    }

                    //$(this).val("");
                    token_list.removeClass($(input).data("settings").classes.focused);
                })
                .bind("keyup keydown blur update", resize_input)
                .keydown(function (event) {
                    var previous_token;
                    var code = event.keyCode;
                    if (code !== KEY.BACKSPACE && code !== KEY.ENTER &&
                            saved_tokens && saved_tokens.length > 0 && saved_tokens[saved_tokens.length - 1][STATE_FIELD] === FINAL_STATE_SF) {
                        return false;
                    }
                    switch (code) {

                        case KEY.LEFT:
                        case KEY.RIGHT:
                        case KEY.UP:
                        case KEY.DOWN:
                            if (this.value.length === 0 && false) {
                                previous_token = input_token.prev();
                                var next_token = input_token.next();

                                if ((previous_token.length && previous_token.get(0) === selected_token) ||
                                        (next_token.length && next_token.get(0) === selected_token)) {
                                    // Check if there is a previous/next token and it is selected
                                    if (code === KEY.LEFT || code === KEY.UP) {
                                        deselect_token($(selected_token), POSITION.BEFORE);
                                    } else {
                                        deselect_token($(selected_token), POSITION.AFTER);
                                    }
                                } else if ((code === KEY.LEFT || code === KEY.UP) && previous_token.length) {
                                    // We are moving left, select the previous token if it exists
                                    select_token($(previous_token.get(0)));
                                } else if ((code === KEY.RIGHT || code === KEY.DOWN) && next_token.length) {
                                    // We are moving right, select the next token if it exists
                                    select_token($(next_token.get(0)));
                                }
                            } else {
                                var dropdown_item = null;

                                if (code === KEY.DOWN || code === KEY.RIGHT) {
                                    dropdown_item = $(dropdown).find('li').first();

                                    if (selected_dropdown_item) {
                                        dropdown_item = $(selected_dropdown_item).next();
                                    }
                                } else {
                                    dropdown_item = $(dropdown).find('li').last();

                                    if (selected_dropdown_item) {
                                        dropdown_item = $(selected_dropdown_item).prev();
                                    }
                                }

                                select_dropdown_item(dropdown_item);
                            }

                            break;

                        case KEY.BACKSPACE:
                            previous_token = input_token.prev();

                            if (this.value.length === 0 && previous_token.length > 0) {
                                reactivate_token($(previous_token.get(0)));
                                return false;
                            } else if ($(this).val().length === 1) {
                                hide_dropdown();
                            } else {
                                // set a timeout just long enough to let this function finish.
                                setTimeout(function () {
                                    do_search();
                                }, 5);
                            }
                            break;

                        case KEY.TAB:
                        case KEY.NUMPAD_ENTER:
                            //case KEY.COMMA:
                            if (selected_dropdown_item) {
                                add_token($(selected_dropdown_item).data("tokeninput"));
                                hiddenInput.change();
                            } else {
                                if ($(input).data("settings").allowFreeTagging) {
                                    if ($(input).data("settings").allowTabOut && $(this).val() === "") {
                                        return true;
                                    } else {
                                        add_freetagging_tokens();
                                    }
                                } else {
                                    $(this).val("");
                                    if ($(input).data("settings").allowTabOut) {
                                        return true;
                                    }
                                }
                                event.stopPropagation();
                                event.preventDefault();
                            }
                            return false;

                        case KEY.ENTER:
                            if ($(input).data("tokenInputObject").getCurrentState() === 'f') {
                                do_translation();
                                break;
                            }
                            return false;
                        case KEY.ESCAPE:
                            hide_dropdown();
                            return true;
                            //case KEY.SPACE:
                            //    if (!this.value.length || this.value[this.value.length - 1] === ' ') {
                            //        return false;
                            //    }
                            //    run_search(input_box.val());
                            //    break;
                            //case KEY.PERIOD1:
                            //case KEY.PERIOD2:
                            //case KEY.QUESTION_MARK:
                            //    if (saved_tokens.length <= 1) {
                            //        return false;
                            //    } else if (finalize_search()) {
                            //        return false;
                            //    }
                        default:
                            if (String.fromCharCode(event.which)) {
                                // set a timeout just long enough to let this function finish.
                                setTimeout(function () {
                                    do_search();
                                }, 5);
                            }
                            break;
                    }
                });

        // Keep reference for placeholder
        if (settings.placeholder) {
            input_box.attr("placeholder", settings.placeholder);
        }

        // Keep a reference to the original input box
        var hiddenInput = $(input)
                .hide()
                .val("")
                .focus(function () {
                    focusWithTimeout(input_box);
                })
                .blur(function () {
                    input_box.blur();

                    //return the object to this can be referenced in the callback functions.
                    return hiddenInput;
                })
                ;

        // Keep a reference to the selected token and dropdown item
        var selected_token = null;
        var selected_token_index = 0;
        var selected_dropdown_item = null;

        // The list to store the token items in
        var token_list = $("<ul />")
                .addClass($(input).data("settings").classes.tokenList)
                .click(function (event) {
                    var li = $(event.target).closest("li");
                    if (li && li.get(0) && $.data(li.get(0), "tokeninput")) {
                        toggle_select_token(li);
                    } else {
                        // Deselect selected token
                        if (selected_token) {
                            deselect_token($(selected_token), POSITION.END);
                        }

                        // Focus input box
                        focusWithTimeout(input_box);
                    }
                })
                .mouseover(function (event) {
                    var li = $(event.target).closest("li");
                    if (li && selected_token !== this) {
                        li.addClass($(input).data("settings").classes.highlightedToken);
                    }
                })
                .mouseout(function (event) {
                    var li = $(event.target).closest("li");
                    if (li && selected_token !== this) {
                        li.removeClass($(input).data("settings").classes.highlightedToken);
                    }
                })
                .insertBefore(hiddenInput);

        // The token holding the input box
        var input_token = $("<li />")
                .addClass($(input).data("settings").classes.inputToken)
                .appendTo(token_list)
                .append(input_box);

        // The list to store the dropdown items in
        var dropdown = $("<div/>")
                .addClass($(input).data("settings").classes.dropdown)
                .appendTo("body")
                .hide();

        // Magic element to help us resize the text input
        var input_resizer = $("<tester/>")
                .insertAfter(input_box)
                .css({
                    position: "absolute",
                    top: -9999,
                    left: -9999,
                    width: "auto",
                    fontSize: input_box.css("fontSize"),
                    fontFamily: input_box.css("fontFamily"),
                    fontWeight: input_box.css("fontWeight"),
                    letterSpacing: input_box.css("letterSpacing"),
                    whiteSpace: "nowrap"
                });

        // Pre-populate list if items exist
        hiddenInput.val("");
        var li_data = $(input).data("settings").prePopulate || hiddenInput.data("pre");

        if ($(input).data("settings").processPrePopulate && $.isFunction($(input).data("settings").onResult)) {
            li_data = $(input).data("settings").onResult.call(hiddenInput, li_data);
        }

        if (li_data && li_data.length) {
            $.each(li_data, function (index, value) {
                insert_token(value);
                input_box.attr("placeholder", null);
            });
        }

        // Check if widget should initialize as disabled
        if ($(input).data("settings").disabled) {
            toggleDisabled(true);
        }

        // Initialization is done
        if (typeof ($(input).data("settings").onReady) === "function") {
            $(input).data("settings").onReady.call();
        }

        //
        // Public functions
        //

        this.clear = function () {
            token_list.children("li").each(function () {
                if ($(this).children("input").length === 0) {
                    delete_token($(this));
                }
            });
        };

        this.add = function (item) {
            add_token(item);
        };

        this.remove = function (item) {
            token_list.children("li").each(function () {
                if ($(this).children("input").length === 0) {
                    var currToken = $(this).data("tokeninput");
                    var match = true;
                    for (var prop in item) {
                        if (item[prop] !== currToken[prop]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        delete_token($(this));
                    }
                }
            });
        };

        this.getTokens = function () {
            return saved_tokens;
        };

        this.getTokenField = function (pos, field) {
            return saved_tokens[pos][field];
        }

        this.getCurrentState = function () {
            if (saved_tokens.length === 0) {
                return INITIAL_STATE_S0;
            }
            return saved_tokens[saved_tokens.length - 1][STATE_FIELD];
        };

        this.getFinalPunctuation = function () {
            if (saved_tokens.length === 0) {
                return "?";
            }
            return saved_tokens[0][FINAL_PUNCTUATION_FIELD];
        };

        this.getOpenVariables = function () {
            var i = saved_tokens.length - 1;
            var res = ["", "", ""];
            //particular cases - if current state is S4 (... with) and previuos state is S3 (... capital with), then it is possible only to accept a property related to the previous property
            if (saved_tokens[i][STATE_FIELD] === ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S4 && i > 0 && saved_tokens[i - 1][STATE_FIELD] === ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S3) {
                res[0] += saved_tokens[i - 1][LABELS_FIELD];
                res[1] += saved_tokens[i - 1][TEXT_FIELD];
                res[2] += i - 1;
            } else { //general case
                var contextVariablePosition;
                while (i >= 0) {
                    if (saved_tokens[i][TOKEN_TYPE_FIELD] === PROPERTY) {
                        if (!contextVariablePosition || contextVariablePosition === i) {
                            var ll = saved_tokens[i][LABELS_FIELD].split("|");
                            for (var k = 0; k < ll.length; k++) {
                                if (res[0].length > 0) {
                                    res[0] += ",";
                                    res[1] += ",";
                                    res[2] += ",";
                                }
                                res[0] += ll[k];
                                res[1] += saved_tokens[i][TEXT_FIELD];
                                res[2] += i;
                            }
                            contextVariablePosition = saved_tokens[i][RELATED_TOKEN_POSITION_FIELD];
                        }
                    } else if (saved_tokens[i][TOKEN_TYPE_FIELD] === CLASS) {
                        if (!contextVariablePosition || contextVariablePosition === i) {
                            if (res[0].length > 0) {
                                res[0] += ",";
                                res[1] += ",";
                                res[2] += ",";
                            }
                            res[0] += saved_tokens[i][LABELS_FIELD];
                            res[1] += saved_tokens[i][TEXT_FIELD];
                            res[2] += i;
                            contextVariablePosition = saved_tokens[i][RELATED_TOKEN_POSITION_FIELD];
                        }
                    } else if (saved_tokens[i][TOKEN_TYPE_FIELD] === QUESTION_START && /has$/.test(saved_tokens[i][LABEL])) {
                        if (res[0].length > 0) {
                            res[0] += ",";
                            res[1] += ",";
                            res[2] += ",";
                        }
                        res[0] += "http://www.w3.org/2002/07/owl#Thing";
                        res[1] += saved_tokens[i][TEXT_FIELD];
                        res[2] += i;
                        contextVariablePosition = 0;
                    }
                    i--;
                }
            }
            return res;
        };

        this.getLastAcceptedProperty = function () {
            var i = saved_tokens.length - 1;
            while (i > 0) {
                if (saved_tokens[i - 1][STATE_FIELD] !== ACCEPT_PROPERTY_FOR_RANK_STATE_S9 && saved_tokens[i][TOKEN_TYPE_FIELD] === PROPERTY) {
                    return saved_tokens[i][LABELS_FIELD];
                }
                i--;
            }
            return null;
        };

        this.toggleDisabled = function (disable) {
            toggleDisabled(disable);
        };

        // Resize input to maximum width so the placeholder can be seen
        resize_input();

        //
        // Private functions
        //

        function escapeHTML(text) {
            return $(input).data("settings").enableHTML ? text : _escapeHTML(text);
        }

        // Toggles the widget between enabled and disabled state, or according
        // to the [disable] parameter.
        function toggleDisabled(disable) {
            if (typeof disable === 'boolean') {
                $(input).data("settings").disabled = disable;
            } else {
                $(input).data("settings").disabled = !$(input).data("settings").disabled;
            }
            input_box.attr('disabled', $(input).data("settings").disabled);
            token_list.toggleClass($(input).data("settings").classes.disabled, $(input).data("settings").disabled);
            // if there is any token selected we deselect it
            if (selected_token) {
                deselect_token($(selected_token), POSITION.END);
            }
            hiddenInput.attr('disabled', $(input).data("settings").disabled);
        }

        function resize_input() {
            if (input_val === (input_val = input_box.val())) {
                return;
            }

            // Get width left on the current line
            var width_left = token_list.width() - input_box.offset().left - token_list.offset().left;
            // Enter new content into resizer and resize input accordingly
            input_resizer.html(_escapeHTML(input_val) || _escapeHTML(settings.placeholder));
            // Get maximum width, minimum the size of input and maximum the widget's width
            input_box.width(Math.min(token_list.width(),
                    Math.max(width_left, input_resizer.width() + 30)));
        }

        // Inner function to add a token to the list
        function insert_token(item) {
            //debugger;
            var $this_token = $($(input).data("settings").tokenFormatter(item));
            var readonly = item.readonly === true;

            if (readonly)
                $this_token.addClass($(input).data("settings").classes.tokenReadOnly);

            $this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);

            // Store data on the token
            var token_data = item;
            $.data($this_token.get(0), "tokeninput", item);

            // Save this token for duplicate checking
            saved_tokens = saved_tokens.slice(0, selected_token_index).concat([token_data]).concat(saved_tokens.slice(selected_token_index));
            selected_token_index++;

            // Update the hidden input
            update_hiddenInput(saved_tokens, hiddenInput);

            token_count += 1;

            return $this_token;
        }

        // Add a token to the token list based on user input
        function add_token(item) {
            var callback = $(input).data("settings").onAdd;

            // See if the token already exists and select it if we don't want duplicates
            if (token_count > 0 && $(input).data("settings").preventDuplicates) {
                var found_existing_token = null;
                token_list.children().each(function () {
                    var existing_token = $(this);
                    var existing_data = $.data(existing_token.get(0), "tokeninput");
                    if (existing_data && existing_data[settings.tokenValue] === item[settings.tokenValue]) {
                        found_existing_token = existing_token;
                        return false;
                    }
                });

                if (found_existing_token) {
                    select_token(found_existing_token);
                    input_token.insertAfter(found_existing_token);
                    focusWithTimeout(input_box);
                    return;
                }
            }

            // Clear input box
            if (item[REMAINDER]) {
                input_box.val(item[REMAINDER]);
            } else {
                input_box.val("");
            }

            // Squeeze input_box so we force no unnecessary line break
            if (item[REMAINDER]) {
                resize_input();
            } else {
                input_box.width(1);
            }

            // Insert the new tokens
            insert_token(item);
            // Remove the placeholder so it's not seen after you've added a token
            input_box.attr("placeholder", null);

            // Don't show the help dropdown, they've got the idea
            hide_dropdown();

            // Execute the onAdd callback if defined
            if ($.isFunction(callback)) {
                callback.call(hiddenInput, item);
            }

            if (item[REMAINDER]) {
                do_search();
            } else if (item[STATE_FIELD] === FINAL_STATE_SF) {
                do_translation();
            }
        }

        // Select a token in the token list
        function select_token(token) {
            if (!$(input).data("settings").disabled) {
                token.addClass($(input).data("settings").classes.selectedToken);
                selected_token = token.get(0);

                // Hide input box
                input_box.val("");

                // Hide dropdown if it is visible (eg if we clicked to select token)
                hide_dropdown();
            }
        }

        // Deselect a token in the token list
        function deselect_token(token, position) {
            token.removeClass($(input).data("settings").classes.selectedToken);
            selected_token = null;

            if (position === POSITION.BEFORE) {
                input_token.insertBefore(token);
                selected_token_index--;
            } else if (position === POSITION.AFTER) {
                input_token.insertAfter(token);
                selected_token_index++;
            } else {
                input_token.appendTo(token_list);
                selected_token_index = token_count;
            }

            // Show the input box and give it focus again
            focusWithTimeout(input_box);
        }

        // Toggle selection of a token in the token list
        function toggle_select_token(token) {
            var previous_selected_token = selected_token;

            if (selected_token) {
                deselect_token($(selected_token), POSITION.END);
            }

            if (previous_selected_token === token.get(0)) {
                deselect_token(token, POSITION.END);
            } else {
                select_token(token);
            }
        }

        // Reactivate a token in the token list
        function reactivate_token(token) {
            // Remove the id from the saved list
            var token_data = $.data(token.get(0), "tokeninput");
            var callback = $(input).data("settings").onDelete;

            if (!$(input).data("settings").disabled) {

                var index = token.prevAll().length;
                if (index > selected_token_index)
                    index--;

                // Delete the token
                token.remove();
                selected_token = null;

                // Show the input box and give it focus again
                focusWithTimeout(input_box);
                // Refill input box
                input_box.val(token_data[TEXT_FIELD].trim());

                saved_tokens = saved_tokens.slice(0, index).concat(saved_tokens.slice(index + 1));
                if (saved_tokens.length === 0) {
                    input_box.attr("placeholder", settings.placeholder);
                }
                if (index < selected_token_index)
                    selected_token_index--;

                // Update the hidden input
                update_hiddenInput(saved_tokens, hiddenInput);

                token_count -= 1;

                // Execute the onDelete callback if defined
                if ($.isFunction(callback)) {
                    callback.call(hiddenInput, token_data);
                }
                hide_dropdown();
                do_search();
            }
        }


        // Delete a token from the token list
        function delete_token(token) {
            // Remove the id from the saved list
            var token_data = $.data(token.get(0), "tokeninput");
            var callback = $(input).data("settings").onDelete;

            var index = token.prevAll().length;
            if (index > selected_token_index)
                index--;

            // Delete the token
            token.remove();
            selected_token = null;

            // Show the input box and give it focus again
            focusWithTimeout(input_box);

            // Remove this token from the saved list
            saved_tokens = saved_tokens.slice(0, index).concat(saved_tokens.slice(index + 1));
            if (saved_tokens.length === 0) {
                input_box.attr("placeholder", settings.placeholder);
            }
            if (index < selected_token_index)
                selected_token_index--;

            // Update the hidden input
            update_hiddenInput(saved_tokens, hiddenInput);

            token_count -= 1;

            // Execute the onDelete callback if defined
            if ($.isFunction(callback)) {
                callback.call(hiddenInput, token_data);
            }
        }

        // Update the hidden input box value
        function update_hiddenInput(saved_tokens, hiddenInput) {
            var token_values = $.map(saved_tokens, function (el) {
                if (typeof $(input).data("settings").tokenValue === 'function')
                    return $(input).data("settings").tokenValue.call(this, el);

                return el[$(input).data("settings").tokenValue];
            });
            hiddenInput.val(token_values.join($(input).data("settings").tokenDelimiter));

        }

        // Hide and clear the results dropdown
        function hide_dropdown() {
            dropdown.hide().empty();
            selected_dropdown_item = null;
        }

        function show_dropdown() {
            dropdown
                    .css({
                        position: "absolute",
                        top: token_list.offset().top + token_list.outerHeight(true),
                        left: token_list.offset().left,
                        width: token_list.width(),
                        'z-index': $(input).data("settings").zindex
                    })
                    .show();
        }

        function show_dropdown_message(msg) {
            dropdown.html("<p>" + msg + "</p>");
            show_dropdown();
        }

        var regexp_special_chars = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');
        function regexp_escape(term) {
            return term.replace(regexp_special_chars, '\\$&');
        }

        // Highlight the query part of the search term
        function highlight_term(value, term) {
            return value.replace(
                    new RegExp(
                            "(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape(term) + ")(?![^<>]*>)(?![^&;]+;)",
                            "gi"
                            ), function (match, p1) {
                return "<b>" + escapeHTML(p1) + "</b>";
            }
            );
        }

        function find_value_and_highlight_term(template, value, term) {
            return template.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape(value) + ")(?![^<>]*>)(?![^&;]+;)", "g"), highlight_term(value, term));
        }

        function countChar(s) {
            var countChar = new Array(255);
            for (var i = 0, len = s.length; i < len; i++) {
                var c = s.charCodeAt(i);
                if (c >= 0 && c <= 255) {
                    if (countChar[c] > 0) {
                        countChar[c]++;
                    } else {
                        countChar[c] = 1;
                    }
                }
            }
            return countChar;
        }

        function absDiff(c1, c2) {
            var res = 0;
            for (var i = 0; i < c1.length; i++) {
                if (c1[i] > 0) {
                    if (c2[i] > 0) {
                        res += Math.abs(c1[i] - c2[i]);
                    } else {
                        res += c1[i];
                    }
                } else {
                    if (c2[i] > 0) {
                        res += c2[i];
                    }
                }
            }
            return res;
        }

        function min(c1, c2) {
            var res = 0;
            for (var i = 0; i < c1.length; i++) {
                if (c1[i] && c2[i]) {
                    res += Math.min(c1[i], c2[i]);
                }
            }
            return res;
        }

        function compare(a, b) {
            if (a[RELATED_TOKEN_POSITION_FIELD] === -1 && b[RELATED_TOKEN_POSITION_FIELD] !== -1) {
                return 1;
            }
            if (a[RELATED_TOKEN_POSITION_FIELD] !== -1 && b[RELATED_TOKEN_POSITION_FIELD] === -1) {
                return -1;
            }
            if (a.sim < b.sim)
                return 1;
            if (a.sim > b.sim)
                return -1;
            if (a[TOKEN_TYPE_FIELD] < b[TOKEN_TYPE_FIELD])
                return -1;
            if (a[TOKEN_TYPE_FIELD] > b[TOKEN_TYPE_FIELD])
                return 1;
            if (a[RESTRICTED_TEXT_FIELD] < b[RESTRICTED_TEXT_FIELD])
                return -1;
            if (a[RESTRICTED_TEXT_FIELD] > b[RESTRICTED_TEXT_FIELD])
                return 1;
            if (a[RELATED_TOKEN_POSITION_FIELD] < b[RELATED_TOKEN_POSITION_FIELD])
                return 1;
            if (a[RELATED_TOKEN_POSITION_FIELD] > b[RELATED_TOKEN_POSITION_FIELD])
                return -1;
            return 0;
            //return (/Inv$/.test(a[LABEL])?"1" :"0") ^ (/Inv$/.test(b[LABEL])?"1" :"0");
        }

        function mergeResults(results, query) {
            if (!results || results.length === 0) {
                return;
            }
            $.each(results, function (index, value) {
                if (!value[RESTRICTED_TEXT_FIELD]) {
                    value[RESTRICTED_TEXT_FIELD] = value[TEXT_FIELD];
                }
                if (typeof value[RELATED_TOKEN_POSITION_FIELD] !== 'undefined' && value[RELATED_TOKEN_POSITION_FIELD] !== -1) {
                    value[RELATED_TOKEN_TEXT_FIELD] = $(input).data("tokenInputObject").getTokenField(value[RELATED_TOKEN_POSITION_FIELD], RESTRICTED_TEXT_FIELD);
                }
            });
            results.sort(compare);
            var threshold = Math.max(0, results[0].sim * 0.67);

            var finalResults = [];
            finalResults.push(results[0]);
            var i = 1;
            while (i < results.length) {
                //if (results[i].sim < threshold) {
                //    break;
                //}
                //check if it is possibile to merge this result with the previous one
                if (results[i][TOKEN_TYPE_FIELD] === PROPERTY &&
                        results[i][TOKEN_TYPE_FIELD] === results[i - 1][TOKEN_TYPE_FIELD] &&
                        results[i][RESTRICTED_TEXT_FIELD] === results[i - 1][RESTRICTED_TEXT_FIELD] &&
                        results[i][RELATED_TOKEN_POSITION_FIELD] === results[i - 1][RELATED_TOKEN_POSITION_FIELD]) {
                    finalResults[finalResults.length - 1][LABELS_FIELD] += "|" + results[i][LABELS_FIELD];
                } else {
                    finalResults.push(results[i]);
                }
                i++;
            }

            return finalResults;
        }

        // Populate the results dropdown with some results
        function populateDropdown(query, results) {

            if (results && results.length) {
                var j = results.length;
                while (j > 0 && results[j - 1][RELATED_TOKEN_POSITION_FIELD] === -1) {
                    j--;
                }
                if (j < results.length) {
                    var entityCount = 0;
                    var lastEntityIndex = 0;
                    var classCount = 0;
                    var msg = "If you are searching for";
                    if (j < results.length - 1) {
                        msg += " one of the following"
                    }
                    msg += "<br /><br /><ul>";
                    var k = j;
                    while (k < results.length) {
                        if (results[k][TOKEN_TYPE_FIELD] === ENTITY) {
                            msg += "<li><b>" + results[k][RESTRICTED_TEXT_FIELD] + "</b> &lt<a href=\"javascript:void(0);\" onclick=\"openEntityDialog('" + results[k][RESTRICTED_TEXT_FIELD] + "','" + results[k][LABELS_FIELD] + "')\" >" + results[k][LABELS_FIELD] + "</a>&gt</li>";
                            entityCount++;
                            lastEntityIndex = k;
                        } else {
                            msg += "<li><b>" + results[k][RESTRICTED_TEXT_FIELD] + "</b> &lt" + results[k][LABELS_FIELD] + "&gt</li>";
                        }
                        k++;
                    }
                    msg += "</ul><br />please, be advised that there are no matches for your question in the currently adopted KB.<br /><br />";
                    if (entityCount > 0) {
                        if (entityCount > 1) {
                            msg += "Click on one of the links above for a list of the properties of the entity you are searching."
                        } else {
                            msg += "Click on the link above for a list of the properties of <b>" + results[lastEntityIndex][RESTRICTED_TEXT_FIELD] + "</b>.";
                        }
                    }
                    openAlertDialog(msg);
                }
                dropdown.empty();
                var dropdown_ul = $("<ul/>")
                        .appendTo(dropdown)
                        .mouseover(function (event) {
                            select_dropdown_item($(event.target).closest("li"));
                        })
                        .mousedown(function (event) {
                            add_token($(event.target).closest("li").data("tokeninput"));
                            hiddenInput.change();
                            return false;
                        })
                        .hide();

                if ($(input).data("settings").resultsLimit && results.length > $(input).data("settings").resultsLimit) {
                    results = results.slice(0, $(input).data("settings").resultsLimit);
                }

                var threshold = results[0].sim * 0.6;

                $.each(results, function (index, value) {
                    if (value.sim < threshold) {
                        return true;
                    }
                    var this_li = $(input).data("settings").resultsFormatter(value);

                    this_li = find_value_and_highlight_term(this_li, value[TEXT_FIELD], query);
                    this_li = $(this_li).appendTo(dropdown_ul);

                    if (index % 2) {
                        this_li.addClass($(input).data("settings").classes.dropdownItem);
                    } else {
                        this_li.addClass($(input).data("settings").classes.dropdownItem2);
                    }

                    if (index === 0 && $(input).data("settings").autoSelectFirstResult) {
                        select_dropdown_item(this_li);
                    }

                    $.data(this_li.get(0), "tokeninput", value);
                });

                show_dropdown();

                if ($(input).data("settings").animateDropdown) {
                    dropdown_ul.slideDown("fast");
                } else {
                    dropdown_ul.show();
                }
            } else {
                if ($(input).data("settings").noResultsText) { //TODO: suggest what to type according to the state
                    dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                    show_dropdown();
                }
            }
        }

        function showTranslation(result) {
            var div = $("#" + computeResultDiv());
            if (result.error) {
                div.text(result.error);
            } else {
                div.html("<img src='img/processing.gif' /><br />Executing the following SPARQL query @ " + result.endPoint + "<br /><br />");
                var pre = $('<pre style="clear: both; margin: 30px;"></pre>');
                var question = "";
                var tokens = $(input).data("tokenInputObject").getTokens();
                $(tokens).each(function (index, value) {
                    if (index > 0 && index < tokens.length - 1) {
                        question += " ";
                    }
                    question += value[TEXT_FIELD];
                });
                pre.text(question + "\n\n" + result.query + "\n\n" + Date.now());
                $(div).append(pre);
                do_query();
            }
        }

        function showResults(result) {
            var div = $("#" + computeResultDiv());
            if (result.error) {
                div.text(result.error);
            } else {
                var results = result.results;
                div.html("");
                if (results.length === 0) {
                    div.html("No results");
                } else {
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
                            } else {
                                resultTitle.text('No');
                            }
                        } else {
                            if (value[URL]) {
                                var a = $("<a></a>").text(value[LABEL]);
                                a.attr("href", value[URL]);
                                resultTitle.append(a);
                                //td1.append(a);
                            } else {
                                resultTitle.text(value[LABEL]);
                                //td1.text(value[LABEL]);
                            }
                            if (value[LABEL_ENTITY]) {
                                var explanation = value[PROPERTY_TEXT];
                                if (/ of$/.test(explanation)) {
                                    explanation += " for ";
                                } else {
                                    explanation += " of ";
                                }
                                if (value[URL_ENTITY]) {
                                    var a = "<a href=\"" + value[URL_ENTITY] + "\">" + value[LABEL_ENTITY] + "</a>";
                                    explanation += a;
                                } else {
                                    explanation += value[LABEL_ENTITY];
                                }
                                var resultExplanation = $("<div></div>");
                                resultDiv.append(resultExplanation);
                                resultExplanation.addClass("result-explanation");
                                resultExplanation.html(explanation);
                                //td1.html(td1.html() + additionalText);
                            }
                            if (value[SORTING_PROPERTY_TEXT]) {
                                var orderingValue = value[SORTING_PROPERTY_TEXT] + " ";
                                orderingValue += value[SORTING_PROPERTY_VALUE];
                                var resultOrdering = $("<div></div>");
                                resultDiv.append(resultOrdering);
                                resultOrdering.addClass("result-ordering");
                                resultOrdering.text(orderingValue);
                                //td1.html(td1.html() + additionalText);
                            }
                            //row1.append(td1);
                            //table.append(row1);
                            //var row2 = $('<tr></tr>');
                            if (value[PICTURE]) {
                                //var td3 = $('<td></td>');
                                var img = $('<img />');
                                img.attr("src", value[PICTURE]);
                                //td3.append(img);
                                //var td2 = $('<td></td>').text(value[ABSTRACT]);
                                //row2.append(td3);
                                //row2.append(td2);
                                var resultImg = $("<div></div>");
                                resultDiv.append(resultImg);
                                resultImg.addClass("result-img");
                                resultImg.append(img);
                            } else {
                                //var td2 = $('<td colspan="2"></td>').text(value[ABSTRACT]);
                                //row2.append(td2);
                            }
                            if (value[URL]) {
                                //var row3 = $('<tr></tr>');
                                //var td4 = $('<td colspan="2"></td>').text(value[URL]);
                                //row3.append(td4);
                                //table.append(row3);
                                var resultUrl = $("<div></div>");
                                resultDiv.append(resultUrl);
                                resultUrl.addClass("result-url");
                                resultUrl.text(value[URL]);

                            }
                            if (value[ABSTRACT]) {
                                var resultAbstract = $("<div></div>");
                                resultDiv.append(resultAbstract);
                                resultAbstract.addClass("result-abstract");
                                resultAbstract.text(value[ABSTRACT]);
                            }
                            //table.append(row2);
                        }
                    });
                    //$(div).html($(table).html());
                    //$(div).html(table);
                }
            }
            var pre = $('<pre style="clear: both; margin: 30px;"></pre>');
            var question = "";
            var tokens = $(input).data("tokenInputObject").getTokens();
            $(tokens).each(function (index, value) {
                if (index > 0 && index < tokens.length - 1) {
                    question += " ";
                }
                question += value[TEXT_FIELD];
            });
            pre.text(question + "\n\n" + result.query + "\n\n" + Date.now());
            $(div).append(pre);
        }

        // Highlight an item in the results dropdown
        function select_dropdown_item(item) {
            if (item) {
                if (selected_dropdown_item) {
                    deselect_dropdown_item($(selected_dropdown_item));
                }

                item.addClass($(input).data("settings").classes.selectedDropdownItem);
                selected_dropdown_item = item.get(0);
            }
        }

        // Remove highlighting from an item in the results dropdown
        function deselect_dropdown_item(item) {
            item.removeClass($(input).data("settings").classes.selectedDropdownItem);
            selected_dropdown_item = null;
        }

        //notice that the last typed char does not appear yet in the input box
        function finalize_search() {
            var query = input_box.val();

            var final_token = {};
            final_token[STATE_FIELD] = FINAL_STATE_SF;
            final_token[TOKEN_TYPE_FIELD] = 'final_punctuation';
            final_token.sim = 1;
            final_token[TEXT_FIELD] = saved_tokens[0][FINAL_PUNCTUATION_FIELD];
            final_token[RESTRICTED_TEXT_FIELD] = saved_tokens[0][FINAL_PUNCTUATION_FIELD];
            final_token[LABELS_FIELD] = final_token[TEXT_FIELD];
            final_token[FINAL_PUNCTUATION_FIELD] = final_token[TEXT_FIELD];

            if (!query && saved_tokens[saved_tokens.length - 1][STATE_FIELD] === ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2) {
                add_token(final_token);
            } else if (query.length > $(input).data("settings").minChars) {
                run_search_generic(query, function (results) {
                    var goodResult;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].sim >= 0.7 && results[i][STATE_FIELD] === ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2) {
                            goodResult = results[i];
                            break;
                        }
                    }
                    if (goodResult) {
                        add_token(goodResult);
                        add_token(final_token);
                    }
                });
            }
            return true;
        }

        // Do a search and show the "searching" dropdown if the input is longer
        // than $(input).data("settings").minChars
        function do_search() {
            var query = input_box.val();

            if (query && query.length) {
                if (selected_token) {
                    deselect_token($(selected_token), POSITION.AFTER);
                }

                if (query.length >= $(input).data("settings").minChars || query.length > 0 && (query[0] === '?' || query[0] === '.')) {
                    show_dropdown_message("Searching");
                    clearTimeout(timeout);

                    timeout = setTimeout(function () {
                        run_search(query);
                    }, $(input).data("settings").searchDelay);
                } else {
                    hide_dropdown();
                }
            }
        }


        function run_search(query) {
            run_search_generic(query, function (results, query) {
                // populate the dropdown only if the results are associated with the active search query
                if (!results || results.length === 0) {
                    if (saved_tokens.length > 1 && saved_tokens[saved_tokens.length - 1][STATE_FIELD] === FINAL_STATE_SF) {
                        hide_dropdown();
                    } else if (query.length == 0 && saved_tokens.length === 0) {
                        show_dropdown_message("Start typing a question (e.g., What is the ...)");
                    } else if (query.length < 4) {
                        show_dropdown_message("Continue typing the question");
                    } else {
                        show_dropdown_message("No results");
                    }
                } else {
                    if (input_box.val() === query) {
                        if (results[0][MUST_BE_ACCEPTED] && results.length === 1) {
                            add_token(results[0]);
                        } else {
                            populateDropdown(query, $(input).data("settings").jsonContainer ? results[$(input).data("settings").jsonContainer] : results);
                        }
                    } else {
                        hide_dropdown();
                    }
                }
            });
        }

        // Do the actual autocomplete search
        function run_search_generic(query, successFunction) {
            if ($(input).data("settings").autocompleteUrl) {
                var autocompleteUrl = computeAutocompleteURL();
                //parameter names for AutocompleterServler   
                var QUERY = "q";
                var LAST_ACCEPTED_PROPERTY = "a";
                var OPEN_VARIABLES_URI = "ou";
                var OPEN_VARIABLES_POSITION = "op";
                var STATE = "s";
                var FINAL_PUNCTUATION = "p";
                var CONTEXT_RULES_DISABLED = "crd";
                var AUTO_ACCEPTANCE = "aa";
                // Extract existing get params
                var ajax_params = {};
                ajax_params.data = {};
                ajax_params.data[STATE_FIELD] = $(input).data("tokenInputObject").getCurrentState();
                ajax_params.data[CONTEXT_RULES_DISABLED] = $("#crdisabled").is(':checked');
                ajax_params.data[AUTO_ACCEPTANCE] = !$("#aadisabled").is(':checked');
                if (saved_tokens.length > 0) {
                    var laa = $(input).data("tokenInputObject").getLastAcceptedProperty();
                    var open_variables = $(input).data("tokenInputObject").getOpenVariables();
                    switch (saved_tokens[saved_tokens.length - 1][STATE_FIELD]) {
                        case ACCEPT_CONCEPT_STATE_S1: //I need to find last accepted property
                        case ACCEPT_OPERATOR_OR_DIRECT_OPERAND_STATE_S3:
                        case ACCEPT_DIRECT_OPERAND_STATE_S5:
                            if (saved_tokens[saved_tokens.length - 1][LABELS_FIELD] === 'year='
                                    || saved_tokens[saved_tokens.length - 1][LABELS_FIELD] === 'month=') {
                                ajax_params.data[DATE_TO_NUMBER] = 'true';
                            }
                        case ACCEPT_INDIRECT_OPERAND_STATE_S6:
                            if (laa) {
                                ajax_params.data[LAST_ACCEPTED_PROPERTY] = laa;
                            }
                            break;
                        case ACCEPT_CONSTRAINT_OR_FINAL_PUNCTUATION_STATE_S2: //I need to find last free variable, that can be a class or a property
                        case ACCEPT_PROPERTY_FOR_CONSTRAINT_STATE_S4:
                        case ACCEPT_PROPERTY_FOR_UNARY_OPERATOR_S10:
                            ajax_params.data[OPEN_VARIABLES_URI] = open_variables[0];
                            ajax_params.data[OPEN_VARIABLES_POSITION] = open_variables[2];
                            if (laa) {
                                ajax_params.data[LAST_ACCEPTED_PROPERTY] = laa;
                            }
                            ajax_params.data[FINAL_PUNCTUATION] = $(input).data("tokenInputObject").getFinalPunctuation();
                            break;
                        case ACCEPT_SELF_PROPERTY_AS_DIRECT_OPERAND_STATE_S7: //I need to find both last accepted property and last accepted class
                        case ACCEPT_SELF_PROPERTY_AS_INDIRECT_OPERAND_STATE_S8:
                        case ACCEPT_PROPERTY_FOR_RANK_STATE_S9:
                            var laa = $(input).data("tokenInputObject").getLastAcceptedProperty();
                            if (laa) {
                                ajax_params.data[LAST_ACCEPTED_PROPERTY] = laa;
                            }
                            var open_variables = $(input).data("tokenInputObject").getOpenVariables();
                            ajax_params.data[OPEN_VARIABLES_URI] = open_variables[0];
                            ajax_params.data[OPEN_VARIABLES_POSITION] = open_variables[2];
                            break;
                    }
                }

                if (autocompleteUrl.indexOf("?") > -1) {
                    var parts = autocompleteUrl.split("?");
                    ajax_params.url = parts[0];

                    var param_array = parts[1].split("&");
                    $.each(param_array, function (index, value) {
                        var kv = value.split("=");
                        ajax_params.data[kv[0]] = kv[1];
                    });
                } else {
                    ajax_params.url = autocompleteUrl;
                }

                // Prepare the request
                ajax_params.data[QUERY] = query;
                ajax_params.type = $(input).data("settings").method;
                ajax_params.dataType = $(input).data("settings").contentType;
                if ($(input).data("settings").crossDomain) {
                    ajax_params.dataType = "jsonp";
                }

                // Attach the success callback
                ajax_params.success = function (results) {
                    results = mergeResults(results, query);
                    successFunction(results, query);
                }

                // Provide a beforeSend callback
                if (settings.onSend) {
                    settings.onSend(ajax_params);
                }

                // Make the request
                $.ajax(ajax_params);
            }
        }

        function do_translation() {
            hide_dropdown();
            var translationUrl = computeTranslationURL();
            // Extract existing get params
            var ajax_params = {};
            ajax_params.data = {};
            var states = [];
            var tokens = $(input).data("tokenInputObject").getTokens();
            for (var i = 0; i < tokens.length; i++) {
                var t = {};
                t[STATE_FIELD] = tokens[i][STATE_FIELD];
                t[LABELS_FIELD] = tokens[i][LABELS_FIELD];
                t[TOKEN_TYPE_FIELD] = tokens[i][TOKEN_TYPE_FIELD];
                t[RESTRICTED_TEXT_FIELD] = tokens[i][RESTRICTED_TEXT_FIELD];
                t[RELATED_TOKEN_POSITION_FIELD] = tokens[i][RELATED_TOKEN_POSITION_FIELD];
                states.push(t);
            }
            ajax_params.data[STATES] = JSON.stringify(states);
            ajax_params.data[ENDPOINT] = $("#endpoint").val();
            ajax_params.data[LIMIT] = $("#limit").val();

            if (translationUrl.indexOf("?") > -1) {
                var parts = translationUrl.split("?");
                ajax_params.url = parts[0];

                var param_array = parts[1].split("&");
                $.each(param_array, function (index, value) {
                    var kv = value.split("=");
                    ajax_params.data[kv[0]] = kv[1];
                });
            } else {
                ajax_params.url = translationUrl;
            }

            // Prepare the request
            ajax_params.type = "POST";
            ajax_params.dataType = $(input).data("settings").contentType;
            if ($(input).data("settings").crossDomain) {
                ajax_params.dataType = "jsonp";
            }

            // Attach the success callback
            ajax_params.success = function (result) {
                showTranslation(result);
            };

            // Provide a beforeSend callback
            if (settings.onSend) {
                settings.onSend(ajax_params);
            }

            // Make the request
            $.ajax(ajax_params);
        }

        function do_query() {
            hide_dropdown();
            var queryUrl = computeQueryURL();
            // Extract existing get params
            var ajax_params = {};
            ajax_params.data = {};
            var states = [];
            var tokens = $(input).data("tokenInputObject").getTokens();
            for (var i = 0; i < tokens.length; i++) {
                var t = {};
                t[STATE_FIELD] = tokens[i][STATE_FIELD];
                t[LABELS_FIELD] = tokens[i][LABELS_FIELD];
                t[TOKEN_TYPE_FIELD] = tokens[i][TOKEN_TYPE_FIELD];
                t[RESTRICTED_TEXT_FIELD] = tokens[i][RESTRICTED_TEXT_FIELD];
                t[RELATED_TOKEN_POSITION_FIELD] = tokens[i][RELATED_TOKEN_POSITION_FIELD];
                t[FREETEXT] = tokens[i][FREETEXT];
                states.push(t);
            }
            ajax_params.data[STATES] = JSON.stringify(states);
            ajax_params.data[ENDPOINT] = $("#endpoint").val();
            ajax_params.data[LIMIT] = $("#limit").val();

            if (queryUrl.indexOf("?") > -1) {
                var parts = queryUrl.split("?");
                ajax_params.url = parts[0];

                var param_array = parts[1].split("&");
                $.each(param_array, function (index, value) {
                    var kv = value.split("=");
                    ajax_params.data[kv[0]] = kv[1];
                });
            } else {
                ajax_params.url = queryUrl;
            }

            // Prepare the request
            ajax_params.type = "POST";
            ajax_params.dataType = $(input).data("settings").contentType;
            if ($(input).data("settings").crossDomain) {
                ajax_params.dataType = "jsonp";
            }

            // Attach the success callback
            ajax_params.success = function (result) {
                showResults(result);
            };

            // Provide a beforeSend callback
            if (settings.onSend) {
                settings.onSend(ajax_params);
            }

            // Make the request
            $.ajax(ajax_params);
        }

        // compute the dynamic URL of the autocompleter
        function computeAutocompleteURL() {
            var settings = $(input).data("settings");
            return typeof settings.autocompleteUrl === 'function' ? settings.autocompleteUrl.call(settings) : settings.autocompleteUrl;
        }

        // compute the dynamic URL of the query engine
        function computeQueryURL() {
            var settings = $(input).data("settings");
            return typeof settings.queryUrl === 'function' ? settings.queryUrl.call(settings) : settings.queryUrl;
        }

        // compute the dynamic URL of the translation engine
        function computeTranslationURL() {
            var settings = $(input).data("settings");
            return typeof settings.translationUrl === 'function' ? settings.translationUrl.call(settings) : settings.translationUrl;
        }

        // compute the dynamic name of the result div
        function computeResultDiv() {
            var settings = $(input).data("settings");
            return typeof settings.resultDiv === 'function' ? settings.resultDiv.call(settings) : settings.resultDiv;
        }

        // Bring browser focus to the specified object.
        // Use of setTimeout is to get around an IE bug.
        // (See, e.g., http://stackoverflow.com/questions/2600186/focus-doesnt-work-in-ie)
        //
        // obj: a jQuery object to focus()
        function focusWithTimeout(object) {
            setTimeout(
                    function () {
                        object.focus();
                    },
                    50
                    );
        }
    };
}(jQuery));
