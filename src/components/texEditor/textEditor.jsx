import { EditorState } from "draft-js";
import React, {useState} from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export default function textEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [body, setbody] = useState('')


  const onEditorStatChange = (editorState) => {
    setEditorState(editorState);
  }

  return (
    <div
    >

        <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        />;
            </div>
  );
}
