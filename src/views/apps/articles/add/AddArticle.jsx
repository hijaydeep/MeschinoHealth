'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@core/styles/editor.css';

export const dynamic = 'force-dynamic'

const initialData = {
  topic: '',
  source: '',
  author: '',
  condition: '',
  thumbnail: '',
  youtubeLink: '',
  shortDescription: EditorState.createEmpty(),
  longDescription: EditorState.createEmpty(),
  status: '',
}

const MyArticles = () => {

  const router = useRouter();
  const [articleData, setArticleData] = useState(initialData);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/apps/articles/categories'); // Endpoint to fetch categories
        if (response.status === 200) {
          const data = await response.json();
          const categoryNames = data.categories.map(category => category.name);
          setCategories(categoryNames);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArticleData({ ...articleData, thumbnail: file });
    }
  };

  const handleEditorChange = (field, editorState) => {
    setArticleData({ ...articleData, [field]: editorState });
  };

  const handleBack = () => {
    setArticleData(initialData);
    router.push('/apps/articles/list');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('topic', articleData.topic);
      formData.append('source', articleData.source);
      formData.append('author', articleData.author);
      formData.append('condition', articleData.condition);
      formData.append('youtubeLink', articleData.youtubeLink);
      formData.append('status', articleData.status);
      formData.append('thumbnail', articleData.thumbnail);
      formData.append('shortDescription', draftToHtml(convertToRaw(articleData.shortDescription.getCurrentContent())));
      formData.append('longDescription', draftToHtml(convertToRaw(articleData.longDescription.getCurrentContent())));

      const res = await fetch('/api/apps/articles/add', {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        router.push('/apps/articles/list');
      } else {
        console.error('Error adding article');
      }
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between pli-5 plb-[15px]'>
        <Typography variant='h5'>Add New Article</Typography>
        <IconButton onClick={handleBack}>
          <i className='ri-close-line' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            label='Author'
            name='author'
            fullWidth
            placeholder='Enter Author Name'
            value={articleData.author}
            onChange={handleChange}
          />
          <TextField
            label='Topic'
            name='topic'
            fullWidth
            placeholder='Enter Topic'
            value={articleData.topic}
            onChange={handleChange}
          />
          <TextField
            label='Source'
            name='source'
            fullWidth
            placeholder='Enter Source'
            value={articleData.source}
            onChange={handleChange}
          />
          <div className="flex flex-col space-y-2">
            <label htmlFor="fileUpload" className="text-gray-700 font-medium">
              Select file to upload:
            </label>
            <input
              id="fileUpload"
              type="file"
              className="w-full px-4 py-4 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleImage}
            />
          </div>
          <TextField
            label='YouTube Video Link'
            name='youtubeLink'
            type="email"
            fullWidth
            placeholder='Enter YouTube video URL'
            value={articleData.youtubeLink}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel id="status-select">Select Category</InputLabel>
            <Select
              fullWidth
              name="condition"
              id='select-status'
              label="Select Category"
              value={articleData.condition}
              onChange={handleChange}
              labelId="status-select"
              inputProps={{ placeholder: "Select Category" }}
            >
              <MenuItem value="" disabled>Select Category</MenuItem>
              {categories.length > 0 &&
                categories.map((categoryName) => (
                  <MenuItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">
              Short Description:
            </label>
            <Editor
              editorState={articleData.shortDescription}
              toolbarClassName='toolbar'
              editorClassName='editor'
              onEditorStateChange={(editorState) => handleEditorChange('shortDescription', editorState)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">
              Long Description:
            </label>
            <Editor
              editorState={articleData.longDescription}
              toolbarClassName='toolbar'
              editorClassName='editor'
              onEditorStateChange={(editorState) => handleEditorChange('longDescription', editorState)}
            />
          </div>
          <FormControl>
            <InputLabel id='plan-select'>Select Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              name='status'
              value={articleData.status}
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
  );
};

export default MyArticles;
