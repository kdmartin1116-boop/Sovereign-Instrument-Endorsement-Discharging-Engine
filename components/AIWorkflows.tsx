import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useUser } from '../context/UserContext';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: string;
  documents?: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  category: 'credit-dispute' | 'debt-discharge' | 'commercial-remedy';
}

const predefinedWorkflows: Workflow[] = [
  {
    id: 'comprehensive-credit-dispute',
    name: 'Comprehensive Credit Dispute Process',
    description: 'Complete 90-day credit dispute process with multiple validation rounds',
    category: 'credit-dispute',
    steps: [
      {
        id: 'initial-analysis',
        title: 'Initial Credit Report Analysis',
        description: 'AI analyzes credit report for disputes and UCC violations',
        status: 'pending'
      },
      {
        id: 'validation-letters',
        title: 'Generate Validation Letters',
        description: 'Create customized validation letters for each creditor',
        status: 'pending'
      },
      {
        id: 'affidavit-creation',
        title: 'Draft Legal Affidavits',
        description: 'Generate sworn affidavits of truth for disputed items',
        status: 'pending'
      },
      {
        id: 'follow-up-strategy',
        title: 'Follow-up Strategy',
        description: 'Plan 30-day follow-up actions and escalation procedures',
        status: 'pending'
      },
      {
        id: 'final-documentation',
        title: 'Final Legal Documentation',
        description: 'Prepare court-ready documentation if needed',
        status: 'pending'
      }
    ]
  },
  {
    id: 'bill-of-exchange-discharge',
    name: 'Bill of Exchange Debt Discharge',
    description: 'UCC Article 3 compliant debt discharge using negotiable instruments',
    category: 'debt-discharge',
    steps: [
      {
        id: 'debt-analysis',
        title: 'Debt Validation Analysis',
        description: 'Analyze debt documentation for UCC compliance defects',
        status: 'pending'
      },
      {
        id: 'instrument-creation',
        title: 'Create Bill of Exchange',
        description: 'Draft UCC-compliant negotiable instrument for discharge',
        status: 'pending'
      },
      {
        id: 'endorsement-strategy',
        title: 'Endorsement Strategy',
        description: 'Determine optimal endorsement type and protective language',
        status: 'pending'
      },
      {
        id: 'tender-process',
        title: 'Tender Documentation',
        description: 'Prepare lawful tender offer with proper notice',
        status: 'pending'
      },
      {
        id: 'discharge-completion',
        title: 'Discharge Completion',
        description: 'Document discharge process and maintain records',
        status: 'pending'
      }
    ]
  },
  {
    id: 'commercial-lien-process',
    name: 'Commercial Lien Process',
    description: 'Establish commercial lien for UCC security interest',
    category: 'commercial-remedy',
    steps: [
      {
        id: 'lien-research',
        title: 'Legal Research & Preparation',
        description: 'Research applicable UCC provisions and jurisdiction requirements',
        status: 'pending'
      },
      {
        id: 'notice-preparation',
        title: 'Notice of Lien Preparation',
        description: 'Draft formal notice of intent to lien',
        status: 'pending'
      },
      {
        id: 'ucc-filing',
        title: 'UCC Filing Preparation',
        description: 'Prepare UCC-1 financing statement for filing',
        status: 'pending'
      },
      {
        id: 'perfection-process',
        title: 'Lien Perfection',
        description: 'Complete lien perfection through proper filing',
        status: 'pending'
      },
      {
        id: 'enforcement-docs',
        title: 'Enforcement Documentation',
        description: 'Prepare enforcement procedures and collection protocols',
        status: 'pending'
      }
    ]
  }
];

