/* IMPORT */
/* MAIN */
const createComment = document.createComment.bind(document, '');
const createHTMLNode = document.createElement.bind(document);
const createSVGNode = document.createElementNS.bind(document, 'http://www.w3.org/2000/svg');
const createText = document.createTextNode.bind(document);
/* EXPORT */
export { createComment, createHTMLNode, createSVGNode, createText };
//# sourceMappingURL=creators.js.map