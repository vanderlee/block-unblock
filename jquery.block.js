/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * Block/Unblock
 *
 * Copyright (c) 2011-2013 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Visual, styleable screen-block with delay and content (all optional).
 */

(function($) {
    "use strict";

    var overlay = undefined,
        options = {
            'context': 'body',
            'css': undefined,
            'delay': 500,
            'id': undefined,
            'message': 'Please wait&hellip;',
            'speed': 'slow',
            'style': {
                'background-color': 'black',
                'opacity': .5
            },
            'timeout': 10000,
            'zIndex': 20000,
            'onblock': undefined,
            'onunblock': undefined,
            'ontimeout': undefined,
            'ondisplay': undefined
        },
        delay = undefined,
        timeout = undefined,
        _unblock = function() {
            if (timeout) timeout = clearTimeout(timeout);
            if (delay) delay = clearTimeout(delay);
            if (overlay) {
                overlay.remove();
                overlay = undefined;
            }
        };

    $.block = function(_options) {
        if (overlay) return;

        if (_options) {
            $.extend(options, _options);
        }

        overlay = $('<div/>').css({
            'z-index': options.zIndex,
            'position': 'fixed',
            'left': 0,
            'top': 0,
            'bottom': 0,
            'right': 0
        }).appendTo(options.context);

        if (options.onblock) options.onblock();

        if (options.timeout) {
            timeout = setTimeout(function() {
                _unblock();
                if (options.ontimeout) options.ontimeout();
            }, options.timeout);
        }

        delay = setTimeout(function() {
            if (options.ondisplay) options.ondisplay();

            var container = $('<div/>').css({
                'position': 'absolute',
                'width': '100%',
                'height': '100%'
            }).hide().appendTo(overlay);

            var background = $('<div/>').css({
                'position': 'absolute',
                'width': '100%',
                'height': '100%'
            }).appendTo(container);
            if (options.css) background.addClass(options.css);
            if (options.style) background.css(options.style);
            if (options.id) background.attr('id', options.id);

            var table = $('<div/>').css({
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
                'display': 'table'
            }).appendTo(container);

            var cell = $('<div/>').css({
                'display': 'table-cell',
                'vertical-align': 'middle',
                'text-align': 'center',
                'opacity': 1
            }).html(options.message).appendTo(table);

            container.fadeIn(options.speed);
        }, options.delay);
    };

    $.unblock = function() {
        _unblock();
        if (options.onunblock) options.onunblock();
    };
})(jQuery);