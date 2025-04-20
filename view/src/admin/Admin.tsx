import React, { useEffect, useState } from 'react';
import {
  FileText,
  Code,
  Bookmark,
  Wrench,
  Edit,
  Trash,
  Plus,
  X,
  Hash,
  GitBranch,
  HashIcon,
} from 'lucide-react';
import { INote } from '../../../back/src/models/note.model';
import { ISnippet } from '../../../back/src/models/snippet.model';
import { IQuickLookup } from '../../../back/src/models/quicklookup.model';

import APIService from '../service/api.service';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ICategory } from '../../../back/src/models/category.model';
import { ITag } from '../../../back/src/models/tag.model';

type ContentType = 'notes' | 'snippets' | 'lookups' | 'tags' | 'categories';

interface ITabButton {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('notes');
  const [notes, setNotes] = useState<INote[]>();
  const [snippets, setSnippets] = useState<ISnippet[]>();
  const [lookups, setLookups] = useState<IQuickLookup[]>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [tags, setTags] = useState<ITag[]>();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, snippetsRes, lookupsRes, tagsRes, categoriesRes] =
          await Promise.all([
            APIService.get('notes'),
            APIService.get('snippets'),
            APIService.get('quicklookups'),
            APIService.get('tags'),
            APIService.get('tags'),
          ]);

        setNotes(notesRes);
        setSnippets(snippetsRes);
        setLookups(lookupsRes);
        setCategories(categoriesRes);
        setTags(tagsRes);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    fetchData();
  }, [activeTab]);

  function getContentData(tab: ContentType) {
    switch (tab) {
      case 'notes':
        return notes || [];
      case 'snippets':
        return snippets || [];
      case 'lookups':
        return lookups || [];
      case 'categories':
        return categories || [];
      case 'tags':
        return tags || [];
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
            icon={<GitBranch size={16} />}
            label="Categories"
            isActive={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
          />
          <TabButton
            icon={<Hash size={16} />}
            label="Tags"
            isActive={activeTab === 'tags'}
            onClick={() => setActiveTab('tags')}
          />
        </div>
      </div>

      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl">
        <div className="border-b border-custom-border p-4 flex w-full justify-between">
          <h3 className="text-lg font-medium text-white">
            {activeTab === 'notes' && 'Notes'}
            {activeTab === 'snippets' && 'Snippets'}
            {activeTab === 'lookups' && 'Lookups'}
            {activeTab === 'categories' && 'Categories'}
            {activeTab === 'tags' && 'Tags'}
          </h3>
          <button
            onClick={() => setShowPasswordModal(true)}
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
      {showPasswordModal && (
        <PasswordModal
          onSuccess={() => navigate(`${activeTab}/new`)}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
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
            ? 'border border-lime-500/20 text-lime-200 font-medium'
            : 'text-zinc-400 hover:bg-custom-surface hover:text-white'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface IContentItem {
  type: ContentType;
  item: INote | ISnippet | IQuickLookup | ICategory | ITag;
}

function ContentItem({ item, type }: IContentItem) {
  const navigate = useNavigate();
  const getTypeIcon = () => {
    switch (type) {
      case 'notes':
        return <FileText size={20} className="text-zinc-200/70 mb-5" />;
      case 'snippets':
        return <Code size={20} className="text-emerald-400 mb-5" />;
      case 'lookups':
        return <Bookmark size={20} className="text-amber-200 mb-5" />;
      case 'categories':
        return <GitBranch size={20} className="text-lime-200 mb-5" />;
      case 'tags':
        return <HashIcon size={20} className="text-violet-300 mb-5" />;
      default:
        return <FileText size={20} className="text-zink-400" />;
    }
  };
  const getItemTitle = () => {
    if (type === 'categories' || type === 'tags') {
      return 'name' in item ? item.name : 'Untitled';
    }
    return 'title' in item ? item.title : 'Untitled';
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-custom-surface/50 transition-colors">
      <div className="flex items-center space-x-3">
        {getTypeIcon()}
        <div>
          <h4 className="text-white font-medium">{getItemTitle()}</h4>
          <div className="flex items-center mt-1 text-sm text-zinc-500">
            <span className="mr-3">
              {item?.createdAt
                ? format(new Date(item.createdAt), 'PPP')
                : 'No date'}
            </span>
            {'tags' in item && item.tags && (
              <div className="flex space-x-1">
                {item.tags?.map((tag, index) => (
                  <span key={index} className="text-xs text-zinc-400">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-1">
        <button
          onClick={() => navigate(`${type}/${item._id}`)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-custom-surface transition-colors"
        >
          <Edit size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-custom-surface transition-colors">
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}
interface IPasswordModal {
  onSuccess: () => void;
  onClose: () => void;
}

function PasswordModal(props: IPasswordModal) {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const checkPassRes = await APIService.post('check-pass', {
        pass: password,
      });

      if (checkPassRes && checkPassRes.message === ':)') {
        props.onSuccess();
      } else if (checkPassRes.status === 429) {
        setError('Max attempt reached please try again');
      } else {
        setError(checkPassRes.message);
      }
    } catch (err) {
      setError(`Incorrect password`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
      <div className="bg-custom-dark-surface border border-custom-dark-border rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Admin Access</h2>
          <button
            onClick={props.onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 mb-4 rounded-lg bg-custom-dark-base border border-custom-dark-border text-gray-800focus:outline-none focus:ring-2 focus:ring-lime-100 focus:border-lime-200"
            autoFocus
          />
          {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={props.onClose}
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-lime-200 hover:bg-lime-300 text-zinc-900 font-medium"
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;
