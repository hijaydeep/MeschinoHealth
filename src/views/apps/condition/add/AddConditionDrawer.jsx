'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Divider,
  Typography
} from '@mui/material';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@core/styles/editor.css';

export const dynamic = 'force-dynamic'

const AddConditionDrawer = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
    topicDescription: EditorState.createEmpty(),
    status: EditorState.createEmpty(),
  });

  const handleBack = () => {
    setFormData({
      name: '',
      description: '',
      topic: EditorState.createEmpty(),
      topicDescription: EditorState.createEmpty(),
      status: ''
    });
    router.push('/apps/condition/list');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (field, editorState) => {
    setFormData({ ...formData, [field]: editorState });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Data = {
      name: formData.name,
      description: formData.description,
      topic: draftToHtml(convertToRaw(formData.topic.getCurrentContent())),
      topicDescription: draftToHtml(convertToRaw(formData.topicDescription.getCurrentContent())),
      status: formData.status,
    }

    const res = await fetch('/api/apps/condition/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Data)
    });
    const data = await res.json()
    if (res.status === 200) {
      setFormData(data);
      router.push('/apps/condition/list')
    } else {
      console.log('An error occurred');
    }
  };

  return (
    <>
      <div className='flex items-center justify-between pli-5 plb-[15px]'>
        <Typography variant='h5'>Add New Condition</Typography>
        <IconButton onClick={handleBack}>
          <i className='ri-close-line' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
              onEditorStateChange={(editorState) => handleEditorChange('topic', editorState)}
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
              onEditorStateChange={(editorState) => handleEditorChange('topicDescription', editorState)}
            />
          </div>
          <FormControl>
            <InputLabel id='plan-select'>Select Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              label='Select Status'
            >
              <MenuItem value='pending'>Pending</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='outlined' color='error' onClick={handleBack}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddConditionDrawer;
