export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

export function el(tag, attrs = {}, children = []) {
    const elem = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
        if (key === 'className') elem.className = val;
        else if (key === 'textContent') elem.textContent = val;
        else if (key === 'innerHTML') elem.innerHTML = val;
        else if (key.startsWith('on') && typeof val === 'function') {
            elem.addEventListener(key.slice(2).toLowerCase(), val);
        }
        else elem.setAttribute(key, val);
    }
    for (const child of children) {
        if (typeof child === 'string') {
            elem.appendChild(document.createTextNode(child));
        } else if (child) {
            elem.appendChild(child);
        }
    }
    return elem;
}

export function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function showModal(title, contentEl, onConfirm, onCancel) {
    const overlay = el('div', { className: 'modal-overlay' });
    const modal = el('div', { className: 'modal' });
    const titleEl = el('h3', { className: 'modal__title', textContent: title });
    const actions = el('div', { className: 'modal__actions' });

    if (onCancel) {
        actions.appendChild(el('button', {
            className: 'btn',
            textContent: 'Cancel',
            onClick: () => { overlay.remove(); onCancel(); }
        }));
    }

    actions.appendChild(el('button', {
        className: 'btn btn--primary',
        textContent: 'Confirm',
        onClick: () => { overlay.remove(); if (onConfirm) onConfirm(); }
    }));

    modal.appendChild(titleEl);
    modal.appendChild(contentEl);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    });

    document.body.appendChild(overlay);
    return overlay;
}
