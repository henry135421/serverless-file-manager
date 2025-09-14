Serverless File Manager
Cloud Computing Project - RAF Master Studies
Overview
A serverless file management application built with modern cloud services. Upload, view, download, and delete files without managing servers.
Features

File upload/download/delete operations
Automatic cloud storage routing based on file size
Dual mode: Local (localStorage) and API (serverless)
Real-time file listing with metadata

Architecture

Frontend: Static HTML/JS hosted on Netlify CDN
Backend: Netlify Functions (serverless)
Database: Supabase (PostgreSQL)
Storage: Cloudinary for large files

Technologies

Netlify Functions (FaaS)
Supabase (DBaaS)
Cloudinary (Storage)
HTML/CSS/JavaScript

API Endpoints

POST /upload - Upload file
GET /list-files - Get all files
GET /download - Download file
DELETE /delete - Delete file

Usage

Open application in browser
Switch between Local/API mode
Upload files via drag & drop or file picker
Manage files through the interface
