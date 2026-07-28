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
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL.');
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white font-sans selection:bg-emerald-500/30">
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center mb-16 space-y-5">
          {/* Open Source Badge */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <a
              href="https://github.com/MichaelSpeaksTruth/GraphExtractor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              Open Source · MIT License
            </a>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              Free to Use
            </span>
          </div>

          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-1 border border-emerald-500/20 backdrop-blur-xl">
            <ImageIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-amber-400">
            Graph Extractor AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Instantly extract high-quality charts, graphs, and figures from your research papers — no AI hallucination, no cloud lock-in, fully open source.
          </p>
        </header>

        {/* Upload Section */}
        <section className="mb-16">
          <div 
            className={`relative group overflow-hidden rounded-3xl transition-all duration-300 ease-out border-2 border-dashed ${
              isDragging 
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
                : 'border-gray-700 bg-gray-900/60 hover:bg-gray-900/80 hover:border-gray-600'
            } backdrop-blur-sm`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            {/* Subtle shimmer overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
              
              {file ? (
                <div className="space-y-6 z-10 w-full max-w-md">
                  <div className="flex items-center justify-center p-4 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
                    <FileType className="w-10 h-10 text-amber-400 mr-4" />
                    <div className="text-left flex-1 truncate">
                      <p className="font-semibold text-gray-100 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setResults(null); }}
                      className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                    disabled={isUploading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  <div className="w-20 h-20 mx-auto bg-gray-800/60 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-xl font-medium text-gray-200">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-gray-500">
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
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-400 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Results Gallery */}
        {results && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold flex items-center text-gray-100">
                <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                Extraction Complete
              </h2>
              <span className="px-4 py-1.5 bg-amber-500/10 text-amber-300 rounded-full text-sm font-medium border border-amber-500/20">
                {results.total_images} Figures Found
              </span>
            </div>
            
            {results.images.length === 0 ? (
              <div className="text-center p-12 bg-gray-900/40 rounded-3xl border border-gray-800/60">
                <p className="text-gray-400 text-lg">No embedded images found in this document.</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {results.images.map((img: any, idx: number) => (
                  <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-gray-900/50 border border-gray-800/60 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    
                    <img 
                      src={img.data} 
                      alt={`Extracted from Page ${img.page}`}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out bg-white"
                      loading="lazy"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-between items-center">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-medium text-gray-300">
                        Page {img.page}
                      </span>
                      
                      <a 
                        href={img.data}
                        download={`figure_page_${img.page}_${img.index}.${img.ext}`}
                        className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-colors shadow-lg"
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

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-gray-800/60 text-center text-gray-600 text-sm space-y-2">
          <p>
            <span className="text-gray-500">Graph Extractor AI</span> — Open source under the{' '}
            <a
              href="https://github.com/MichaelSpeaksTruth/GraphExtractor/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2 transition-colors"
            >
              MIT License
            </a>
            . Free to use, fork, and modify.
          </p>
          <p className="text-gray-700">No data is stored. All processing happens in-memory.</p>
        </footer>
      </main>
    </div>
  );
}
