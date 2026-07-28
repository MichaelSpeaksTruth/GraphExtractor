'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, Download, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF document.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF document.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use environment variable for the API URL, fallback to localhost for development
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to extract graphs');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white font-sans selection:bg-indigo-500/30">
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 backdrop-blur-xl">
            <ImageIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Graph Extractor AI
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Instantly extract high-quality charts, graphs, and figures from your research papers with zero hallucination.
          </p>
        </header>

        {/* Upload Section */}
        <section className="mb-16">
          <div 
            className={`relative group overflow-hidden rounded-3xl transition-all duration-300 ease-out border-2 border-dashed ${
              isDragging 
                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' 
                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 hover:border-slate-600'
            } backdrop-blur-sm`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
              
              {file ? (
                <div className="space-y-6 z-10 w-full max-w-md">
                  <div className="flex items-center justify-center p-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
                    <FileType className="w-10 h-10 text-indigo-400 mr-4" />
                    <div className="text-left flex-1 truncate">
                      <p className="font-semibold text-slate-200 truncate">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setResults(null); }}
                      className="ml-4 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                    disabled={isUploading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-5 h-5 mr-2" />
                        Extract Graphs
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 z-10 cursor-pointer">
                  <div className="w-20 h-20 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-xl font-medium text-slate-200">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-slate-400">
                    PDF files up to 20MB are supported
                  </p>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center text-rose-400 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Results Gallery */}
        {results && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold flex items-center text-slate-100">
                <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                Extraction Complete
              </h2>
              <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
                {results.total_images} Figures Found
              </span>
            </div>
            
            {results.images.length === 0 ? (
              <div className="text-center p-12 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                <p className="text-slate-400 text-lg">No embedded images found in this document.</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {results.images.map((img: any, idx: number) => (
                  <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    
                    <img 
                      src={img.data} 
                      alt={`Extracted from Page ${img.page}`}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out bg-white"
                      loading="lazy"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-between items-center">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-slate-300">
                        Page {img.page}
                      </span>
                      
                      <a 
                        href={img.data}
                        download={`figure_page_${img.page}_${img.index}.${img.ext}`}
                        className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-full text-white transition-colors shadow-lg"
                        title="Download Image"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
