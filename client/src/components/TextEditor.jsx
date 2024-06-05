import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ data, onDataChange }) => {
  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      ['clean']
    ],
  };

  return (
    <ReactQuill modules={modules} value={data} onChange={onDataChange} />
  );
};

export default TextEditor;
