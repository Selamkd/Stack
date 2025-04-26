import { useEffect, useState } from 'react';
import { ISnippet } from '../../../back/src/models/snippet.model';
import APIService from '../service/api.service';
import { format } from 'date-fns';

export default function Snippets() {
  const [snippets, setSnippets] = useState<ISnippet[]>();

  useEffect(() => {
    async function getSnippets() {
      try {
        const snippetsRes = await APIService.get('snippets');

        setSnippets(snippetsRes);
      } catch (e) {
        console.error('Error fetching snippets', e);
      }
    }
    getSnippets();
  }, []);

  return (
    <main className="bg-custom-surface max-w-7xl mx-auto h-screen p-5 m-5 rounded-lg">
      {snippets && (
        <div className="flex flex-col border border-custom-border h-full p-3 gap-y-5">
          {snippets.map((snippet) => (
            <div className="flex justify-between" key={snippet._id}>
              <p className="font-semibold text-1xl">{snippet.title}</p>
              <p className="font-semibold text-1xl">{snippet.description}</p>
              <span>
                {snippet.createdAt
                  ? format(new Date(snippet.createdAt), 'PP')
                  : 'No date'}
              </span>

              <p>{snippet.category?.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
