import React, { useState, memo } from 'react';
import Editable from '../inline-editor/Editable';
import { sanitizeHTML } from '../../utils/sanitizer';

interface ProjectCardProps {
    category: string;
    title: string;
    description: string;
    projectType: string;
    verification: string;
    reduction: string;
    image: string;
    content: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
    originalIndex: number;
}
const ProjectCard = memo(({ category, title, description, projectType, verification, reduction, image, content, isEditing, onUpdate, originalIndex }: ProjectCardProps) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] group shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
            <Editable path={`projectsSection.projects.${originalIndex}.image`} isEditing={isEditing} onUpdate={onUpdate} type="image">
                {image && <img src={image} alt={title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
            </Editable>
            <div className="p-8 md:p-10 space-y-6">
                <Editable path={`projectsSection.projects.${originalIndex}.category`} isEditing={isEditing} onUpdate={onUpdate}>
                    <p className="font-semibold text-[var(--color-primary)]">{category}</p>
                </Editable>
                <Editable path={`projectsSection.projects.${originalIndex}.title`} isEditing={isEditing} onUpdate={onUpdate}>
                    <h3 className="text-4xl font-sans text-[var(--color-text)]">{title}</h3>
                </Editable>
                <Editable path={`projectsSection.projects.${originalIndex}.description`} isEditing={isEditing} onUpdate={onUpdate} type="html">
                    <div className="text-[var(--color-text-secondary)] prose" dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }} />
                </Editable>
                <div className="pt-6 border-t border-[var(--color-border)] grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <p className="font-semibold text-[var(--color-text)]">{content.projectType}</p>
                        <Editable path={`projectsSection.projects.${originalIndex}.projectType`} isEditing={isEditing} onUpdate={onUpdate}>
                            <p className="text-[var(--color-text-secondary)]">{projectType}</p>
                        </Editable>
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-text)]">{content.annualReduction}</p>
                        <Editable path={`projectsSection.projects.${originalIndex}.reduction`} isEditing={isEditing} onUpdate={onUpdate}>
                            <p className="text-[var(--color-text-secondary)]">{reduction}</p>
                        </Editable>
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-text)]">{content.verification}</p>
                        <Editable path={`projectsSection.projects.${originalIndex}.verification`} isEditing={isEditing} onUpdate={onUpdate}>
                            <p className="text-[var(--color-text-secondary)]">{verification}</p>
                        </Editable>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';


interface ProjectsProps {
    content: any;
    cardContent: any;
    isEditing: boolean;
    onUpdate: (path: string, value: any) => void;
}
const Projects = memo(({ content, cardContent, isEditing, onUpdate }: ProjectsProps) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 2;

    const projects = (content?.projects || []).filter(Boolean);
    const filters = (content?.filters || ['All']).filter(Boolean);

    const filteredProjects = projects.filter(project =>
        activeFilter === 'All' || project.category === activeFilter
    );

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    const animationKey = `${activeFilter}-${currentPage}`;

    return (
        <section id="projects" className="py-20 md:py-32 px-4 bg-slate-50/40 backdrop-blur-sm">
            <div className="container mx-auto text-center">
                <Editable path="projectsSection.title" isEditing={isEditing} onUpdate={onUpdate}>
                    <h2 className="text-5xl md:text-6xl font-sans tracking-tight">{content?.title || ''}</h2>
                </Editable>
                <Editable path="projectsSection.subtitle" isEditing={isEditing} onUpdate={onUpdate} type="textarea">
                    <p className="mt-6 max-w-3xl mx-auto text-lg">
                        {content?.subtitle || ''}
                    </p>
                </Editable>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    {filters.map((filter, index) => (
                         <button 
                             key={index} 
                             onClick={() => handleFilterClick(filter)}
                             className={`px-6 py-2.5 font-semibold text-sm rounded-full transition-colors duration-300 ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] bg-white hover:bg-slate-100'}`}
                             aria-pressed={activeFilter === filter}
                         >
                            {filter}
                         </button>
                    ))}
                </div>
                
                <div key={animationKey} className="mt-16 grid md:grid-cols-2 gap-8 text-left animate-fade-in">
                    {currentProjects.length > 0 ? (
                        currentProjects.map((project, index) => {
                             const originalIndex = projects.findIndex(p => p.title === project.title);
                            return <ProjectCard key={`${project.title}-${index}`} {...project} content={cardContent} isEditing={isEditing} onUpdate={onUpdate} originalIndex={originalIndex} />
                        })
                    ) : (
                        <p className="col-span-2 text-center text-slate-500 py-12">{content?.noProjects || 'No projects found.'}</p>
                    )}
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

Projects.displayName = 'Projects';

export default Projects;
