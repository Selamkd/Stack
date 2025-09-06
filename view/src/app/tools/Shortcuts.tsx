import { SetStateAction, useState } from 'react';
import {
  Copy,
  CheckCircle,
  SquareTerminal,
  Code,
  FileText,
  Terminal,
  Hexagon,
  DoorOpen,
  TerminalSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const shortcuts = {
  vscode: [
    { keys: 'Ctrl + Shift + P', description: 'Open Command Palette' },
    { keys: 'Ctrl + P', description: 'Quick Open File' },
    { keys: 'Ctrl + Shift + N', description: 'New Window' },
    { keys: 'Ctrl + Shift + E', description: 'Show Explorer' },
    { keys: 'Ctrl + Shift + F', description: 'Show Search' },
    { keys: 'Ctrl + Shift + G', description: 'Show Source Control' },
    { keys: 'Ctrl + Shift + D', description: 'Show Debug' },
    { keys: 'Ctrl + Shift + X', description: 'Show Extensions' },
    { keys: 'Ctrl + `', description: 'Toggle Terminal' },
    { keys: 'Ctrl + B', description: 'Toggle Sidebar' },
    { keys: 'Ctrl + Shift + \\', description: 'Jump to Matching Bracket' },
    { keys: 'Alt + Up/Down', description: 'Move Line Up/Down' },
    { keys: 'Shift + Alt + Up/Down', description: 'Copy Line Up/Down' },
    { keys: 'Ctrl + Shift + K', description: 'Delete Line' },
    { keys: 'Ctrl + /', description: 'Toggle Line Comment' },
    { keys: 'Shift + Alt + A', description: 'Toggle Block Comment' },
    { keys: 'Ctrl + D', description: 'Add Selection to Next Match' },
    { keys: 'Ctrl + Shift + L', description: 'Select All Occurrences' },
    { keys: 'F2', description: 'Rename Symbol' },
    { keys: 'Ctrl + F2', description: 'Change All Occurrences' },
  ],
  nodeTypescript: [
    { keys: 'npm init -y', description: 'Initialize new package.json' },
    { keys: 'npm install package', description: 'Install package locally' },
    { keys: 'npm install -g package', description: 'Install package globally' },
    {
      keys: 'npm install -D package',
      description: 'Install as dev dependency',
    },
    { keys: 'npm run script', description: 'Run npm script' },
    { keys: 'npm start', description: 'Start application' },
    { keys: 'npm test', description: 'Run tests' },
    { keys: 'npm run build', description: 'Build project' },
    { keys: 'npm run dev', description: 'Start development server' },
    { keys: 'npx command', description: 'Execute package without installing' },
    { keys: 'tsc', description: 'Compile TypeScript files' },
    { keys: 'tsc --watch', description: 'Watch and compile TypeScript' },
    { keys: 'tsc --init', description: 'Create tsconfig.json' },
    { keys: 'node --inspect app.js', description: 'Debug Node.js application' },
    { keys: 'node -v', description: 'Check Node.js version' },
    { keys: 'npm -v', description: 'Check npm version' },
    { keys: 'npm outdated', description: 'Check outdated packages' },
    { keys: 'npm update', description: 'Update packages' },
    { keys: 'npm audit', description: 'Check for vulnerabilities' },
    { keys: 'npm audit fix', description: 'Fix vulnerabilities automatically' },
  ],
  tiptap: [
    { keys: 'Ctrl + B', description: 'Bold text' },
    { keys: 'Ctrl + I', description: 'Italic text' },
    { keys: 'Ctrl + U', description: 'Underline text' },
    { keys: 'Ctrl + Shift + X', description: 'Strikethrough text' },
    { keys: 'Ctrl + Alt + 1', description: 'Heading 1' },
    { keys: 'Ctrl + Alt + 2', description: 'Heading 2' },
    { keys: 'Ctrl + Alt + 3', description: 'Heading 3' },
    { keys: 'Ctrl + Alt + 0', description: 'Paragraph' },
    { keys: 'Ctrl + Shift + 8', description: 'Bullet list' },
    { keys: 'Ctrl + Shift + 7', description: 'Ordered list' },
    { keys: 'Ctrl + Shift + 9', description: 'Blockquote' },
    { keys: 'Ctrl + E', description: 'Inline code' },
    { keys: 'Ctrl + Alt + C', description: 'Code block' },
    { keys: 'Ctrl + K', description: 'Add link' },
    { keys: 'Ctrl + Z', description: 'Undo' },
    { keys: 'Ctrl + Y', description: 'Redo' },
    { keys: 'Ctrl + Shift + Z', description: 'Redo (alternative)' },
    { keys: 'Ctrl + A', description: 'Select all' },
    { keys: 'Tab', description: 'Indent (in lists)' },
    { keys: 'Shift + Tab', description: 'Outdent (in lists)' },
  ],
  powershell: [
    { keys: 'Get-Help cmdlet', description: 'Get help for a command' },
    { keys: 'Get-Command', description: 'List all available commands' },
    { keys: 'Get-Process', description: 'List running processes' },
    { keys: 'Get-Service', description: 'List all services' },
    { keys: 'Get-ChildItem', description: 'List directory contents (ls)' },
    { keys: 'Set-Location path', description: 'Change directory (cd)' },
    {
      keys: 'New-Item -ItemType Directory',
      description: 'Create new directory',
    },
    { keys: 'Remove-Item path', description: 'Delete file/directory' },
    { keys: 'Copy-Item src dest', description: 'Copy file/directory' },
    { keys: 'Move-Item src dest', description: 'Move/rename file' },
    { keys: 'Get-Content file', description: 'Display file contents (cat)' },
    { keys: 'Set-Content file "text"', description: 'Write to file' },
    {
      keys: 'Select-String pattern file',
      description: 'Search text in files (grep)',
    },
    { keys: 'Get-History', description: 'Show command history' },
    { keys: 'Clear-Host', description: 'Clear screen (cls)' },
    { keys: 'Get-Location', description: 'Show current directory (pwd)' },
    {
      keys: 'Invoke-WebRequest url',
      description: 'Download from web (wget/curl)',
    },
    { keys: 'Test-Path path', description: 'Check if path exists' },
    { keys: 'Get-Date', description: 'Get current date/time' },
    { keys: 'Start-Process program', description: 'Start a program' },
  ],
  bash: [
    { keys: 'ls -la', description: 'List all files with details' },
    { keys: 'cd path', description: 'Change directory' },
    { keys: 'pwd', description: 'Show current directory' },
    { keys: 'mkdir dirname', description: 'Create directory' },
    {
      keys: 'rm -rf path',
      description: 'Remove files/directories recursively',
    },
    { keys: 'cp src dest', description: 'Copy files' },
    { keys: 'mv src dest', description: 'Move/rename files' },
    { keys: 'cat file', description: 'Display file contents' },
    { keys: 'less file', description: 'View file with pagination' },
    { keys: 'head -n 10 file', description: 'Show first 10 lines' },
    { keys: 'tail -n 10 file', description: 'Show last 10 lines' },
    { keys: 'grep pattern file', description: 'Search text in files' },
    { keys: 'find . -name "pattern"', description: 'Find files by name' },
    { keys: 'chmod 755 file', description: 'Change file permissions' },
    { keys: 'chown user:group file', description: 'Change file ownership' },
    { keys: 'ps aux', description: 'List running processes' },
    { keys: 'kill pid', description: 'Kill process by ID' },
    { keys: 'killall processname', description: 'Kill process by name' },
    { keys: 'df -h', description: 'Show disk usage' },
    { keys: 'du -sh *', description: 'Show directory sizes' },
    { keys: 'history', description: 'Show command history' },
    { keys: 'clear', description: 'Clear terminal screen' },
    { keys: 'wget url', description: 'Download file from web' },
    { keys: 'curl url', description: 'Transfer data from server' },
    { keys: 'tar -xzf file.tar.gz', description: 'Extract tar.gz archive' },
  ],
};

const tabConfig = [
  {
    key: 'vscode',

    icon: Code,
    iconColor: 'text-blue-300/80',
  },
  {
    key: 'nodeTypescript',

    icon: Hexagon,
    iconColor: 'text-emerald-200/60',
  },
  {
    key: 'tiptap',

    icon: FileText,
    iconColor: 'text-amber-200/60',
  },
  {
    key: 'powershell',

    icon: Terminal,
    iconColor: 'text-rose-200/60',
  },
  {
    key: 'bash',

    icon: SquareTerminal,
    iconColor: 'text-cyan-200/60',
  },
];

export default function DailyShortcuts() {
  const [copiedShortcut, setCopiedShortcut] = useState('');
  const [activeTab, setActiveTab] = useState('vscode');
  const navigate = useNavigate();

  const copyToClipboard = async (text: SetStateAction<string>) => {
    try {
      if (typeof text === 'string') {
        await navigator.clipboard.writeText(text);
      } else {
        console.error('Invalid text type for clipboard: ', text);
      }
      setCopiedShortcut(text);
      setTimeout(() => setCopiedShortcut(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeTabConfig = tabConfig.find((tab) => tab.key === activeTab);
  const activeShortcuts = shortcuts[activeTab as keyof typeof shortcuts];

  return (
    <div className="min-h-screen">
      <main className="mx-5 min-h-screen">
        <header className="flex relative justify-center border mb-10 border-custom-border bg-custom-surface rounded-md">
          <div>
            <TerminalSquare className="w-[50px] cursor-point p-2 h-[100px] text-cyan-200/60 hover:text-rose-300/50 transition-colors duration-200" />
          </div>
          <div onClick={() => navigate('/tools')}>
            <DoorOpen className="w-[50px] absolute right-0 cursor-point p-2 h-[100px] text-indigo-200/60 hover:text-rose-300/50 transition-colors duration-200" />
          </div>
        </header>

        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 p-2 blue-glass border border-[#242424] rounded-lg">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <div
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ring-0 active:ring-0 ${
                    isActive
                      ? `${tab.iconColor}`
                      : `hover:bg-zinc-800/50 text-gray-500 border border-transparent hover:border-[#404040]`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex p-8 flex-col items-center w-full">
          <div className="w-full max-w-6xl">
            <section className="border cursor-default w-full bg-custom-surface flex flex-col border-[#242424] rounded-lg overflow-hidden transition-all">
              <div className="flex items-center blue-glass p-6 border-b border-[#242424]">
                {activeTabConfig && (
                  <>
                    <activeTabConfig.icon
                      className={`w-8 h-8 mr-3 ${activeTabConfig.iconColor}`}
                    />
                  </>
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeShortcuts.map((shortcut, index) => (
                    <div
                      key={`${activeTab}-${index}`}
                      className="flex items-center justify-between p-3 bg-custom-surface border border-[#242424] rounded-xl hover:border-[#404040] transition-colors group"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="text-sm font-mono text-blue-200/80 mb-1 break-all">
                          {shortcut.keys}
                        </div>
                        <div className="text-xs text-zinc-400 break-words">
                          {shortcut.description}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(shortcut.keys)}
                        className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedShortcut === shortcut.keys ? (
                          <CheckCircle className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-300 hover:text-blue-300 transition-colors" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
