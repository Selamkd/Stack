import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import APIService from '../../service/api.service';

import { ITag } from '../../../../back/src/models/tag.model';

export default function ManageQuickLookup(props: { id?: string }) {
  const [tag, setTag] = useState<Partial<ITag>>({});

  const [error, setError] = useState<string>('');
  const params = useParams();
  const navigate = useNavigate();
  const id = props?.id ?? params?.id ?? null;

  useEffect(() => {
    console.log(id);
    if (id) {
      const getTag = async () => {
        try {
          const tagRes: Partial<ITag> = await APIService.get(`tags/${id}`);

          setTag(tagRes);
        } catch (err) {
          console.error('Error loading categories', error);
        }
      };

      getTag();
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await APIService.post('tags', tag);
    } catch (err) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-custom-sidebar/70 backdrop-blur-sm border border-custom-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {id ? 'Edit' : 'Create'} Tag
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-zinc-300 mb-2">Name</label>
          <input
            type="text"
            value={tag?.name}
            onChange={(e) => {
              setTag((prev) => {
                if (!prev) return { name: e.target.value };
                return { ...prev, name: e.target.value };
              });
            }}
            className={`w-full px-4 py-2 rounded-lg bg-custom-base border ${
              error ? 'border-red-500' : 'border-custom-border'
            } text-white focus:outline-none focus:ring-1 focus:ring-lime-100/20 focus:border-custom-border`}
            placeholder="Enter tag name..."
          />
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white flex items-center"
          >
            <X size={18} className="mr-2" />
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-lime-200 hover:bg-lime-300 text-zinc-900 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
