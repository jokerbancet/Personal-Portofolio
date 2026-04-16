import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, LogOut, Settings, Code, Briefcase, Folder, ChevronRight, Upload, Loader2, Mail } from 'lucide-react';

type Section = 'settings' | 'experience' | 'projects' | 'messages';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('settings');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data states
  const [settings, setSettings] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

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
      { data: eData },
      { data: pData },
      { data: mData }
    ] = await Promise.all([
      supabase.from('portfolio_settings').select('*').single(),
      supabase.from('experiences').select('*').order('sort_order'),
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('messages').select('*').order('created_at', { ascending: false })
    ]);

    setSettings(sData);
    setExperiences(eData || []);
    setProjects(pData || []);
    setMessages(mData || []);
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
            <SidebarLink 
              active={activeSection === 'messages'} 
              onClick={() => setActiveSection('messages')} 
              icon={<Mail size={18} />} 
              label="Messages" 
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
          {activeSection === 'experience' && <ExperienceEditor data={experiences} onUpdate={fetchAllData} showToast={showToast} />}
          {activeSection === 'projects' && <ProjectsEditor data={projects} onUpdate={fetchAllData} showToast={showToast} />}
          {activeSection === 'messages' && <MessagesViewer data={messages} onUpdate={fetchAllData} showToast={showToast} />}
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
          <div className="pt-6 border-t border-primary/10 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Footer & Socials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="LinkedIn URL" value={form.linkedin_url} onChange={v => setForm({...form, linkedin_url: v})} />
              <Input label="GitHub URL" value={form.github_url} onChange={v => setForm({...form, github_url: v})} />
              <Input label="Contact Email" value={form.contact_email} onChange={v => setForm({...form, contact_email: v})} />
            </div>
          </div>
          <div className="pt-6 border-t border-primary/10 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Contact Section Text</h3>
            <div className="grid grid-cols-1 gap-6">
              <Input label="Contact Headline" value={form.contact_headline} onChange={v => setForm({...form, contact_headline: v})} />
              <Input label="Contact Description" value={form.contact_description} onChange={v => setForm({...form, contact_description: v})} textarea />
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
  const [form, setForm] = useState({ title: '', description: '', year: '', project_url: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([{ ...form, sort_order: data.length }]);
    if (error) showToast(error.message, 'error');
    else {
      setForm({ title: '', description: '', year: '', project_url: '' });
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
          <Input label="URL" value={form.project_url} onChange={v => setForm({...form, project_url: v})} />
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

function MessagesViewer({ data, onUpdate, showToast }: any) {
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else {
      onUpdate();
      showToast('Message deleted');
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold uppercase tracking-tighter mb-8">Messages</h2>
      <div className="space-y-6">
        {data.length === 0 ? (
          <p className="text-secondary uppercase font-bold tracking-widest text-xs">No messages yet.</p>
        ) : (
          data.map((msg: any) => (
            <div key={msg.id} className="bg-tertiary p-8 border-2 border-primary/5 relative group">
              <button 
                onClick={() => handleDelete(msg.id)}
                className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="mb-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-secondary block mb-1">From</span>
                <span className="font-bold text-sm uppercase tracking-tight">{msg.email}</span>
              </div>
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-secondary block mb-1">Message</span>
                <p className="text-sm leading-relaxed text-primary whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-primary/5 flex justify-between items-center">
                <span className="text-[0.6rem] text-secondary uppercase font-bold tracking-widest">
                  {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
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
