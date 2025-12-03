import React from 'react';
import styles from './InterviewResultModal.module.css';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import useEscapeKey from "../../components/UseEscapeKey/useEscapeKey"
import { useEditor, EditorContent } from '@tiptap/react';
import 'prosemirror-view/style/prosemirror.css';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';


function InterviewResultModal({ onClose, onSubmit }) {
    useEscapeKey(onClose);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Heading,
            Bold,
            Italic,
            Underline,
            Highlight,
            Blockquote,
            BulletList,
            OrderedList,
            ListItem,
            HardBreak,
            HorizontalRule,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link,
        ],
        content: '',
    });

    const handleConfirm = () => {
        const data = {
            interviewer: document.querySelector('select').value,
            score: document.querySelector('input[type="number"]').value,
            remark: document.querySelector('textarea').value,
            questions: editor?.getHTML() || '',
        };
        
        onSubmit(data);
        onClose();
    };

    return (
        <div className={styles.interviewModalOverlay}>

            <div className={styles.interviewModalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <h2 className={styles.interviewModalTitle}>Interview Result</h2>

                <div className={styles.interviewModalField}>
                    <label>Interviewer Name</label>
                    <select className={styles.interviewModalInput}>
                        <option value="">Select Interviewer</option>
                        <option value="Vimal">Vimal</option>
                        <option value="Anjali">Anjali</option>
                        <option value="Suresh">Suresh</option>
                    </select>
                </div>

                <div className={styles.interviewModalField}>
                    <label>Score</label>
                    <input
                        type="number"
                        className={styles.interviewModalInput}

                    />
                </div>

                <div className={styles.interviewModalField}>
                    <label>Remark</label>
                    <textarea className={styles.interviewModalTextarea} rows={3} />
                </div>

                <div className={styles.interviewModalField}>
                    <label>Questions Asked</label>
                    <div className={styles.toolbar}>
                        <button onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

                        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
                        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
                        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
                        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
                        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</button>
                        <button onClick={() => editor.chain().focus().setHardBreak().run()}>Line Break</button>
                        <button onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                            }
                        }}>Link</button>
                        <button onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>

                        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
                        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
                        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
                    </div>

                    <EditorContent editor={editor} className={styles.interviewModalEditor} />
                </div>

                <div className={styles.interviewModalButtonWrapper}>
                    <PrimaryButton label="Confirm" onClick={handleConfirm} />
                </div>
            </div>
        </div>
    );
}

export default InterviewResultModal;
