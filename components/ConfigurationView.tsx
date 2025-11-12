
import React, { useState } from 'react';
import { useFramework } from '../hooks/useFramework';
import { getAiSuggestions } from '../services/geminiService';
import { Plus, Trash2, Edit, Save, X, Wand2, Loader } from 'lucide-react';
import type { Dimension } from '../types';

const ConfigurationView: React.FC = () => {
  const { dimensions, addDimension, updateDimension, deleteDimension, addElement, updateElement, deleteElement } = useFramework();
  const [newDimensionName, setNewDimensionName] = useState('');
  
  const handleAddDimension = () => {
    if (newDimensionName.trim()) {
      addDimension(newDimensionName.trim());
      setNewDimensionName('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Configure Framework</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Dimension</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newDimensionName}
            onChange={(e) => setNewDimensionName(e.target.value)}
            placeholder="e.g., Economic Factors"
            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAddDimension}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Existing Dimensions</h2>
        {dimensions.map(dim => (
          <DimensionEditor key={dim.id} dimension={dim} onUpdate={updateDimension} onDelete={deleteDimension} onElementAdd={addElement} onElementUpdate={updateElement} onElementDelete={deleteElement}/>
        ))}
      </div>
    </div>
  );
};

interface DimensionEditorProps {
    dimension: Dimension;
    onUpdate: (id: string, name: string, weight: number) => void;
    onDelete: (id: string) => void;
    onElementAdd: (dimensionId: string, name: string) => void;
    onElementUpdate: (dimensionId: string, elementId: string, name: string, weight: number) => void;
    onElementDelete: (dimensionId: string, elementId: string) => void;
}

const DimensionEditor: React.FC<DimensionEditorProps> = ({ dimension, onUpdate, onDelete, onElementAdd, onElementUpdate, onElementDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(dimension.name);
    const [editedWeight, setEditedWeight] = useState(dimension.weight);
    const [newElementName, setNewElementName] = useState('');
    const [aiSuggestions, setAiSuggestions] = useState<{name: string, description: string}[]>([]);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    const handleUpdate = () => {
        onUpdate(dimension.id, editedName, editedWeight);
        setIsEditing(false);
    };

    const handleAddElement = () => {
        if (newElementName.trim()) {
            onElementAdd(dimension.id, newElementName.trim());
            setNewElementName('');
        }
    };
    
    const fetchAiSuggestions = async () => {
        setIsLoadingAi(true);
        setAiSuggestions([]);
        try {
            const suggestions = await getAiSuggestions(dimension.name, dimension.elements.map(e => e.name));
            setAiSuggestions(suggestions);
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setIsLoadingAi(false);
        }
    };

    return (
        <details className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 open:shadow-xl">
            <summary className="cursor-pointer flex justify-between items-center text-lg font-medium text-gray-800 dark:text-white">
                {isEditing ? (
                    <div className="flex items-center w-full">
                        <input value={editedName} onChange={e => setEditedName(e.target.value)} className="text-lg font-medium p-1 border rounded dark:bg-gray-700 dark:border-gray-600 mr-2 flex-grow" />
                        <input type="number" value={Math.round(editedWeight)} onChange={e => setEditedWeight(Number(e.target.value))} className="w-20 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 mr-4" />
                        <button onClick={handleUpdate} className="p-2 text-green-500 hover:text-green-700"><Save className="w-5 h-5"/></button>
                        <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:text-gray-700"><X className="w-5 h-5"/></button>
                    </div>
                ) : (
                    <div className="flex items-center">
                       {dimension.name} <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">(Weight: {Math.round(dimension.weight)}%)</span>
                    </div>
                )}
                 {!isEditing && (
                    <div>
                        <button onClick={(e) => { e.preventDefault(); setIsEditing(true); }} className="p-2 text-blue-500 hover:text-blue-700"><Edit className="w-5 h-5"/></button>
                        <button onClick={(e) => { e.preventDefault(); onDelete(dimension.id); }} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
                    </div>
                 )}
            </summary>
            <div className="mt-4 pt-4 border-t dark:border-gray-700 space-y-4">
                 {dimension.elements.map(el => (
                    <ElementEditor key={el.id} dimensionId={dimension.id} element={el} onUpdate={onElementUpdate} onDelete={onElementDelete} />
                 ))}
                 <div className="flex items-center space-x-2 pt-2">
                     <input value={newElementName} onChange={e => setNewElementName(e.target.value)} placeholder="New element name" className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                     <button onClick={handleAddElement} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"><Plus className="w-4 h-4 mr-1" /> Add Element</button>
                 </div>
                 <div className="pt-2">
                     <button onClick={fetchAiSuggestions} disabled={isLoadingAi} className="flex items-center text-sm px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoadingAi ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        {isLoadingAi ? 'Getting Suggestions...' : 'Suggest Elements with AI'}
                     </button>
                     {aiSuggestions.length > 0 && (
                         <div className="mt-4 space-y-2 border-l-4 border-purple-400 pl-4">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">AI Suggestions:</h4>
                            {aiSuggestions.map((s, i) => (
                                <div key={i} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <div className="flex justify-between items-center">
                                      <p className="font-medium text-gray-800 dark:text-gray-100">{s.name}</p>
                                      <button onClick={() => { onElementAdd(dimension.id, s.name); setAiSuggestions(prev => prev.filter(p => p.name !== s.name))}} className="text-xs text-white bg-green-500 hover:bg-green-600 rounded-full px-2 py-1">Add</button>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
                                </div>
                            ))}
                         </div>
                     )}
                 </div>
            </div>
        </details>
    );
};

const ElementEditor: React.FC<{dimensionId: string; element: any; onUpdate: Function; onDelete: Function}> = ({ dimensionId, element, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(element.name);
    const [editedWeight, setEditedWeight] = useState(element.weight);

    const handleUpdate = () => {
        onUpdate(dimensionId, element.id, editedName, editedWeight);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            {isEditing ? (
                <>
                    <input value={editedName} onChange={e => setEditedName(e.target.value)} className="p-1 border rounded dark:bg-gray-600 dark:border-gray-500 flex-grow mr-2" />
                    <input type="number" value={Math.round(editedWeight)} onChange={e => setEditedWeight(Number(e.target.value))} className="w-20 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 mr-2" />
                    <button onClick={handleUpdate} className="p-2 text-green-500 hover:text-green-700"><Save className="w-4 h-4"/></button>
                    <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:text-gray-700"><X className="w-4 h-4"/></button>
                </>
            ) : (
                <>
                    <span className="text-gray-700 dark:text-gray-300">{element.name} <span className="text-xs text-gray-500">(Weight: {Math.round(element.weight)}%)</span></span>
                    <div>
                        <button onClick={() => setIsEditing(true)} className="p-2 text-blue-500 hover:text-blue-700"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => onDelete(dimensionId, element.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfigurationView;
