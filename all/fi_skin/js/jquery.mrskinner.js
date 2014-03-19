

(function ($) {

    // apply skin to all 
    // <select> elements on page
    $.mrSkinner = function (options) {
        $("select").mrSkinner(options);
    }

    // available skins
    $.mrSkinner.defaults = { skin: "default", focus: false }

    // apply skin
    $.fn.mrSkinner = function (options) {

        // for each element
        return this.each(function () {

            // set source element
            var source = $(this);

            // only apply dropdown for 
            // html select elements
            if (!source.is("select")) {
                return;
            }

            // merge options with default settings
            var settings = $.extend({}, $.mrSkinner.defaults, options);

            // create dropdown
            var dropDown = createDropDown(source);

            // get dropdown elements
            var container = dropDown.find("div");
            var input = dropDown.find("input");

            // add skin css class to container
            container.removeClass().addClass(settings.skin);

            // set focus on input
            if (settings.focus) {
                input.focus();
            }
        });

        // create the dropdown 
        function createDropDown(source) {

            // only create once for each
            // html select element
            if (isDropDownCreated(source)) {
                return source.next();
            }

            // get source elements
            var options = source.find("option");
            var selected = source.find("option[selected]");

            // create dropdown
            var dropDown = $("<div class='dropdown'><div><input></input><ul></ul></div></div>");
            source.after(dropDown);

            // hide the source
            source.hide();

            // get dropdown elements            
            var input = dropDown.find("input");
            var list = dropDown.find("ul");

            // make input readonly 
            input.attr("readonly", "readonly");

            // migrate tabindex 
            if (source.attr("tabindex")) {
                input.attr("tabindex", source.attr("tabindex"));
            }

            // stop here if no data
            // is available
            if (options.length === 0) {
                return dropDown;
            }

            // create the items list
            options.each(function () {

                // set elements
                var option = $(this);
                var item = $("<li>" + option.text() + "</li>");

                // set the selected item
                if (selected.get(0) === option.get(0)) {
                    item.addClass("selected");
                    input.val(item.text());
                }

                // add to 
                list.append(item);
            });

            // get the items element
            var items = list.find("li");
            
            // add click event on input
            // to open / close dropdown 
            input.click(function () {
                toogleDropDown(input, list);
            });

             // add hover event
             hover(input);

            // add click event on items
            // to select items
            items.click(function () {

                // set selected element
                var selected = $(this);

                // select value
                selectValue(source, input, items, selected);
                closeDropDown(input, list);
            });

            // add hover event to items            
            hover(items);

            // add zebra to list items
            items.filter(":odd").addClass("zebra");

            // add keyboard events to droDown 
            // to make acceccable
            addKeyboardEvents(source, input, list, items);

            return dropDown;
        }

        // add keyboard shortcuts
        function addKeyboardEvents(source, input, list, items) {

            $(document).keydown(function (event) {

                var $target = $(event.target);
                if ($target.get(0) === input.get(0)) {

                    var key = event.keyCode || event.which;

                    // Enter pressed
                    if (key === 13) {
                        toogleDropDown(input, list);
                    }
                    // Up key pressed
                    else if (key == 38) {

                        var selected = items.filter(".selected");

                        if (items.index(selected) != 0) {
                            selectValue(source, input, items, selected.prev());
                        } else {
                            selectValue(source, input, items, items.last());
                        }
                    }
                    // Down key pressed
                    else if (key == 40) {

                        var selected = items.filter(".selected");

                        if (items.length > (items.index(selected) + 1)) {
                            selectValue(source, input, items, selected.next());
                        } else {
                            selectValue(source, input, items, items.first());
                        }
                    }
                    // Escape key pressed
                    else if (key == 27) {
                        closeDropDown(input, list);
                    }
                }
            });

        }

        // checks if dropdown has been created
        // on a html select element
        function isDropDownCreated(source) {
            // chech if next element is DropDown
            var next = source.next();
            if (next.hasClass("dropdown")) {
                return true;
            }
            return false;
        }

        // sets the dropdown select value
        function selectValue(source, input, items, selected) {

            // set as selected
            items.removeClass("selected");
            selected.addClass("selected");

            // update source and trigger change event
            source.attr("selectedIndex", items.index(selected));
            source.trigger("change");

            // update input
            input.val(selected.text());

        }

        // open / close dropdown
        function toogleDropDown(input, list) {
            if (list.css("display") === "none") {
                openDropDown(input, list);
            } else {
                closeDropDown(input, list);
            }
        }

        // open dropdown
        function openDropDown(input, list) {
            // open dropdown
            input.addClass("open");
            list.addClass("open");
            list.slideDown("fast");
        }

        // close dropdown
        function closeDropDown(input, list) {
            // close dropdown		
            input.removeClass("open");
            list.removeClass("open");
            list.slideUp("fast");
        }

        // add hover to element 
        function hover(element) {
            element.hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });
        }

        // remove dropdown from 
        // html select element
        function removeDropDown(source) {

            // show source
            source.show();

            // remove dropdown
            if (isDropDownCreated(source)) {
                source.next().remove();
            }
        }
    }
})(jQuery);