const AIWorkflows: React.FC = () => {
  const { user, saveDocument } = useUser();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [workflowData, setWorkflowData] = useState<any>({});

  const executeStep = async (stepIndex: number) => {
    if (!selectedWorkflow) return;

    setIsProcessing(true);
    setActiveStep(stepIndex);

    // Update step status to in-progress
    const updatedWorkflow = { ...selectedWorkflow };
    updatedWorkflow.steps[stepIndex].status = 'in-progress';
    setSelectedWorkflow(updatedWorkflow);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const step = selectedWorkflow.steps[stepIndex];
      
      let prompt = '';
      let context = JSON.stringify(workflowData, null, 2);

      // Generate step-specific prompts
      switch (step.id) {
        case 'initial-analysis':
          prompt = `As a sovereign law expert, perform comprehensive credit report analysis.

WORKFLOW CONTEXT: Beginning comprehensive credit dispute process
PREVIOUS DATA: ${context}

ANALYSIS REQUIREMENTS:
1. **UCC Article 3 Violations**: Identify negotiable instrument defects
2. **FCRA Section 611 Issues**: Verification requirement failures  
3. **Constitutional Violations**: Due process and equal protection issues
4. **Sovereign Remedies**: Available common law and constitutional protections
5. **Strategic Prioritization**: Rank disputes by likelihood of success

FORMAT: Structured analysis with specific legal citations and recommended actions.`;
          break;

        case 'validation-letters':
          prompt = `Generate professional validation letters based on analysis.

WORKFLOW CONTEXT: ${selectedWorkflow.name}
ANALYSIS RESULTS: ${context}

LETTER REQUIREMENTS:
- FCRA Section 611 compliant validation demands
- UCC Article 3 defect challenges where applicable
- Constitutional due process assertions
- Sovereign capacity declarations
- 30-day response deadlines
- Specific documentation demands

Generate 3-5 customized validation letters for the highest priority disputes.`;
          break;

        case 'affidavit-creation':
          prompt = `Draft comprehensive legal affidavits for disputed items.

WORKFLOW CONTEXT: ${selectedWorkflow.name}
PREVIOUS STEPS: ${context}

AFFIDAVIT REQUIREMENTS:
- Legal format suitable for court filing
- Sovereign capacity and constitutional rights assertions
- Specific factual allegations based on analysis
- UCC and FCRA legal basis citations
- Proper verification and notarization requirements
- Demand for specific remedies

Create 1-3 affidavits covering the most significant disputes.`;
          break;

        case 'debt-analysis':
          prompt = `Analyze debt documentation for UCC compliance defects.

WORKFLOW CONTEXT: ${selectedWorkflow.name}
INPUT DATA: ${context}

ANALYSIS FOCUS:
1. **Original Contract Review**: Signatures, consideration, meeting of minds
2. **Assignment Chain**: Proper UCC Article 9 assignments and notifications
3. **Standing Issues**: Current creditor's authority to collect
4. **Negotiable Instrument Defects**: UCC Article 3 compliance failures
5. **Statutory Violations**: FDCPA, FCRA, state law infractions

Provide detailed findings with specific UCC citations and recommended challenges.`;
          break;

        case 'instrument-creation':
          prompt = `Create UCC-compliant Bill of Exchange for debt discharge.

WORKFLOW CONTEXT: ${selectedWorkflow.name}
DEBT ANALYSIS: ${context}

BILL OF EXCHANGE REQUIREMENTS:
- UCC Article 3 compliance (Sections 3-104, 3-106)
- Proper negotiable instrument format
- Conditional or unconditional payment order
- Specific creditor information and amounts
- Protective endorsement language
- Sovereign capacity assertions

Draft complete bill of exchange ready for execution and tender.`;
          break;

        default:
          prompt = `Continue ${selectedWorkflow.name} workflow step: ${step.title}

CONTEXT: ${step.description}
PREVIOUS DATA: ${context}

Provide detailed guidance, documentation, and next steps for this phase of the legal process. Include specific actions, timelines, and required documentation.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });

      // Update step with results
      updatedWorkflow.steps[stepIndex].status = 'completed';
      updatedWorkflow.steps[stepIndex].result = response.text;
      setSelectedWorkflow(updatedWorkflow);

      // Store step results in workflow data
      setWorkflowData(prev => ({
        ...prev,
        [step.id]: response.text
      }));

      // Auto-save workflow step for logged-in users
      if (user) {
        saveDocument(
          `${selectedWorkflow.name} - ${step.title} - ${new Date().toLocaleDateString()}`,
          'workflow',
          response.text
        );
      }

    } catch (error) {
      console.error('Step execution error:', error);
      const updatedWorkflow = { ...selectedWorkflow };
      updatedWorkflow.steps[stepIndex].status = 'failed';
      setSelectedWorkflow(updatedWorkflow);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkflow = () => {
    if (selectedWorkflow) {
      const resetWorkflow = { ...selectedWorkflow };
      resetWorkflow.steps.forEach(step => {
        step.status = 'pending';
        step.result = undefined;
      });
      setSelectedWorkflow(resetWorkflow);
      setWorkflowData({});
      setActiveStep(0);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'credit-dispute': return 'bg-blue-100 text-blue-800';
      case 'debt-discharge': return 'bg-green-100 text-green-800';
      case 'commercial-remedy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Advanced AI Workflows</h3>
        <p className="text-slate-600 mb-6">
          Automated multi-step legal processes powered by AI. Each workflow guides you through complex procedures with intelligent document generation.
        </p>
      </div>

      {!selectedWorkflow ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {predefinedWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-6 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-lg">{workflow.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(workflow.category)}`}>
                  {workflow.category}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4">{workflow.description}</p>
              <div className="text-xs text-slate-500">
                {workflow.steps.length} steps • Estimated time: {workflow.steps.length * 15} minutes
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold">{selectedWorkflow.name}</h4>
              <p className="text-slate-600">{selectedWorkflow.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={resetWorkflow}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                Back to Workflows
              </button>
            </div>
          </div>

          {/* Workflow Progress */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="font-semibold mb-4">Workflow Progress</h5>
            <div className="space-y-3">
              {selectedWorkflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStepIcon(step.status)}</span>
                    <div>
                      <h6 className="font-medium">{step.title}</h6>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => executeStep(index)}
                    disabled={isProcessing || (index > 0 && selectedWorkflow.steps[index - 1].status !== 'completed')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {step.status === 'completed' ? 'Re-run' : 'Execute'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step Results */}
          {selectedWorkflow.steps.some(step => step.result) && (
            <div className="space-y-4">
              <h5 className="font-semibold">Step Results</h5>
              {selectedWorkflow.steps.map((step, index) => (
                step.result && (
                  <div key={step.id} className="bg-white border border-slate-200 rounded-lg p-4">
                    <h6 className="font-medium mb-2">{step.title}</h6>
                    <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded border overflow-auto max-h-96">
                      {step.result}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(step.result || '')}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Copy Result
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <p className="font-medium">Processing Step {activeStep + 1}</p>
                <p className="text-sm text-slate-600">AI is analyzing and generating documents...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkflows;