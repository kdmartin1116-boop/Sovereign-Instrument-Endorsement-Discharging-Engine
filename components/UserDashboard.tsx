import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const UserDashboard: React.FC = () => {
  const { user, documents, deleteDocument, updateDocument, logout } = useUser();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<{ id: string; title: string; content: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return null;
  }

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (doc: any) => {
    setEditingDocument({
      id: doc.id,
      title: doc.title,
      content: doc.content
    });
  };

  const handleSaveEdit = () => {
    if (editingDocument) {
      updateDocument(editingDocument.id, editingDocument.title, editingDocument.content);
      setEditingDocument(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'analysis': return '📊';
      case 'affidavit': return '📋';
      case 'template': return '📄';
      case 'workflow': return '⚙️';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportDocument = (doc: any) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-xl shadow-lg space-y-6">
      {/* User Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Welcome back, {user.name}!</h3>
          <p className="text-slate-600">Manage your sovereign documents and legal workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-slate-600">
            <p>{documents.length} documents saved</p>
            <p>Member since {formatDate(user.createdAt)}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-sm text-slate-600">
          {filteredDocuments.length} of {documents.length} documents
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                  <div>
                    <h4 className="font-semibold text-sm truncate max-w-32">{doc.title}</h4>
                    <p className="text-xs text-slate-500 capitalize">{doc.type}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-blue-600 hover:text-blue-800 text-xs p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => exportDocument(doc)}
                    className="text-green-600 hover:text-green-800 text-xs p-1"
                    title="Download"
                  >
                    💾
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-600 hover:text-red-800 text-xs p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 mb-2">
                Created: {formatDate(doc.createdAt)}
              </p>
              
              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded max-h-20 overflow-hidden">
                {doc.content.substring(0, 150)}...
              </div>
              
              <button
                onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                {selectedDocument === doc.id ? 'Hide' : 'View Full'}
              </button>
              
              {selectedDocument === doc.id && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <pre className="text-xs bg-slate-50 p-3 rounded border overflow-auto max-h-40 whitespace-pre-wrap">
                    {doc.content}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(doc.content)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h4 className="text-lg font-semibold text-slate-600 mb-2">No documents yet</h4>
          <p className="text-slate-500">
            {searchTerm 
              ? 'No documents match your search criteria.'
              : 'Start creating documents using the AI tools above to see them here.'
            }
          </p>
        </div>
      )}

      {/* Edit Document Modal */}
      {editingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold">Edit Document</h3>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-96">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingDocument.title}
                  onChange={(e) => setEditingDocument({...editingDocument, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  value={editingDocument.content}
                  onChange={(e) => setEditingDocument({...editingDocument, content: e.target.value})}
                  className="w-full h-64 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;