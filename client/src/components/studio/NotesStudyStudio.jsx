import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiSparkles, HiAcademicCap, HiDocumentText, HiArrowRight,
  HiArrowPath, HiDocumentArrowUp, HiCheckBadge, HiRectangleStack
} from 'react-icons/hi2';
import { createStudySet, uploadPdfFile } from '../../api/studyApi';
import FlashcardList from '../FlashcardList';
import Quiz from '../Quiz';

export default function NotesStudyStudio() {
  const [inputMode, setInputMode] = useState('pdf'); // 'pdf' | 'text'
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [studySet, setStudySet] = useState(null);
  const [error, setError] = useState(null);
  const [activeOutputTab, setActiveOutputTab] = useState('flashcards');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please choose a smaller PDF.");
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleGenerateFromText = async () => {
    if (notes.trim().length < 15) {
      setError("Please paste at least 15 characters of study notes.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await createStudySet(notes);
      setStudySet(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate study set. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromPdf = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await uploadPdfFile(selectedFile);
      setStudySet(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to process PDF file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-studio-wrapper card-surface">
      <div className="studio-header">
        <span className="badge-pill"><HiSparkles /> MULTI-FORMAT STUDY INGESTION</span>
        <h2>Ingest PDFs or Lecture Notes into 3D Flashcards & Quizzes</h2>
        <p className="subtitle">Upload PDF textbooks (up to 10MB) or paste study notes to extract structured active recall decks.</p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="studio-tabs">
        <button
          className={`studio-tab-btn ${inputMode === 'pdf' ? 'active' : ''}`}
          onClick={() => setInputMode('pdf')}
        >
          <HiDocumentArrowUp /> Upload PDF Document
        </button>
        <button
          className={`studio-tab-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => setInputMode('text')}
        >
          <HiDocumentText /> Paste Raw Notes / Text
        </button>
      </div>

      {/* Input Mode 1: PDF Document Upload */}
      {inputMode === 'pdf' && (
        <div className="pdf-upload-dropzone card-surface">
          <input
            type="file"
            id="pdf-input-file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <label htmlFor="pdf-input-file" className="dropzone-label">
            <HiDocumentArrowUp className="dropzone-icon" />
            <div className="dropzone-text">
              <strong>{selectedFile ? selectedFile.name : 'Click to Browse or Drag & Drop PDF'}</strong>
              <small>{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB PDF Document` : 'Supports PDF documents up to 10MB'}</small>
            </div>
          </label>

          {error && <p className="error-msg text-center">{error}</p>}

          <div className="dropzone-actions">
            <button
              className="btn-primary"
              onClick={handleGenerateFromPdf}
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <><HiArrowPath className="spin-icon" /> Parsing PDF & Generating Decks...</>
              ) : (
                <><HiAcademicCap /> Ingest PDF & Generate Decks <HiArrowRight /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Input Mode 2: Raw Text Ingestion */}
      {inputMode === 'text' && (
        <div className="notes-input-block">
          <div className="input-label-row">
            <span><HiDocumentText /> Source Study Material</span>
            <small>{notes.length} / 18,000 chars</small>
          </div>
          <textarea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste lecture notes, architectural specifications, or key concepts here... (min 15 characters)"
          />

          {error && <p className="error-msg">{error}</p>}

          <div className="input-actions-row">
            <button
              className="btn-primary"
              onClick={handleGenerateFromText}
              disabled={loading || notes.trim().length < 15}
            >
              {loading ? (
                <><HiArrowPath className="spin-icon" /> Processing Text...</>
              ) : (
                <><HiAcademicCap /> Generate Active Recall Deck <HiArrowRight /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Generated Study Output Deck */}
      {studySet && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="generated-deck-section">
          <div className="deck-summary-box">
            <div className="summary-text-wrap">
              <strong>INGESTION SUMMARY ({studySet.fileName || 'Processed Content'}):</strong>
              <p>{studySet.summary}</p>
            </div>
            <span className="difficulty-tag font-mono">Difficulty: {studySet.difficulty || 'Intermediate'}</span>
          </div>

          <div className="studio-tabs">
            <button
              className={`studio-tab-btn ${activeOutputTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveOutputTab('flashcards')}
            >
              <HiRectangleStack /> Active Recall Flashcards ({(studySet.flashcards || []).length})
            </button>
            <button
              className={`studio-tab-btn ${activeOutputTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveOutputTab('quiz')}
            >
              <HiCheckBadge /> Knowledge Quiz ({(studySet.quiz || []).length})
            </button>
          </div>

          <div className="output-content-panel">
            {activeOutputTab === 'flashcards' ? (
              <FlashcardList cards={studySet.flashcards || []} />
            ) : (
              <Quiz quiz={studySet.quiz || []} />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
