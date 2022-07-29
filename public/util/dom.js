'use strict';

export const createElement = ({
    type = 'div',
    parent,
    content,
    classes,
    styles,
    props,
    prepend
} = {}) => {
    const element = document.createElement(type);

    if (parent) {
        if (prepend) {
            parent.prepend(element);
        } else {
            parent.append(element);
        }
    }

    if (content) element.innerHTML = content;

    if (classes) {
        classes.forEach(className => element.classList.add(className));
    }

    if (styles) {
        for (let key in styles) {
            element.style[key] = styles[key];
        }
    }

    for (let key in props) {
        element[key] = props[key];
    }

    return element;
}

export const $ = selector => {
    return document.querySelector(selector);
}

export const $$ = selector => {
    return Array.from(document.querySelectorAll(selector));
}