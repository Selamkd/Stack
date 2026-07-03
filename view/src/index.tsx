import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Chat from './app/Chat';
import Home from './app/Home';
import Lookups from './app/Lookups';
import Notes from './app/Notes';
import ProjectBoard from './app/ProjectBoard';
import Shortcuts from './app/Shortcuts';
import Snippets from './app/Snippets';
import Tools from './app/Tools';
import ColorConverter from './app/tools/ColorConverter';
import EncoderTool from './app/tools/EncoderTool';
import JsonFormatter from './app/tools/JsonFormatter';
import LoremIpsum from './app/tools/LoremIpsum';
import NetworkInfo from './app/tools/NetworkInfo';
import PdfGenerator from './app/tools/PdfGenerator';
import RegexTester from './app/tools/RegexTester';
import TimestampConverter from './app/tools/TimestampConverter';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="notes" element={<Notes />} />
        <Route path="snippets" element={<Snippets />} />
        <Route path="lookups" element={<Lookups />} />
        <Route path="shortcuts" element={<Shortcuts />} />
        <Route path="project-board" element={<ProjectBoard />} />
        <Route path="tools" element={<Tools />} />
        <Route path="tools/color-converter" element={<ColorConverter />} />
        <Route path="tools/json" element={<JsonFormatter />} />
        <Route path="tools/regex" element={<RegexTester />} />
        <Route path="tools/timestamp" element={<TimestampConverter />} />
        <Route path="tools/encode" element={<EncoderTool />} />
        <Route path="tools/lorem" element={<LoremIpsum />} />
        <Route path="tools/pdf" element={<PdfGenerator />} />
        <Route path="tools/network" element={<NetworkInfo />} />
      </Routes>
    </AppLayout>
  </BrowserRouter>
);
