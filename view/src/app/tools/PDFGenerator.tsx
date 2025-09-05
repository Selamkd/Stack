import { useState } from 'react';
import {
  Copy,
  TextQuote,
  RefreshCw,
  CheckCircle,
  DoorOpen,
  FileDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const words = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'at',
  'vero',
  'eos',
  'accusamus',
  'accusantium',
  'doloremque',
  'laudantium',
  'totam',
  'rem',
  'aperiam',
  'eaque',
  'ipsa',
  'quae',
  'ab',
  'illo',
  'inventore',
  'veritatis',
  'et',
  'quasi',
  'architecto',
  'beatae',
  'vitae',
  'dicta',
  'sunt',
  'explicabo',
  'nemo',
  'ipsam',
  'voluptatem',
  'quia',
];

export default function PDFGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState('words');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  function generateLorem() {
    let result = '';

    if (type === 'words') {
      result = words.slice(0, amount).join(' ');

      setGeneratedText(result);
      console.log(result);
    } else if (type == 'sentences') {
      let sentences = [];
      for (let i = 0; i < amount; i++) {
        let sentenceIndex = Math.floor(Math.random() * 20);
        const startIndex = Math.floor(
          Math.random() * (words.length - sentenceIndex)
        );

        let sentenceWords = words.slice(startIndex, startIndex + sentenceIndex);
        const sentence = sentenceWords.join(' ');

        sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1));
      }

      setGeneratedText(sentences.join(' '));
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <div className="min-h-screen">
      <main className="mx-5 min-h-screen">
        <header className="flex relative justify-center bg-custom-surface border rounded-md border-custom-border mb-10  rounded-b-xl">
          <div>
            <FileDown className="w-[50px] cursor-point p-2  h-[100px] text-rose-300/60 hover:text-rose-300/50 transition-colors duration-200" />
          </div>
          <div onClick={() => navigate('/tools')}>
            <DoorOpen className="w-[50px]  absolute right-0 cursor-point p-2  h-[100px] text-indigo-200/60 hover:text-rose-300/50 transition-colors duration-200" />
          </div>
        </header>

        <div className="flex flex-col items-center w-full mt-6">
          <section className="border cursor-default w-full max-w-3xl xl:max-w-6xl blue-glass flex flex-col justify-between items-center border-[#242424] rounded-lg overflow-hidden hover:border-[#404040] transition-all pt-10">
            <div className="flex h-full flex-col items-start  w-full px-8 mx-auto justify-center mb-3">
              <div className="flex-1 min-w-0 w-full">
                <h3 className="text-lg font-medium text-white mb-1 break-words">
                  Generate Sample PDF
                </h3>
                <div className="space-y-3 w-full">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Size
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-[#0a0a0a] border border-[#242424] rounded text-white focus:outline-none focus:border-[#404040] transition-colors"
                    >
                      <option value="words">Words</option>
                      <option value="sentences">Sentences</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <section
              onClick={generateLorem}
              className=" mx-auto  cursor-pointer hover:scale-105 w-[350px] flex flex-col justify-between items-center border-[#242424] rounded-lg overflow-hidden hover:border-[#404040] transition-all my-5
            py-5"
            >
              <div className="flex space-x-1 items-center">
                <RefreshCw className=" text-emerald-200/60 group-hover/link:text-emerald-300/50 transition-colors duration-200" />

                <h3 className="text-lg font-medium text-white mb-1 break-words">
                  Generate PDF
                </h3>
              </div>
            </section>
          </section>
        </div>

        {generatedText && (
          <div className="max-w-3xl xl:max-w-6xl mx-auto mt-8">
            <section className="border border-[#242424] blue-glass rounded-lg overflow-hidden">
              <div className="flex p-4 w-full justify-start">
                {copied ? (
                  <CheckCircle className="w-6 h-6 text-green-200/60 group-hover/link:text-green-300/50 transition-colors duration-200" />
                ) : (
                  <Copy
                    onClick={copyToClipboard}
                    className="w-6 h-6 cursor-pointer text-blue-200/60 group-hover/link:text-blue-300/50 transition-colors duration-200"
                  />
                )}
              </div>
              <div className="flex h-full flex-col items-start border-t-[#49505770] border-t w-full px-8 mx-auto py-6 mt-0 justify-center">
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-lg font-medium text-white mb-4 break-words">
                    Generated
                  </h3>
                  <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap break-words">
                    {generatedText}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
