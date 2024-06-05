import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import TextEditor from './components/TextEditor';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import './styles/styles.css';
import VoiceInput from './components/VoiceInput';

const App = () => {
  const [text, setText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const parseElement = (elementNode, isBoldParent, isItalicParent, isUnderlineParent) => {    
    console.log(elementNode)
    const children = Array.from(elementNode.childNodes).map(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {        
        setIsBold(isBoldParent || node.tagName === 'STRONG' || node.tagName === 'B');
        setIsItalic(isItalicParent || node.tagName === 'EM' || node.tagName === 'I');
        setIsUnderline(isUnderlineParent || node.tagName === 'U')
        return new TextRun({ bold: isBold, italics: isItalic, children: parseElement(node, isBold, isItalic, isUnderline) });
      } else {
        return new TextRun({ bold: isBoldParent, italics: isItalicParent, underline: isUnderlineParent, text: node.textContent });
      }
    });    
    return children;
  }

  const parseHtmlToDocx = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = [];

    const children = parseElement(doc.body.children[0])

    console.log(children)
    const paragraph = new Paragraph({ children });
    paragraphs.push(paragraph);        

    return paragraphs;
};

  const handleSaveAsDocx = useCallback(async () => {
    console.log(text)
    const doc = new Document({
      sections: [{
          properties: {},
          children: parseHtmlToDocx(text),
      }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'document.docx');
  }, [text, isBold, isItalic, isUnderline]);

  const handleOpenDocx = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        mammoth.convertToHtml({ arrayBuffer: event.target.result })
          .then((result) => {
            setText(result.value);
            console.log(result)
          })
          .catch((error) => {
            console.error('Error reading docx file:', error);
          });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <Header />
      <Toolbar onSaveAsDocx={handleSaveAsDocx} onOpenDocx={handleOpenDocx} />
      <VoiceInput onTextChange={setText} />
      <div className="text-editor-container">
        <TextEditor data={text} onDataChange={setText} />
      </div>
    </div>
  );
};

export default App;
