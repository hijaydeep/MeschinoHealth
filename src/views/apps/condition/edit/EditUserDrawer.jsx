'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Button,
    TextField,
    Divider,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Typography
} from '@mui/material';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@core/styles/editor.css';

export const dynamic = 'force-dynamic'

const initialData = {
    name: '',
    description: '',
    topic: EditorState.createEmpty(),
    topicDescription: EditorState.createEmpty(),
    status: ''
}

const EditConditionDrawer = () => {

    const router = useRouter();
    const params = useParams();
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        const fetchUserData = async () => {
            const id = params.id;
            try {
                const res = await fetch(`http://localhost:3000/api/apps/condition/${id}`);
                const data = await res.json();

                const topicBlocks = convertFromHTML(data.condition.topic);
                const topicContentState = ContentState.createFromBlockArray(topicBlocks);

                const topicDescriptionBlocks = convertFromHTML(data.condition.topicDescription);
                const topicDescriptionContentState = ContentState.createFromBlockArray(topicDescriptionBlocks);

                setFormData({
                    ...data.condition,
                    topic: EditorState.createWithContent(topicContentState),
                    topicDescription: EditorState.createWithContent(topicDescriptionContentState),
                });
            }
            catch {
                console.error('Error fetching condition data:', error);
            }

        };
        fetchUserData();
    }, [params.id]);

    const handleBack = () => {
        router.push('/apps/condition/list');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTopicChange = (editorState) => {
        setFormData({ ...formData, topic: editorState });
    };

    const handleTopicDescriptionChange = (editorState) => {
        setFormData({ ...formData, topicDescription: editorState });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const prepareData = {
            name: formData.name,
            description: formData.description,
            topic: draftToHtml(convertToRaw(formData.topic.getCurrentContent())),
            topicDescription: draftToHtml(convertToRaw(formData.topicDescription.getCurrentContent())),
            status: formData.status,
        }

        const res = await fetch(`http://localhost:3000/api/apps/condition/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prepareData)
        });
        if (res.status === 200) {
            router.push('/apps/condition/list');
        } else {
            console.log('An error occurred');
        }
    };

    return (
        <>
            <div className='flex items-center justify-between pli-5 plb-[15px]'>
                <Typography variant='h5'>Edit Condition</Typography>
                <IconButton onClick={handleBack}>
                    <i className='ri-close-line' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleUpdate} className='flex flex-col gap-5'>
                    <TextField
                        label='Name'
                        name='name'
                        fullWidth
                        placeholder='Enter Name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label='Description'
                        name='description'
                        type="textarea"
                        fullWidth
                        placeholder='Enter Description...'
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <div className="flex flex-col space-y-2">
                        <label className="text-gray-700 font-medium">
                            Supplement Considerations:
                        </label>
                        <Editor
                            editorState={formData.topic}
                            toolbarClassName='toolbar'
                            editorClassName='editor'
                            onEditorStateChange={handleTopicChange}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-gray-700 font-medium">
                            Additional Considerations:
                        </label>
                        <Editor
                            editorState={formData.topicDescription}
                            toolbarClassName='toolbar'
                            editorClassName='editor'
                            onEditorStateChange={handleTopicDescriptionChange}
                        />
                    </div>
                    <FormControl fullWidth>
                        <InputLabel id='plan-select'>Select Status</InputLabel>
                        <Select
                            fullWidth
                            id='select-status'
                            name='status'
                            value={formData.status}
                            onChange={handleChange}
                            label='Select Status'
                            labelId='status-select'
                            inputProps={{ placeholder: 'Select Status' }}
                        >
                            <MenuItem value='pending'>Pending</MenuItem>
                            <MenuItem value='active'>Active</MenuItem>
                            <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit'>
                            Update
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleBack}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditConditionDrawer;