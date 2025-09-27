import React, { useState, memo } from 'react';
import Editable from '../inline-editor/Editable';

interface KnowledgeSectionProps {
    content: any;
    onArticleClick: (article: any) => void;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const KnowledgeSection = memo(({ content, onArticleClick, isEditing, onUpdate }: KnowledgeSectionProps) => {
    const tabs = (content?.tabs || []).filter(Boolean);
    const [activeTab, setActiveTab] = useState(tabs.find(t => t?.category)?.category || '');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 3;

    if (!content || tabs.length === 0) return null;

    const handleTabClick = (category: string) => {
        setActiveTab(category);
        setCurrentPage(1);
    };

    const activeTabData = tabs.find(tab => tab?.category === activeTab);
    const articles = activeTabData?.articles?.filter(Boolean) || [];
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstProject = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstProject, indexOfLastArticle);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const animationKey = `${activeTab}-${currentPage}`;
    
    const activeTabIndex = tabs.findIndex(tab => tab.category === activeTab);

    return (
        <section id="knowledge" className="py-20 md:py-32 px-4 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto text-center">
                <Editable path="knowledgeSection.title" isEditing={isEditing} onUpdate={onUpdate}>
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
                </Editable>
                <Editable path="knowledgeSection.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                    <p className="mt-6 max-w-3xl mx-auto text-lg">{content?.subtitle || ''}</p>
                </Editable>
                
                <div className="mt-12 border-b border-[var(--color-border)]">
                    <div className="flex flex-nowrap justify-start md:justify-center gap-x-8 gap-y-2 overflow-x-auto hide-scrollbar -mb-px px-4">
                        {tabs.map((tab, index) => (
                            <button
                                key={`${tab.category}-${index}`}
                                onClick={() => handleTabClick(tab.category)}
                                className={`flex-shrink-0 px-1 py-4 text-lg font-sans font-semibold transition-colors duration-300 relative ${activeTab === tab.category ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'}`}
                            >
                                {tab.category}
                                {activeTab === tab.category && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]"></span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div key={animationKey} className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {currentArticles.map((article, index) => {
                         const originalIndex = articles.findIndex(a => a.title === article.title);
                        return (
                        <div key={index} className="bg-white border border-[var(--color-border)] rounded-2xl p-8 flex flex-col transition-all duration-300 hover:border-[var(--color-primary)]/50 animate-fade-in shadow-sm hover:shadow-md">
                            <Editable path={`knowledgeSection.tabs.${activeTabIndex}.articles.${originalIndex}.title`} isEditing={isEditing} onUpdate={onUpdate}>
                                <h3 className="text-2xl font-sans text-[var(--color-text)] flex-grow">{article.title}</h3>
                            </Editable>
                            <Editable path={`knowledgeSection.tabs.${activeTabIndex}.articles.${originalIndex}.summary`} isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                                <p className="mt-4 text-[var(--color-text-secondary)]">{article.summary}</p>
                            </Editable>
                            <button onClick={() => onArticleClick(article)} className="mt-6 font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] self-start">
                                {content.readMore} &rarr;
                            </button>
                        </div>
                    )})}
                </div>

                {totalPages > 1 && (
                     <div className="mt-16 flex justify-center items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                aria-label={`Go to page ${pageNumber}`}
                                aria-current={currentPage === pageNumber ? 'true' : 'false'}
                                className="p-2 group"
                            >
                                <div className={`h-2 rounded-full transition-all duration-300 ease-in-out group-hover:bg-slate-400 ${
                                    currentPage === pageNumber ? 'bg-[var(--color-primary)] w-8' : 'bg-[var(--color-border)] w-2'
                                }`} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
});

KnowledgeSection.displayName = 'KnowledgeSection';

export default KnowledgeSection;