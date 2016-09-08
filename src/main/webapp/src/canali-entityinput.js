;
(function ($) {

    var TEXT_FIELD = "t";
    var RESTRICTED_TEXT_FIELD = "r";
    var STATE_FIELD = "s";
    var LABELS_FIELD = "l";
    var TOKEN_TYPE_FIELD = "k";
    var ENTITY = "entity";

    var STATES = "s";
    var ENDPOINT = "e";
    var LABEL = "l";
    var URL = "u";
    var ABSTRACT = "a";
    var PICTURE = "p";
    var LABEL_ENTITY = "le";
    var URL_ENTITY = "ue";
    var PROPERTY_TEXT = "pt";


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
        zindex: 6000,
        resultsLimit: null,
        enableHTML: false,
        resultsFormatter: function (item) {
            var string = item[TEXT_FIELD];
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
                res += "\"";
            }
            return res + ">" + (this.enableHTML ? string : _escapeHTML(string)) + "&nbsp;</p></li>";
        },
        // Tokenization settings
        idPrefix: "token-input-",
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
        init: function (autocompleterMethod, queryMethod, resultDiv, options) {
            var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

            return this.each(function () {                
                $(this).data("settings", settings);
                $(this).data("entityInputObject", new $.EntityList(this, autocompleterMethod, queryMethod, resultDiv, settings));
            });
        },
        clear: function () {
            this.data("entityInputObject").clear();
            return this;
        },
        add: function (item) {
            this.data("entityInputObject").add(item);
            return this;
        },
        remove: function (item) {
            this.data("entityInputObject").remove(item);
            return this;
        },
        get: function () {
            return this.data("entityInputObject").getTokens();
        },
        setOptions: function (options) {
            $(this).data("settings", $.extend({}, $(this).data("settings"), options || {}));
            return this;
        },
        setEntity: function(text, uri, obj) {       
            return obj.data("entityInputObject").setEntity(text, uri);
        },
        destroy: function () {
            if (this.data("entityInputObject")) {
                this.data("entityInputObject").clear();
                var tmpInput = this;
                var closest = this.parent();
                closest.empty();
                tmpInput.show();
                closest.append(tmpInput);
                return tmpInput;
            }
        }
    };

    // Expose the .entityInput function to jQuery as a plugin
    $.fn.entityInput = function (autocompleteMethod, queryMethod, resultDiv) {
        return methods.init.apply(this, arguments);
    };
    
    $.fn.setEntity = function(text, uri) {
        return methods.setEntity(text, uri, this);
    };

    // EntityList class for each input
    $.EntityList = function (input, autocompleteMethod, queryMethod, resultDiv) {
        
        $(input).data("settings").autocompleteUrl = autocompleteMethod;
        $(input).data("settings").queryUrl = queryMethod;
        $(input).data("settings").resultDiv = resultDiv;

        // If the URL is a function, evaluate it here to do our initalization work
        var autocompleteUrl = computeAutocompleteURL();

        // Make a smart guess about cross-domain if it wasn't explicitly specified
        if ($(input).data("settings").crossDomain === undefined && typeof autocompleteUrl === "string") {
            if (autocompleteUrl.indexOf("://") === -1) {
                $(input).data("settings").crossDomain = false;
            } else {
                $(input).data("settings").crossDomain = (location.href.split(/\/+/g)[1] !== autocompleteUrl.split(/\/+/g)[1]);
            }
        }

        // Set the url to query against
        

        // If the URL is a function, evaluate it here to do our initalization work
        var queryUrl = computeQueryURL();

        // Make a smart guess about cross-domain if it wasn't explicitly specified
        if ($(input).data("settings").crossDomain === undefined && typeof queryUrl === "string") {
            if (queryUrl.indexOf("://") === -1) {
                $(input).data("settings").crossDomain = false;
            } else {
                $(input).data("settings").crossDomain = (location.href.split(/\/+/g)[1] !== queryUrl.split(/\/+/g)[1]);
            }
        }

        // Set the url to query against
        $(input).data("settings").resultDiv = resultDiv;

        // If the URL is a function, evaluate it here to do our initalization work
        var resultDiv = computeResultDiv();

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
                            saved_tokens && saved_tokens.length > 0) {
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
                                add_token($(selected_dropdown_item).data("entityinput"));
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
                            if (saved_tokens && saved_tokens.length > 0) {
                                do_query();
                                break;
                            }
                            return false;
                        case KEY.ESCAPE:
                            hide_dropdown();
                            return true;
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
                    if (li && li.get(0) && $.data(li.get(0), "entityinput")) {
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
                    var currToken = $(this).data("entityinput");
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
        
        this.setEntity = function (text, uri) {
            this.clear();
            var item={};
            item[TEXT_FIELD]=text;
            item[RESTRICTED_TEXT_FIELD]=text;
            item[LABELS_FIELD]=uri;
            item[TOKEN_TYPE_FIELD]=ENTITY;
            var div = $("#" + computeResultDiv());
            div.html("");
            this.add(item);
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
            input_resizer.html(_escapeHTML(input_val));
            // Get maximum width, minimum the size of input and maximum the widget's width
            input_box.width(Math.min(token_list.width(),
                    Math.max(width_left, input_resizer.width() + 30)));
        }

        // Inner function to add a token to the list
        function insert_token(item) {
            var $this_token = $($(input).data("settings").tokenFormatter(item));
            var readonly = item.readonly === true;

            if (readonly)
                $this_token.addClass($(input).data("settings").classes.tokenReadOnly);

            $this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);

            // Store data on the token
            var token_data = item;
            $.data($this_token.get(0), "entityinput", item);

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
                    var existing_data = $.data(existing_token.get(0), "entityinput");
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
            input_box.val("");

            // Squeeze input_box so we force no unnecessary line break
            input_box.width(1);


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
            do_query();
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
            var token_data = $.data(token.get(0), "entityinput");
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
            var token_data = $.data(token.get(0), "entityinput");
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

        // Populate the results dropdown with some results
        function populateDropdown(query, results) {

            if (results && results.length) {
                dropdown.empty();
                var dropdown_ul = $("<ul/>")
                        .appendTo(dropdown)
                        .mouseover(function (event) {
                            select_dropdown_item($(event.target).closest("li"));
                        })
                        .mousedown(function (event) {
                            add_token($(event.target).closest("li").data("entityinput"));
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
                        return false;
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

                    $.data(this_li.get(0), "entityinput", value);
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

        function showResults(result) {
            debugger;
            var div = $("#" + computeResultDiv());
            if (result[0]["Error"]) {
                div.text(result[0]["Error"]);
            } else {
                div.html("");
                if (Object.keys(result[0]).length + Object.keys(result[1]).length === 0) {
                    div.html("No results");
                } else {
                    if (Object.keys(result[0]).length > 0) {
                        div.append($('<div><b>Subject of triples with the following property/values:</b><br /></div>'));
                        var table1=$('<table></table>');
                        div.append(table1);
                        $.each(result[0], function (index, value) {
                            var tr1 = $('<tr><td>'+index+'</td><td>'+value+'</td></tr>');                            
                            table1.append(tr1);
                        });
                    }
                    if (Object.keys(result[1]).length > 0) {
                        div.append($('<div><b>Value of triples with the following subject/properties:</b><br /></div>'));
                        var table2=$('<table></table>');
                        div.append(table2);
                        $.each(result[1], function (index, value) {
                            var tr2 = $('<tr><td>'+value+'</td><td>'+index+'</td></tr>');                            
                            table2.append(tr2);
                        });
                    }
                }
            }
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
                    if (query.length === 0 && saved_tokens.length === 0) {
                        show_dropdown_message("Start typing an entity name");
                    } else if (query.length < 4) {
                        show_dropdown_message("Continue typing the entity name");
                    } else {
                        show_dropdown_message("No results");
                    }
                } else {
                    if (input_box.val() === query) {
                        populateDropdown(query, $(input).data("settings").jsonContainer ? results[$(input).data("settings").jsonContainer] : results);
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
                // Extract existing get params
                var ajax_params = {};
                ajax_params.data = {};
                // Prepare the request
                ajax_params.url = autocompleteUrl;
                ajax_params.data[QUERY] = query;
                ajax_params.type = $(input).data("settings").method;
                ajax_params.dataType = $(input).data("settings").contentType;
                if ($(input).data("settings").crossDomain) {
                    ajax_params.dataType = "jsonp";
                }

                // Attach the success callback
                ajax_params.success = function (results) {
                    successFunction(results, query);
                }

                // Make the request
                $.ajax(ajax_params);
            }
        }

        function do_query() {
            hide_dropdown();
            var queryUrl = computeQueryURL();
            // Extract existing get params
            var ajax_params = {};
            ajax_params.data = {};
            var states = [];
            var tokens = $(input).data("entityInputObject").getTokens();
            var t = {};
            for (var i = 0; i < tokens.length; i++) {
                t[LABELS_FIELD] = tokens[i][LABELS_FIELD];
                t[RESTRICTED_TEXT_FIELD] = tokens[i][RESTRICTED_TEXT_FIELD];
                states.push(t);
            }
            ajax_params.data[STATES] = JSON.stringify(states);
            ajax_params.data[ENDPOINT] = $("#endpoint").val();
            ajax_params.url = queryUrl;

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