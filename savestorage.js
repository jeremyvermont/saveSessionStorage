/**
 * javaScript saveStorage - 11.03.2020
 * Version: 1.0.0
 * Website: https://github.com/sarkhanrajabov/saveStorage-js
 * Author: Sarkhan Rajabov
 * Modified by Jeremy B. to use SessionsStorage
 **/

function saveStorage(selector, options) {
    'use strict';

    if (typeof Storage !== "undefined") {

        let form = document.querySelector(selector),
            key = form.getAttribute('id') + '_saveStorage',
            elements = form.querySelectorAll('input, textarea, select'),
            defaults = {
                exclude: [],
            };

        let extend = function (out) {
            out = out || {};

            for (let i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (let key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        };

        let opts = extend({}, defaults, options);

        let excludeInputType = function () {
            let inputType = '';

            opts.exclude.forEach(function (type) {
                inputType += ':not([type=' + type + '])';
            });

            return inputType;
        };

        let serializeArray = function () {
            let serializeData = [];

            elements.forEach(function (el) {
                if (el.type !== 'radio' && el.type !== 'checkbox') {
                    serializeData.push({ name: el.name, value: el.value, type: el.type });
                }
                else if (el.checked) {
                    serializeData.push({ name: el.name, value: el.value, type: el.type });
                }
            });

            return serializeData;
        };

        let setSessionStorage = function () {
            let formData = JSON.stringify(serializeArray());
            sessionStorage.setItem(key, formData);
        };

        let initApp = function () {
            if (sessionStorage.getItem(key) !== null) {

                let data = JSON.parse(sessionStorage.getItem(key));

                data.forEach(function (v) {

                    if (v.type !== 'radio' && v.type !== 'checkbox') {
                        if (form.querySelector('[name=' + escapeBrackets(v.name) + ']')) {
                            let input = form.querySelector('[name=' + escapeBrackets(v.name) + ']' + excludeInputType());

                            if (input !== null) {
                                input.value = v.value;
                            }
                        }
                    }
                    else {
                        let input = form.querySelectorAll('[name=' + escapeBrackets(v.name) + ']');

                        input.forEach(function (el) {
                            if (el.name === v.name && el.value === v.value) {
                                el.checked = true;
                            }
                        })
                    }
                });
            }
        };

        function escapeBrackets(value) {
            const escapeCharacter = '\\';
            let escaped = value;
            escaped = escaped.replace('[', escapeCharacter + '[');
            escaped = escaped.replace(']', escapeCharacter + ']');
            return escaped
        }
        function unescapeBrackets(value) {
            const escapeCharacter = '\\';
            let unescaped = value;
            unescaped = unescaped.replace(escapeCharacter + '[', '[');
            unescaped = unescaped.replace(escapeCharacter + ']', ']');
            return unescaped
        }


        form.addEventListener('change', function () {
            setSessionStorage();
        });

        elements.forEach(function (el) {
            el.addEventListener('keyup', function () {
                setSessionStorage();
            });
        });

        form.addEventListener('submit', function () {
            sessionStorage.removeItem(key);
        });

        initApp();
    }
    else {
        console.error('Sorry! No web storage support.');
    }
}
