import React, { useEffect, useState } from 'react';
import {
  FileText,
  Code,
  Bookmark,
  Wrench,
  Edit,
  Trash,
  Plus,
} from 'lucide-react';
import { INote } from '../../../back/src/models/note.model';
import { ISnippet } from '../../../back/src/models/snippet.model';
import { IQuickLookup } from '../../../back/src/models/quicklookup.model';
import { format } from 'date-fns';
import APIService from '../service/api.service';
import { useNavigate } from 'react-router-dom';

type ContentType = 'notes' | 'snippets' | 'lookups' | 'tools';

interface ITabButton {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface IContentItem {
  type: ContentType;
  item: INote | ISnippet | IQuickLookup;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('notes');
  const [notes, setNotes] = useState<INote[]>();
  const [snippets, setSnippets] = useState<ISnippet[]>();
  const [lookups, setLookups] = useState<IQuickLookup[]>();
  const [tools, setTools] = useState<INote[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, snippetsRes, lookupsRes, toolsRes] = await Promise.all(
          [
            APIService.get('notes'),
            APIService.get('snippets'),
            APIService.get('quicklookups'),
            APIService.get('tools'),
          ]
        );
        console.log(notesRes.Res);
        setNotes(notesRes);
        setSnippets(snippetsRes);
        setLookups(lookupsRes);
        setTools(toolsRes);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    fetchData();
  }, []);

  function getContentData(tab: ContentType) {
    switch (tab) {
      case 'notes':
        return notes || [];
      case 'snippets':
        return snippets || [];
      case 'lookups':
        return lookups || [];
      case 'tools':
        return tools || [];
      default:
        return [];
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl p-4">
        <div className="flex space-x-2 overflow-x-auto">
          <TabButton
            icon={<FileText size={16} />}
            label="Notes"
            isActive={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
          />
          <TabButton
            icon={<Code size={16} />}
            label="Snippets"
            isActive={activeTab === 'snippets'}
            onClick={() => setActiveTab('snippets')}
          />
          <TabButton
            icon={<Bookmark size={16} />}
            label="Lookups"
            isActive={activeTab === 'lookups'}
            onClick={() => setActiveTab('lookups')}
          />
          <TabButton
            icon={<Wrench size={16} />}
            label="Tools"
            isActive={activeTab === 'tools'}
            onClick={() => setActiveTab('tools')}
          />
        </div>
      </div>

      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl">
        <div className="border-b border-custom-border p-4 flex w-full justify-between">
          <h3 className="text-lg font-medium text-white">
            {activeTab === 'notes' && 'Notes'}
            {activeTab === 'snippets' && 'Snippets'}
            {activeTab === 'lookups' && 'Lookups'}
            {activeTab === 'tools' && 'Tools'}
          </h3>
          <button
            onClick={() => navigate(`${activeTab}/new`)}
            className="px-4 py-2 rounded-lg bg-lime-200/70 hover:bg-lime-300 text-zinc-900 font-medium transition-colors flex items-center"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="divide-y divide-custom-border">
          {getContentData(activeTab).map((item) => (
            <ContentItem key={item?._id} item={item} type={activeTab} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, isActive, onClick }: ITabButton) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap
        ${
          isActive
            ? 'bg-lime-500/20 text-lime-400 font-medium border border-lime-500/30'
            : 'text-zinc-400 hover:bg-custom-surface hover:text-white'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ContentItem({ item, type }: IContentItem) {
  const getTypeIcon = () => {
    switch (type) {
      case 'notes':
        return <FileText size={16} className="text-lime-400" />;
      case 'snippets':
        return <Code size={16} className="text-emerald-400" />;
      case 'lookups':
        return <Bookmark size={16} className="text-amber-400" />;
      case 'tools':
        return <Wrench size={16} className="text-violet-400" />;
      default:
        return <FileText size={16} className="text-lime-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-custom-surface/50 transition-colors">
      <div className="flex items-center space-x-3">
        {getTypeIcon()}
        <div>
          <h4 className="text-white font-medium">{item.title}</h4>
          <div className="flex items-center mt-1 text-sm text-zinc-500">
            <span className="mr-3">
              {/* {format(new Date(item?.createdAt), 'PPP')} */}
            </span>
            <div className="flex space-x-1">
              {item.tags?.map((tag, index) => (
                <span key={index} className="text-xs text-zinc-400">
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-1">
        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-custom-surface transition-colors">
          <Edit size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-custom-surface transition-colors">
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
