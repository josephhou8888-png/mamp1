import React, { useState } from 'react';
import { TextInput, TextareaInput, Fieldset } from '../AdminFormComponents';

const KnowledgePanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const knowledgeSection = data.knowledgeSection || {};
    const tabs = knowledgeSection.tabs || [];
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    const handleAddTab = () => {
        const newTab = { category: 'New Category', articles: [] };
        onAddItem('knowledgeSection.tabs', newTab);
        setActiveTabIndex(tabs.length); // Switch to the new tab
    };
    
    const handleAddArticle = (tabIndex) => {
        const newArticle = { title: 'New Article', summary: '', fullContent: '' };
        onAddItem(`knowledgeSection.tabs.${tabIndex}.articles`, newArticle);
    };

    return (
        <div className="space-y-6">
            <Fieldset legend="Section Header">
                <TextInput label={labels.title} value={knowledgeSection.title || ''} onChange={e => onChange('knowledgeSection.title', e.target.value)} />
                <TextareaInput label={labels.subtitle} value={knowledgeSection.subtitle || ''} onChange={e => onChange('knowledgeSection.subtitle', e.target.value)} />
            </Fieldset>

            <Fieldset legend="Knowledge Hub Tabs & Articles">
                <div className="flex border-b mb-4">
                    {tabs.map((tab, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveTabIndex(index)}
                            className={`px-4 py-2 text-sm font-semibold ${activeTabIndex === index ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
                        >
                            {tab.category}
                        </button>
                    ))}
                    <button onClick={handleAddTab} className="px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">+</button>
                </div>

                {tabs.map((tab, tabIndex) => (
                    <div key={tabIndex} className={activeTabIndex === tabIndex ? 'block' : 'hidden'}>
                        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">Editing '{tab.category}' Tab</h3>
                                <button onClick={() => onRemoveItem('knowledgeSection.tabs', tabIndex)} className="text-xs font-semibold text-red-600 hover:text-red-800">Remove this Tab</button>
                            </div>
                            <TextInput label="Category Name" value={tab.category} onChange={e => onChange(`knowledgeSection.tabs.${tabIndex}.category`, e.target.value)} />

                            <div className="mt-6">
                                <h4 className="font-semibold text-slate-600 mb-2">{actions.manageArticles} <span className="font-bold">{tab.category}</span></h4>
                                {(tab.articles || []).map((article, articleIndex) => (
                                    <div key={articleIndex} className="p-4 border rounded-md my-4 relative space-y-4 bg-white">
                                        <h5 className="font-semibold text-slate-600">Article {articleIndex + 1}</h5>
                                        <TextInput label={labels.title} value={article.title} onChange={e => onChange(`knowledgeSection.tabs.${tabIndex}.articles.${articleIndex}.title`, e.target.value)} />
                                        <TextareaInput label={labels.articleSummary} value={article.summary} onChange={e => onChange(`knowledgeSection.tabs.${tabIndex}.articles.${articleIndex}.summary`, e.target.value)} rows={3} />
                                        <TextareaInput
                                            label={labels.articleContent}
                                            value={article.fullContent}
                                            onChange={e => onChange(`knowledgeSection.tabs.${tabIndex}.articles.${articleIndex}.fullContent`, e.target.value)}
                                            rows={12}
                                        />
                                        <button onClick={() => onRemoveItem(`knowledgeSection.tabs.${tabIndex}.articles`, articleIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                                    </div>
                                ))}
                                <button onClick={() => handleAddArticle(tabIndex)} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                                    {actions.addArticle}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Fieldset>
        </div>
    );
};

export default KnowledgePanel;