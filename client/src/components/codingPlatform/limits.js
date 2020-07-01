import React, { useState,useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function Limits(props) {

    const [sampleEditorState,setSampleEditorState] = useState(EditorState.createEmpty());
    const [memoryLimit,setMemoryLimit] = useState(256);
    const [timeLimit,setTimeLimit] = useState(5);

    useEffect(()=>{

      const constraintBlock = htmlToDraft(props.constraints);
      if (constraintBlock) {
        const contentState = ContentState.createFromBlockArray(constraintBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setSampleEditorState(editorState);
      }

    },[])


    return (
        <React.Fragment>
            <h2 className="topicTitle text-pink mb-2"  ><b>Constraints</b></h2>
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="constraintWrapper"
                editorClassName="editorClassName"
                editorState={sampleEditorState}
                onEditorStateChange={(editorState)=>setSampleEditorState(editorState)}
                toolbar={{
                    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'remove', 'history']
                }}
            />
            <div className=" row my-4">
                <div className="col-md-6">
                    <h4 className="text-pink"> <b>Time Limit (Seconds) </b> </h4>
                    <div className="form-group input-group px-lg-4">
                        <div className="input-group-prepend rounded bg-grad text-white pl-3 pr-3 pt-2 f-20 " > <i className="fa fa-clock"></i> </div>
                        <input type="number" className="form-control"   placeholder="Enter Time" value={timeLimit} onChange={(e)=>setTimeLimit(e.target.value)}/>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4 className="text-pink"> <b>Memory Limit (KB) </b> </h4>
                    <div className="form-group input-group px-lg-4">
                        <div className="input-group-prepend rounded bg-grad text-white pl-3 pr-3 pt-2 f-20 " > <i className="fas fa-memory"></i> </div>
                        <input type="number" className="form-control"   placeholder="Enter Memory Limit" value={memoryLimit} onChange={(e)=>setMemoryLimit(e.target.value)} />
                    </div>
                </div>

            </div>

        </React.Fragment>
    )
}


export default Limits
