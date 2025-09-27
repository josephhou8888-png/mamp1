import React from 'react';
import { TextInput, Fieldset, ImageUploadInput, TextareaInput } from '../AdminFormComponents';

const ProjectsPanel = ({ data, onChange, onAddItem, onRemoveItem, adminContent }) => {
    const projectsSection = data.projectsSection || {};
    const labels = adminContent.labels;
    const actions = adminContent.actions;

    return (
        <div className="space-y-6">
            <Fieldset legend="Section Header">
                <TextInput label={labels.title} value={projectsSection.title || ''} onChange={e => onChange('projectsSection.title', e.target.value)} />
                <TextareaInput 
                    label={labels.subtitle} 
                    value={projectsSection.subtitle || ''} 
                    onChange={e => onChange('projectsSection.subtitle', e.target.value)} 
                    rows={4}
                />
            </Fieldset>
            
            <Fieldset legend="Projects List">
                 {(projectsSection.projects || []).map((item, index) => (
                    <div key={index} className="p-4 border rounded-md my-4 relative space-y-4 bg-white">
                        <h4 className="font-semibold text-slate-600">Project {index + 1}: {item.title || '(New Project)'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput label={labels.title} value={item.title} onChange={e => onChange(`projectsSection.projects.${index}.title`, e.target.value)} />
                            <TextInput label={labels.projectCategory} value={item.category} onChange={e => onChange(`projectsSection.projects.${index}.category`, e.target.value)} />
                        </div>
                        <TextareaInput 
                            label={labels.projectDesc} 
                            value={item.description} 
                            onChange={e => onChange(`projectsSection.projects.${index}.description`, e.target.value)} 
                            rows={5}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TextInput label={labels.projectType} value={item.projectType} onChange={e => onChange(`projectsSection.projects.${index}.projectType`, e.target.value)} />
                            <TextInput label={labels.projectVerification} value={item.verification} onChange={e => onChange(`projectsSection.projects.${index}.verification`, e.target.value)} />
                            <TextInput label={labels.projectReduction} value={item.reduction} onChange={e => onChange(`projectsSection.projects.${index}.reduction`, e.target.value)} />
                         </div>
                        <ImageUploadInput 
                            label={labels.projectImage} 
                            value={item.image} 
                            onChange={e => onChange(`projectsSection.projects.${index}.image`, e.target.value)}
                            buttonText={actions.uploadImage}
                        />
                        <button onClick={() => onRemoveItem('projectsSection.projects', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1 leading-none">✕</button>
                    </div>
                ))}
                <button onClick={() => onAddItem('projectsSection.projects', {category: '', title: '', description: '', projectType: '', verification: '', reduction: '', image: ''})} className="px-4 py-2 bg-emerald-100 text-emerald-700 font-semibold rounded-md hover:bg-emerald-200 text-sm">
                    {actions.addProject}
                </button>
            </Fieldset>
        </div>
    );
};

export default ProjectsPanel;