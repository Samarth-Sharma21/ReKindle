import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import catImage from '../assets/cat.jpg';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const PhotoUploader = ({ onPhotoSelected, defaultImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(defaultImage ? true : null);
  const [previewUrl, setPreviewUrl] = useState(defaultImage || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // If a default image is provided, use it
    if (defaultImage) {
      setPreviewUrl(defaultImage);
      setSelectedFile(true);
    }
  }, [defaultImage]);

  // Don't set any default image
  useEffect(() => {
    // Only use the default image if provided by parent component
    if (defaultImage) {
      setPreviewUrl(defaultImage);
      setSelectedFile(true);
    }
  }, [defaultImage]);

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  };

  // Handle file selection via button
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  // Process the selected file
  const processFile = (file) => {
    setIsUploading(true);
    setSelectedFile(file);

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      if (onPhotoSelected) {
        onPhotoSelected(file);
      }
    }, 1000);
  };

  // Clear the selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onPhotoSelected(file);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
      onClick={handleClick}>
      {defaultImage ? (
        <img
          src={defaultImage}
          alt='Memory preview'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <>
          <AddPhotoAlternateIcon
            sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
          />
          <Typography variant='body1' color='textSecondary'>
            Click to upload a photo
          </Typography>
          <Typography variant='caption' color='textSecondary'>
            Supports: JPG, PNG, GIF
          </Typography>
        </>
      )}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default PhotoUploader;
