
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useUser } from '../context/UserContext';

const UploadIcon: React.FC = () => (
    <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="animate-ping absolute top-0 left-0 rounded-full h-12 w-12 border-2 border-blue-400 opacity-75"></div>
        </div>
    </div>
);

const CreditDispute: React.FC = () => {
  const { user, saveDocument } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [affidavit, setAffidavit] = useState<string>('');
  const [isGeneratingAffidavit, setIsGeneratingAffidavit] = useState<boolean>(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const allowedTypes = ['text/plain', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
          setError('Unsupported file type. Please upload a .txt or .pdf file only.');
          setFile(null);
          setAnalysis('');
          setAffidavit('');
          return;
      }

      // Validate file size
      if (selectedFile.size > maxSize) {
          setError('File too large. Please upload a file smaller than 5MB.');
          setFile(null);
          setAnalysis('');
          setAffidavit('');
          return;
      }

      // Validate file name
      if (selectedFile.name.length > 100) {
          setError('File name too long. Please rename your file to be under 100 characters.');
          setFile(null);
          setAnalysis('');
          setAffidavit('');
          return;
      }

      setFile(selectedFile);
      setAnalysis('');
      setAffidavit('');
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setAnalysis('');
    setAffidavit('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
            throw new Error("File is empty or could not be read.");
        }

        const [header, base64Data] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1];

        if (!mimeType || !base64Data) {
            throw new Error("Invalid file format.");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `You are an expert sovereign law analyst specializing in UCC Articles 3, 4, and 9, FCRA compliance, and commercial redemption processes. 

ANALYZE this credit report with the following sovereign perspective:

## Legal Framework Analysis
- **UCC Article 3**: Negotiable instruments and lawful tender principles
- **FCRA Sections 604-621**: Verification requirements and dispute procedures  
- **15 USC 1692**: Fair Debt Collection Practices
- **Sovereign Status**: Rights under common law and constitutional protections

## Required Analysis Points:
1. **Verification Deficiencies**: Items lacking proper validation under FCRA §611
2. **UCC Violations**: Debts that may be dischargeable through proper endorsement
3. **Statutory Violations**: FDCPA or state law infractions
4. **Sovereign Remedies**: Constitutional rights and common law protections
5. **Commercial Defects**: Missing signatures, improper assignments, lack of consideration

## For Each Disputed Item, Provide:
- **Legal Basis**: Specific statute or common law principle
- **Sovereign Strategy**: How to approach from position of sovereignty  
- **Action Steps**: Concrete steps for lawful remedy
- **Documentation**: What evidence to demand from creditors

Format as structured markdown with clear sections and actionable intelligence for someone exercising their sovereign rights within lawful commercial processes.`;

        const filePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: { parts: [{text: prompt}, filePart] },
        });

        setAnalysis(response.text);
        setSuccess("Credit report analysis completed successfully! Review the findings below.");

        // Auto-save analysis for logged-in users
        if (user && file) {
          saveDocument(
            `Credit Analysis - ${file.name} - ${new Date().toLocaleDateString()}`,
            'analysis',
            response.text
          );
        }

      } catch (err) {
        console.error("Analysis error:", err);
        setError("Failed to analyze the credit report. The file may be in an unsupported format or there was an issue with the AI service. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Failed to read the file. Please ensure it is a valid file.");
        setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateAffidavit = async () => {
    if (!analysis || !file) return;

    setIsGeneratingAffidavit(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) {
                throw new Error("File could not be re-read for affidavit generation.");
            }
            const [header, base64Data] = dataUrl.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1];

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Draft a comprehensive AFFIDAVIT OF TRUTH for credit dispute based on sovereign law principles and the provided analysis.

## Required Legal Structure:

### HEADER
- Title: "AFFIDAVIT OF TRUTH AND DEMAND FOR VERIFICATION"
- Jurisdiction statement (constitutional)
- Sovereign capacity declaration

### AFFIANT IDENTIFICATION  
- Use placeholders: [Your Full Name], [Your Address], [State/County]
- Statement of competency and first-hand knowledge
- Declaration of sovereign capacity and rights reserved

### FACTUAL ALLEGATIONS (Based on Analysis)
For each disputed item, structure as:
- **ITEM [N]**: [Creditor Name - Account]
- **FACTS**: Specific deficiencies found
- **LEGAL BASIS**: UCC/FCRA/Constitutional violation  
- **DEMAND**: Specific remedy requested

### VERIFICATION DEMANDS
- Proper UCC-compliant documentation
- Original wet-ink signature instruments  
- Chain of title/assignment documentation
- Proof of consideration and standing

### CONSTITUTIONAL PROTECTIONS
- Due process requirements (5th/14th Amendments)
- Right to face accuser and examine evidence
- Presumption of innocence until proven otherwise
- Protection against bills of attainder

### SOVEREIGN DECLARATIONS
- Acting in sovereign capacity, not as debtor
- Rights reserved under common law
- No admission of liability or corporate personhood
- All rights reserved without prejudice

### CLOSING
- Notarization requirements
- Verification under penalty of perjury
- Time limits for response (30 days)
- Statement of remedy if no proper response

Create a professional, legally-sound document ready for notarization and service. Use formal legal language appropriate for court filing if necessary.`;

            const filePart = {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            };
            const analysisPart = {
                text: `PREVIOUS ANALYSIS:\n---\n${analysis}`
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: { parts: [{text: prompt}, analysisPart, filePart] },
            });

            setAffidavit(response.text);

            // Auto-save affidavit for logged-in users
            if (user && file) {
              saveDocument(
                `Dispute Affidavit - ${file.name} - ${new Date().toLocaleDateString()}`,
                'affidavit',
                response.text
              );
            }
        } catch (err) {
            console.error("Affidavit generation error:", err);
            setError("Failed to generate the affidavit. Please try again.");
        } finally {
            setIsGeneratingAffidavit(false);
        }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
      if (affidavit) {
          try {
              await navigator.clipboard.writeText(affidavit);
              setSuccess("Affidavit copied to clipboard! You can now paste it into your document editor.");
              setError(null);
          } catch (err) {
              setError("Failed to copy to clipboard. Please manually select and copy the text.");
          }
      }
  }


  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 space-y-6">
      <div>
        <label htmlFor="file-upload" className="cursor-pointer group">
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 group-hover:scale-[1.01]">
            <UploadIcon />
            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-slate-500">Upload your credit report (.txt or .pdf)</p>
          </div>
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf" />
      </div>

      {file && (
        <div className="text-center p-3 bg-slate-100 border border-slate-200 rounded-lg">
           <p className="text-sm text-slate-800 font-semibold">{file.name}</p>
           <p className="text-xs text-slate-500">
               Type: {file.type} | Size: {(file.size / 1024).toFixed(2)} KB
           </p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="bg-gradient-to-r from-slate-700 to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-slate-800 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Credit Report'}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {analysis && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg prose prose-slate max-w-none">
           <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
           <div style={{ whiteSpace: 'pre-wrap' }}>{analysis}</div>
           
           <div className="text-center mt-6">
                <button
                    onClick={handleGenerateAffidavit}
                    disabled={isGeneratingAffidavit}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                >
                    {isGeneratingAffidavit ? 'Generating...' : 'Generate Dispute Affidavit'}
                </button>
           </div>
        </div>
      )}

      {isGeneratingAffidavit && <LoadingSpinner />}

      {affidavit && (
          <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-4">
              <h3 className="text-xl font-bold">Generated Dispute Affidavit</h3>
              <textarea
                readOnly
                className="w-full h-96 p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-md"
                value={affidavit}
              />
              <div className="text-center">
                <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Copy to Clipboard
                </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CreditDispute;
