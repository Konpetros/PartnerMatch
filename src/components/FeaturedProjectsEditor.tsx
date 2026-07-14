import { Plus, Trash2 } from 'lucide-react';
import { FeaturedProject } from '../types/profile';

interface FeaturedProjectsEditorProps {
  projects: FeaturedProject[];
  onChange: (projects: FeaturedProject[]) => void;
}

const KA_TYPES = ['KA1', 'KA2', 'KA3', 'Other'];
const ROLES = ['Coordinator', 'Partner'];
const MAX_PROJECTS = 10;

export default function FeaturedProjectsEditor({ projects, onChange }: FeaturedProjectsEditorProps) {
  const update = (index: number, field: keyof FeaturedProject, value: string) => {
    const next = projects.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange(next);
  };

  const add = () => {
    if (projects.length >= MAX_PROJECTS) return;
    onChange([...projects, { title: '', kaType: 'KA2', year: '', role: 'Coordinator', description: '', link: '' }]);
  };

  const remove = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
          Featured Projects
        </label>
        <span className="text-[11px] font-semibold text-slate-400">{projects.length} of {MAX_PROJECTS}</span>
      </div>
      <p className="text-xs text-slate-400 font-medium mb-2">Showcase your best Erasmus+ projects to build trust with partners.</p>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="relative border border-slate-200 rounded-xl p-3.5 bg-white">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2.5 right-2.5 p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Remove project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
              <input
                type="text"
                value={project.title}
                onChange={(e) => update(index, 'title', e.target.value)}
                placeholder="Project title"
                className={`${inputClass} sm:col-span-2`}
              />
              <select value={project.kaType} onChange={(e) => update(index, 'kaType', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                {KA_TYPES.map((ka) => <option key={ka} value={ka}>{ka}</option>)}
              </select>
              <input
                type="text"
                value={project.year}
                onChange={(e) => update(index, 'year', e.target.value)}
                placeholder="Year (e.g. 2023)"
                className={inputClass}
              />
              <select value={project.role} onChange={(e) => update(index, 'role', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <input
                type="text"
                value={project.link || ''}
                onChange={(e) => update(index, 'link', e.target.value)}
                placeholder="Project link (optional)"
                className={inputClass}
              />
            </div>
            <textarea
              value={project.description || ''}
              onChange={(e) => update(index, 'description', e.target.value)}
              placeholder="Short description (optional)"
              rows={3}
              className={`${inputClass} mt-2.5 resize-y leading-relaxed`}
            />
          </div>
        ))}
      </div>

      {projects.length < MAX_PROJECTS && (
        <button
          type="button"
          onClick={add}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-slate-300 hover:border-brand-primary text-brand-primary py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer mt-1"
        >
          <Plus className="w-4 h-4" />
          Add project
        </button>
      )}
    </div>
  );
}
