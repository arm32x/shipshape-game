/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 1.0
 *
 * @license MIT, see http://github.com/asvd/dragscroll
 * @copyright 2015 asvd <heliosframework@gmail.com>
 * Adapted by awersching
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    const _window = window;
    const _document = document;
    const mousemove = 'mousemove';
    const mouseup = 'mouseup';
    const mousedown = 'mousedown';
    const EventListener = 'EventListener';
    const addEventListener = 'add' + EventListener;
    const removeEventListener = 'remove' + EventListener;
    let newScrollX, newScrollY;

    let dragged = [];
    const reset = function (i, element) {
        for (i = 0; i < dragged.length;) {
            element = dragged[i++];
            element = element.container || element;
            element[removeEventListener](mousedown, element.md, 0);
            _window[removeEventListener](mouseup, element.mu, 0);
            _window[removeEventListener](mousemove, element.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
        for (i = 0; i < dragged.length;) {
            (function (element, lastClientX, lastClientY, pushed, rightButton, scroller, container) {
                (container = element.container || element)[addEventListener](mousedown,
                    container.md = function (event) {
                        rightButton = event.button === 2;

                        if (!element.hasAttribute('nochilddrag') ||
                            _document.elementFromPoint(event.pageX, event.pageY) === container) {
                            pushed = true;
                            if (rightButton) container.classList.add('pushed');
                            lastClientX = event.clientX;
                            lastClientY = event.clientY;
                            event.preventDefault();
                        }
                    }, 0);

                _window[addEventListener](mouseup, container.mu = function () {
                    pushed = false;
                    container.classList.remove('pushed');
                }, 0);

                _window[addEventListener](mousemove, container.mm = function (event) {
                    if (pushed && rightButton) {
                        (scroller = element.scroller || element).scrollLeft -=
                            newScrollX = (-lastClientX + (lastClientX = event.clientX));
                        scroller.scrollTop -=
                            newScrollY = (-lastClientY + (lastClientY = event.clientY));
                        if (element === _document.body) {
                            (scroller = _document.documentElement).scrollLeft -= newScrollX;
                            scroller.scrollTop -= newScrollY;
                        }
                    }
                }, 0);
            })(dragged[i++]);
        }
    };

    if (_document.readyState === 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }
    exports.reset = reset;
}));
