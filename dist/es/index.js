import React from 'react';
import ReactDOM from 'react-dom';

class Dialog extends React.Component {
    render() {
        return this.props.content;
    }
}

var DialogContext = React.createContext({});

const shadowContainerId = 'ReactDialogShadowContainer';
const shadowContainerStyleId = 'ReactDialogShadowContainerStyles';
function injectOutsideStyles(document) {
    if (document.querySelector(shadowContainerStyleId)) {
        return;
    }
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('id', shadowContainerStyleId);
    style.appendChild(document.createTextNode(`
    #` +
        shadowContainerId +
        ` {
      background: rgba(0,0,0,0);
      bottom: 0;
      height: 100%;
      left: 0;
      opacity: 0;
      position: fixed;
      right: 0;
      top: -1rem;
      transition: all 0.4s ease-out;
      width: 100%;
      z-index: 99999;
    }

    #` +
        shadowContainerId +
        `.open {
      background: rgba(0,0,0,0.4);
      opacity: 1;
      top: 0;
    }
  `));
    document.getElementsByTagName('head')[0].appendChild(style);
}
function injectInsideStyles(document, shadow, styles) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
    shadow.appendChild(style);
}
function createAndAppendContainer(document) {
    let container = document.getElementById(shadowContainerId);
    if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    }
    container = document.createElement('div');
    container.setAttribute('id', 'ReactDialogShadowContainer');
    document.body.appendChild(container);
    return container;
}
function createShadow(container) {
    let shadow;
    if (container.shadowRoot) {
        shadow = container.shadowRoot;
    }
    else {
        shadow = container.attachShadow({ mode: 'open' });
    }
    return shadow;
}
function createAndAppendInsideContainer(document, shadow) {
    const insideContainer = document.createElement('div');
    insideContainer.setAttribute('id', 'ReactDialogInsideContainer');
    shadow.appendChild(insideContainer);
    return insideContainer;
}
function openContainer(container) {
    setTimeout(() => {
        container.classList.add('open');
    }, 0);
}
function ShadowContainer({ document, styles = '', }) {
    const container = createAndAppendContainer(document);
    const shadow = createShadow(container);
    const insideContainer = createAndAppendInsideContainer(document, shadow);
    injectOutsideStyles(document);
    injectInsideStyles(document, shadow, styles);
    openContainer(container);
    return insideContainer;
}

const render = function ({ document, content, styles = '' }) {
    ReactDOM.render(React.createElement(Dialog, { content: content }), ShadowContainer({
        document,
        styles,
    }));
};

export { DialogContext, render };
