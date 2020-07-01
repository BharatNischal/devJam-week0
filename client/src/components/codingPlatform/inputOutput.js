import React,{useState,useEffect} from 'react'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function InputOutput(props) {

  const [sampleEditorState1,setSampleEditorState1] = useState(EditorState.createEmpty());
  const [sampleEditorState2,setSampleEditorState2] = useState(EditorState.createEmpty());

  useEffect(()=>{

    const contentBlock1 = htmlToDraft(props.input);
    if (contentBlock1) {
      const contentState = ContentState.createFromBlockArray(contentBlock1.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setSampleEditorState1(editorState);
    }
    const contentBlock2 = htmlToDraft(props.output);
    if (contentBlock2) {
      const contentState = ContentState.createFromBlockArray(contentBlock2.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setSampleEditorState1(editorState);
    }

  },[])

  function toHTML() {
    draftToHtml(convertToRaw(sampleEditorState1.getCurrentContent()));
  }

  return (
    <React.Fragment>
        <div className="row">
            <div className="col-lg-6">
                <h2 className="topicTitle text-pink mb-2"  ><b>Input Format</b></h2>
                <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={sampleEditorState1}
                    onEditorStateChange={(editorState)=>setSampleEditorState1(editorState)}
                    toolbar={{
                        options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                    }}
                />
            </div>
            <div className="col-lg-6">
                <h2 className="topicTitle text-pink mb-2"  ><b>Output Format</b></h2>
                <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={sampleEditorState2}
                    onEditorStateChange={(editorState)=>setSampleEditorState2(editorState)}
                    toolbar={{
                        options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                    }}
                />
            </div>
        </div>
    </React.Fragment>
  )
}
