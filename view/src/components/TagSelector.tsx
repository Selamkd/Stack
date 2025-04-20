import { useEffect, useState } from 'react';
import { ITag } from '../../../back/src/models/tag.model';
import APIService from '../service/api.service';
import { HashIcon, X } from 'lucide-react';

interface ITagSelector {
  selectedTags: ITag[];
  onChange: (tags: ITag[]) => void;
}

export default function TagSelector(props: ITagSelector) {
  const [tags, setTags] = useState<ITag[]>([]);
  const selectedIds = props?.selectedTags.map((tag) => tag._id);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await APIService.get('tags');
        setTags(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    console.log(id);
    let newTags: ITag[];

    const selectedIds = props?.selectedTags.map((tag) => tag._id);

    if (selectedIds.includes(id)) {
      newTags = props?.selectedTags.filter((tag) => tag._id !== id);
    } else {
      const selected = tags.find((tag) => tag._id == id);

      newTags = [...props.selectedTags, selected as ITag];
    }
    props.onChange(newTags);
  };

  return (
    <div>
      <label className=" text-zinc-300 mb-2 flex items-center">
        <HashIcon size={16} className="mr-2" />
        Tags
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <button
            key={tag._id}
            type="button"
            onClick={() => toggleTag(tag._id)}
            className={`px-3 py-1 rounded-full text-xs flex items-center ${
              selectedIds.includes(tag._id)
                ? 'bg-lime-100/20 text-lime-200 border border-lime-500/30'
                : 'bg-custom-base text-zinc-400 border border-custom-border hover:bg-custom-surface hover:text-white'
            }`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
