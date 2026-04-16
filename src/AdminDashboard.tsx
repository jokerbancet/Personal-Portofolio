import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, LogOut, Settings, Code, Briefcase, Folder, ChevronRight, Upload, Loader2 } from 'lucide-react';

type Section = 'settings' | 'skills' | 'experience' | 'projects';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('settings');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data states
  const [settings, setSettings] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchAllData();
    }
  }, [session]);

  const fetchAllData = async () => {
    const [
      { data: sData },
      { data: skData },
      { data: eData },
      { data: pData }
    ] = await Promise.all([
      supabase.from('portfolio_settings').select('*').single(),
      supabase.from('skills').select('*').order('sort_order'),
      supabase.from('experiences').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order')
    ]);

    setSettings(sData);
    setSkills(skData || []);
    setExperiences(eData || []);
    setProjects(pData || []);
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showToast(error.message, 'error');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-tertiary p-10 border-2 border-primary"
        >
          <h1 className="text-2xl font-extrabold uppercase tracking-tighter mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-secondary">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full border-b-2 border-primary/10 focus:border-primary bg-transparent outline-none py-2 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-secondary">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full border-b-2 border-primary/10 focus:border-primary bg-transparent outline-none py-2 transition-colors"
                required
              />
            </div>
            <button className="w-full bg-primary text-white py-4 font-bold uppercase tracking-widest hover:bg-black transition-colors">
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-8 flex flex-col justify-between">
        <div>
          <div className="font-extrabold text-xl tracking-tighter mb-12">ADMIN.</div>
          <nav className="space-y-4">
            <SidebarLink 
              active={activeSection === 'settings'} 
              onClick={() => setActiveSection('settings')} 
              icon={<Settings size={18} />} 
              label="Settings" 
            />
            <SidebarLink 
              active={activeSection === 'skills'} 
              onClick={() => setActiveSection('skills')} 
              icon={<Code size={18} />} 
              label="Skills" 
            />
            <SidebarLink 
              active={activeSection === 'experience'} 
              onClick={() => setActiveSection('experience')} 
              icon={<Briefcase size={18} />} 
              label="Experience" 
            />
            <SidebarLink 
              active={activeSection === 'projects'} 
              onClick={() => setActiveSection('projects')} 
              icon={<Folder size={18} />} 
              label="Projects" 
            />
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mt-12"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {message.text && (
          <div className={`fixed top-8 right-8 px-6 py-3 border-2 font-bold uppercase tracking-widest text-xs z-50 ${
            message.type === 'error' ? 'bg-red-50 border-red-500 text-red-500' : 'bg-green-50 border-green-500 text-green-500'
          }`}>
            {message.text}
          </div>
        )}

        <div className="max-w-4xl">
          {activeSection === 'settings' && <SettingsEditor data={settings} onSave={fetchAllData} showToast={showToast} />}
          {activeSection === 'skills' && <SkillsEditor data={skills} onUpdate={fetchAllData} showToast={showToast} />}
          {activeSection === 'experience' && <ExperienceEditor data={experiences} onUpdate={fetchAllData} showToast={showToast} />}
          {activeSection === 'projects' && <ProjectsEditor data={projects} onUpdate={fetchAllData} showToast={showToast} />}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 font-bold uppercase tracking-widest text-xs transition-all ${
        active ? 'bg-white text-primary' : 'hover:bg-white/10'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// --- Section Editors ---

function SettingsEditor({ data, onSave, showToast }: any) {
  const [form, setForm] = useState(data || {});
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // Upload to 'portfolio' bucket
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setForm({ ...form, photo_url: publicUrl });
      showToast('Photo uploaded successfully');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = data?.id ? { ...form, id: data.id } : form;
    const { error } = await supabase.from('portfolio_settings').upsert(payload);
    if (error) showToast(error.message, 'error');
    else {
      showToast(data?.id ? 'Settings updated' : 'Settings created');
      onSave();
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">General Settings</h2>
      <form onSubmit={handleSave} className="space-y-8 bg-tertiary p-8 border-2 border-primary/5">
        <div className="grid grid-cols-1 gap-6">
          <Input label="Headline" value={form.hero_headline} onChange={v => setForm({...form, hero_headline: v})} textarea />
          <Input label="Subheadline" value={form.hero_subheadline} onChange={v => setForm({...form, hero_subheadline: v})} textarea />
          <Input label="CTA Text" value={form.cta_text} onChange={v => setForm({...form, cta_text: v})} />
          <div className="space-y-4">
            <Input label="Photo URL" value={form.photo_url} onChange={v => setForm({...form, photo_url: v})} />
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-white border-2 border-primary px-6 py-3 font-bold uppercase tracking-widest text-[0.7rem] hover:bg-tertiary transition-colors flex items-center gap-2">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload New Photo'}
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
              </label>
              <p className="text-[0.6rem] text-secondary uppercase font-bold tracking-widest">
                Recommended: 800x1000px (4:5 aspect ratio)
              </p>
            </div>
          </div>
        </div>
        <button className="bg-primary text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </form>
    </section>
  );
}

function SkillsEditor({ data, onUpdate, showToast }: any) {
  const [newName, setNewName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('skills').insert([{ name: newName, sort_order: data.length }]);
    if (error) showToast(error.message, 'error');
    else {
      setNewName('');
      onUpdate();
      showToast('Skill added');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else onUpdate();
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">Skills</h2>
      <form onSubmit={handleAdd} className="flex gap-4 mb-12">
        <input 
          placeholder="New Skill Name" 
          value={newName} 
          onChange={e => setNewName(e.target.value)}
          className="flex-1 border-2 border-primary/10 px-4 py-3 outline-none focus:border-primary transition-colors font-bold uppercase text-xs"
        />
        <button className="bg-primary text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
          Add Skill
        </button>
      </form>
      <div className="space-y-2">
        {data.map((skill: any) => (
          <div key={skill.id} className="flex justify-between items-center p-4 bg-tertiary border-2 border-primary/5">
            <span className="font-bold uppercase tracking-widest text-xs">{skill.name}</span>
            <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceEditor({ data, onUpdate, showToast }: any) {
  const [form, setForm] = useState({ role: '', company: '', period: '', responsibilities: [''] });

  const handleAddPoint = () => setForm({...form, responsibilities: [...form.responsibilities, '']});
  const handleRemovePoint = (idx: number) => setForm({...form, responsibilities: form.responsibilities.filter((_, i) => i !== idx)});
  const handlePointChange = (idx: number, val: string) => {
    const newPoints = [...form.responsibilities];
    newPoints[idx] = val;
    setForm({...form, responsibilities: newPoints});
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('experiences').insert([{ ...form, sort_order: data.length }]);
    if (error) showToast(error.message, 'error');
    else {
      setForm({ role: '', company: '', period: '', responsibilities: [''] });
      onUpdate();
      showToast('Experience added');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else onUpdate();
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">Experience</h2>
      <form onSubmit={handleAdd} className="bg-tertiary p-8 border-2 border-primary/5 space-y-6 mb-12">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Role" value={form.role} onChange={v => setForm({...form, role: v})} />
          <Input label="Company" value={form.company} onChange={v => setForm({...form, company: v})} />
          <Input label="Period" value={form.period} onChange={v => setForm({...form, period: v})} />
        </div>
        <div className="space-y-4">
          <label className="text-[0.7rem] font-bold uppercase tracking-widest text-secondary">Responsibilities</label>
          {form.responsibilities.map((point, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                value={point} 
                onChange={e => handlePointChange(idx, e.target.value)}
                className="flex-1 border-b-2 border-primary/10 px-2 py-1 outline-none focus:border-primary bg-transparent text-sm"
              />
              <button type="button" onClick={() => handleRemovePoint(idx)} className="text-red-500"><Trash2 size={14}/></button>
            </div>
          ))}
          <button type="button" onClick={handleAddPoint} className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-60">
            <Plus size={14} /> Add Point
          </button>
        </div>
        <button className="bg-primary text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
          Add Experience
        </button>
      </form>
      <div className="space-y-4">
        {data.map((exp: any) => (
          <div key={exp.id} className="p-6 bg-tertiary border-2 border-primary/5 flex justify-between items-start">
            <div>
              <div className="font-bold uppercase tracking-widest text-sm">{exp.role}</div>
              <div className="text-xs text-secondary uppercase tracking-widest">{exp.company} | {exp.period}</div>
            </div>
            <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsEditor({ data, onUpdate, showToast }: any) {
  const [form, setForm] = useState({ title: '', description: '', year: '', url: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([{ ...form, sort_order: data.length }]);
    if (error) showToast(error.message, 'error');
    else {
      setForm({ title: '', description: '', year: '', url: '' });
      onUpdate();
      showToast('Project added');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else onUpdate();
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">Projects</h2>
      <form onSubmit={handleAdd} className="bg-tertiary p-8 border-2 border-primary/5 space-y-6 mb-12">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Title" value={form.title} onChange={v => setForm({...form, title: v})} />
          <Input label="Year" value={form.year} onChange={v => setForm({...form, year: v})} />
          <Input label="URL" value={form.url} onChange={v => setForm({...form, url: v})} />
        </div>
        <Input label="Description" value={form.description} onChange={v => setForm({...form, description: v})} textarea />
        <button className="bg-primary text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
          Add Project
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((proj: any) => (
          <div key={proj.id} className="p-6 bg-tertiary border-2 border-primary/5 flex justify-between items-start">
            <div>
              <div className="font-bold uppercase tracking-widest text-sm">{proj.title}</div>
              <div className="text-[10px] text-secondary uppercase tracking-widest">{proj.year}</div>
            </div>
            <button onClick={() => handleDelete(proj.id)} className="text-red-500 hover:text-red-700 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Input({ label, value, onChange, textarea }: any) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <div className="space-y-2">
      <label className="text-[0.7rem] font-bold uppercase tracking-widest text-secondary">{label}</label>
      <Component 
        value={value || ''} 
        onChange={(e: any) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full border-b-2 border-primary/10 px-2 py-2 outline-none focus:border-primary bg-transparent text-sm transition-colors resize-none"
      />
    </div>
  );
}
