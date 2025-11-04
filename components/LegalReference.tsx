import React, { useState } from 'react';

interface Reference {
  id: string;
  title: string;
  citation: string;
  category: 'ucc' | 'constitution' | 'statute' | 'case-law';
  summary: string;
  fullText: string;
}

const references: Reference[] = [
  {
    id: 'ucc-3-104',
    title: 'Negotiable Instrument Definition',
    citation: 'UCC § 3-104',
    category: 'ucc',
    summary: 'Defines what constitutes a negotiable instrument under commercial law',
    fullText: `UCC § 3-104. Negotiable Instrument.

(a) Except as provided in subsections (c) and (d), "negotiable instrument" means an unconditional promise or order to pay a fixed amount of money, with or without interest or other charges described in the promise or order, if it:

(1) is payable to bearer or to order at the time it is issued or first comes into possession of a holder;
(2) is payable on demand or at a definite time; and
(3) does not state any other undertaking or instruction by the person promising or ordering payment to do any act in addition to the payment of money, but the promise or order may contain (i) an undertaking or power to give, maintain, or protect collateral to secure payment, (ii) an authorization or power to the holder to confess judgment or realize on or dispose of collateral, or (iii) a waiver of the benefit of any law intended for the advantage or protection of an obligor.`
  },
  {
    id: 'ucc-3-415',
    title: 'Obligation of Indorser',
    citation: 'UCC § 3-415',
    category: 'ucc',
    summary: 'Defines the obligations and liabilities of indorsers on negotiable instruments',
    fullText: `UCC § 3-415. Obligation of Indorser.

(a) Subject to subsections (b), (c), and (d) and to Section 3-419(d), if an instrument is dishonored, an indorser is obliged to pay the amount due on the instrument (i) according to the terms of the instrument at the time it was indorsed, or (ii) if the indorser indorsed an incomplete instrument, according to its terms when completed, to the extent stated in Sections 3-115 and 3-407.

(b) The obligation of an indorser stated in subsection (a) is owed to a person entitled to enforce the instrument or to a subsequent indorser who paid the instrument under this section.

Key Point: "Without recourse" indorsement under subsection (b) disclaims liability, protecting the indorser from obligation to pay if the instrument is dishonored.`
  },
  {
    id: 'fcra-611',
    title: 'Procedure in Case of Disputed Accuracy',
    citation: '15 USC § 1681i',
    category: 'statute',
    summary: 'Establishes consumer rights to dispute credit report information',
    fullText: `15 USC § 1681i - Procedure in case of disputed accuracy

(a) Reinvestigations of disputed information
(1) Reinvestigation required
(A) In general: Subject to subsection (f), if the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file...

(5) Treatment of inaccurate or unverifiable information: If, after any reinvestigation under paragraph (1) of any information disputed by a consumer, an item of information is found to be inaccurate or incomplete or cannot be verified, the consumer reporting agency shall—
(A) promptly delete that item of information from the consumer's file or modify that item of information, as appropriate, based on the results of the reinvestigation...`
  },
  {
    id: 'amendment-5',
    title: 'Due Process Clause',
    citation: '5th Amendment',
    category: 'constitution',
    summary: 'Constitutional protection against deprivation without due process',
    fullText: `Fifth Amendment to the U.S. Constitution (Due Process Clause):

"No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation."

Sovereign Application: The Due Process Clause requires that before any person can be deprived of life, liberty, or property, they must be given notice and an opportunity to be heard. In commercial disputes, this means creditors must provide proper verification and evidence before collection activities.`
  },
  {
    id: 'fdcpa-807',
    title: 'False or Misleading Representations',
    citation: '15 USC § 1692e',
    category: 'statute',
    summary: 'Prohibits false, deceptive, or misleading collection practices',
    fullText: `15 USC § 1692e - False or misleading representations

A debt collector may not use any false, deceptive, or misleading representation or means in connection with the collection of any debt. Without limiting the general application of the foregoing, the following conduct is a violation of this section:

(2) The false representation of—
(A) the character, amount, or legal status of any debt; or
(B) any services rendered or compensation which may be lawfully received by any debt collector for the collection of a debt.

(5) The threat to take any action that cannot legally be taken or that is not intended to be taken.

(8) Communicating or threatening to communicate to any person credit information which is known or which should be known to be false, including the failure to communicate that a disputed debt is disputed.

(11) The failure to disclose in the initial written communication with the consumer and, in addition, if the initial communication with the consumer is oral, in that initial oral communication, that the debt collector is attempting to collect a debt and that any information obtained will be used for that purpose...`
  }
];

const LegalReference: React.FC = () => {
  const [selectedRef, setSelectedRef] = useState<Reference | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReferences = references.filter(ref => 
    ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ucc': return 'bg-blue-100 text-blue-800';
      case 'constitution': return 'bg-red-100 text-red-800';
      case 'statute': return 'bg-green-100 text-green-800';
      case 'case-law': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ucc': return '⚖️';
      case 'constitution': return '🏛️';
      case 'statute': return '📜';
      case 'case-law': return '⚖️';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Legal Reference Library</h3>
        <p className="text-slate-600 mb-4">
          Quick reference to key legal authorities for sovereign commercial activities.
        </p>
        
        <input
          type="text"
          placeholder="Search references..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-700">Available References</h4>
          {filteredReferences.map((ref) => (
            <div
              key={ref.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRef?.id === ref.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedRef(ref)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(ref.category)}</span>
                  <div>
                    <h5 className="font-semibold text-sm">{ref.title}</h5>
                    <p className="text-xs text-slate-500">{ref.citation}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(ref.category)}`}>
                  {ref.category.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-600">{ref.summary}</p>
            </div>
          ))}
        </div>

        {selectedRef && (
          <div className="space-y-4">
            <div className="sticky top-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{selectedRef.title}</h4>
                    <p className="text-sm text-slate-500">{selectedRef.citation}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedRef.category)}`}>
                    {selectedRef.category.toUpperCase()}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded border overflow-auto max-h-96">
                    {selectedRef.fullText}
                  </pre>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedRef.fullText)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedRef.citation)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Copy Citation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These references are provided for educational purposes. Always verify current law 
          and consult with legal counsel familiar with sovereign principles when applying these authorities.
        </p>
      </div>
    </div>
  );
};

export default LegalReference;