import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'credit' | 'commercial' | 'notice';
  content: string;
}

const templates: Template[] = [
  {
    id: 'credit-validation',
    name: 'Credit Validation Letter',
    description: 'Demand verification of credit report entries under FCRA',
    category: 'credit',
    content: `NOTICE OF DISPUTE AND DEMAND FOR VERIFICATION

To: [Creditor/Collection Agency Name]
[Address]

RE: Account Number: [Account Number]
    Consumer: [Your Name]

Dear Sir/Madam,

I am writing to dispute information that your company has furnished to credit reporting agencies regarding the above-referenced account. Under the Fair Credit Reporting Act (FCRA) 15 U.S.C. §1681i, I am requesting verification of this debt.

DISPUTED ITEMS:
1. [Specify each disputed item]
2. [Include dates, amounts, and specific inaccuracies]

LEGAL DEMANDS:
Pursuant to FCRA Section 611, you are required to investigate and provide verification within 30 days. This verification must include:
- Original signed contract or agreement
- Complete payment history
- Proof of your authority to collect this debt
- Documentation of the debt's validity

NOTICE: Failure to provide proper verification will require removal of this information from my credit reports immediately.

All rights reserved. No admission of liability.

_________________________
[Your Signature]
[Your Printed Name]
[Date]`
  },
  {
    id: 'bill-of-exchange',
    name: 'Bill of Exchange Template',
    description: 'UCC-compliant bill of exchange for debt discharge',
    category: 'commercial',
    content: `BILL OF EXCHANGE

No.: [Unique Number]                    Amount: $[Amount]
Date: [Date]

TO: [Creditor/Payee Name]
[Address]

AT SIGHT of this BILL OF EXCHANGE, pay to the order of [Your Name] the sum of [Amount in words] DOLLARS ($[Amount]) for value received.

This instrument is presented under UCC Article 3 as a negotiable instrument for the discharge of the debt referenced in your correspondence dated [Date] regarding account [Account Number].

ENDORSEMENT: Without recourse, per UCC 3-415(b)

By: _________________________
    [Your Signature]
    [Your Name], Authorized Representative
    
State of [State]
County of [County]

The above signature was acknowledged before me this _____ day of ________, 20__.

_________________________
Notary Public

ACCEPTANCE: By negotiating or depositing this instrument, you acknowledge full satisfaction and discharge of the referenced obligation.`
  },
  {
    id: 'cease-desist',
    name: 'Cease and Desist Notice',
    description: 'Stop collection activities under FDCPA',
    category: 'notice',
    content: `CEASE AND DESIST NOTICE

To: [Collection Agency Name]
[Address]

RE: Account: [Account Number]
    Consumer: [Your Name]

This letter serves as formal notice under the Fair Debt Collection Practices Act (FDCPA) 15 U.S.C. §1692c(c) to CEASE AND DESIST all collection activities regarding the above-referenced account.

LEGAL NOTICE:
1. You are hereby directed to cease all communication with me regarding this alleged debt
2. Any future contact must be in writing and sent via U.S. Mail
3. Phone calls, emails, and third-party contact are specifically prohibited
4. This notice does not constitute acknowledgment of the debt's validity

VIOLATIONS:
Any continued collection activities after receipt of this notice will constitute violations of federal law and may result in legal action for damages up to $1,000 plus attorney fees under FDCPA Section 813.

SOVEREIGN NOTICE:
I am exercising my rights under common law and the Constitution. All rights reserved without prejudice.

_________________________
[Your Signature]
[Your Printed Name]
[Date]

CERTIFICATE OF SERVICE:
I hereby certify that a true and correct copy of the above was sent via certified mail, return receipt requested, on [Date].`
  }
];

const DocumentTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customizedContent, setCustomizedContent] = useState<string>('');

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCustomizedContent(template.content);
  };

  const copyToClipboard = async () => {
    if (customizedContent) {
      try {
        await navigator.clipboard.writeText(customizedContent);
        alert('Template copied to clipboard!');
      } catch (err) {
        alert('Failed to copy to clipboard. Please manually select and copy the text.');
      }
    }
  };

  const downloadAsFile = () => {
    if (customizedContent && selectedTemplate) {
      const blob = new Blob([customizedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'credit': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'notice': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Legal Document Templates</h3>
        <p className="text-slate-600 mb-6">
          Professional templates for sovereign commercial activities. Customize with your information before use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate?.id === template.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => selectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{template.name}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                {template.category}
              </span>
            </div>
            <p className="text-sm text-slate-600">{template.description}</p>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">{selectedTemplate.name}</h4>
            <div className="space-x-2">
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={downloadAsFile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>
          
          <textarea
            value={customizedContent}
            onChange={(e) => setCustomizedContent(e.target.value)}
            className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Customize your template here..."
          />
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> These templates are for educational purposes. Replace all [bracketed] placeholders 
              with your actual information. Consider consulting with a legal professional familiar with sovereign law 
              before using these documents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTemplates;