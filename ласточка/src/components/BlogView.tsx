import React, { useState, useRef } from 'react';
import { BlogPost, BlogBlock } from '../types';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Eye, 
  Edit3, 
  Star, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  LayoutTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogViewProps {
  lang: 'ru' | 'ua';
  managerMode: boolean;
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : '';
}

export default function BlogView({ lang, managerMode, posts, onAddPost, onDeletePost }: BlogViewProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [composeTab, setComposeTab] = useState<'edit' | 'preview'>('edit');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  // Compose States
  const [newTitle, setNewTitle] = useState('');
  const [blocks, setBlocks] = useState<BlogBlock[]>([
    { id: 'initial-text', type: 'text', value: '' }
  ]);
  const [uploadingBlocks, setUploadingBlocks] = useState<Record<string, boolean>>({});
  const [editorSelection, setEditorSelection] = useState<Record<string, { bold: boolean; italic: boolean; color: string }>>({});

  const handleSelectionChange = (blockId: string) => {
    try {
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const color = document.queryCommandValue('foreColor') || '';
      setEditorSelection(prev => ({
        ...prev,
        [blockId]: { bold: isBold, italic: isItalic, color }
      }));
    } catch (e) {}
  };

  const handleUpdateBlockProperty = (id: string, property: keyof BlogBlock, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [property]: value } : b));
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    
    // Convert legacy post layout to block structured layout if needed
    if (post.blocks && post.blocks.length > 0) {
      setBlocks(JSON.parse(JSON.stringify(post.blocks))); // deep clone to avoid modifying original until saved
    } else {
      const initialBlocks: BlogBlock[] = [];
      if (post.content) {
        initialBlocks.push({ id: 'legacy-text', type: 'text', value: post.content });
      }
      if (post.images && post.images.length > 0) {
        post.images.forEach((img, idx) => {
          initialBlocks.push({ id: `legacy-img-${idx}`, type: 'image', value: img });
        });
      }
      if (initialBlocks.length === 0) {
        initialBlocks.push({ id: 'initial-text', type: 'text', value: '' });
      }
      setBlocks(initialBlocks);
    }
    
    setIsComposing(true);
    setComposeTab('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStyledTextBlock = (block: BlogBlock) => {
    const textStyle: React.CSSProperties = {
      color: block.textColor || undefined,
      fontWeight: block.isBold ? 'bold' : undefined,
      fontStyle: block.isItalic ? 'italic' : undefined,
      textAlign: block.alignment || 'left',
    };

    if (block.subtype === 'h1') {
      return (
        <h1 
          key={block.id} 
          style={textStyle} 
          className="text-2xl md:text-3xl font-extrabold leading-tight font-serif mt-6 mb-3"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    } else if (block.subtype === 'h2') {
      return (
        <h2 
          key={block.id} 
          style={textStyle} 
          className="text-xl md:text-2xl font-bold leading-snug font-serif mt-5 mb-2"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    } else if (block.subtype === 'quote') {
      return (
        <blockquote 
          key={block.id} 
          style={textStyle} 
          className="border-l-4 border-pink-400 pl-4 py-2 my-4 text-base italic text-gray-600 bg-pink-50/10 pr-2 rounded-r-lg whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    } else if (block.subtype === 'list') {
      return (
        <div key={block.id} className="flex items-start gap-2 text-sm md:text-base leading-relaxed text-gray-700 my-1">
          <span className="text-pink-500 mt-1.5 font-bold shrink-0">•</span>
          <span style={textStyle} className="flex-1 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.value }} />
        </div>
      );
    } else {
      return (
        <p 
          key={block.id} 
          style={textStyle} 
          className="whitespace-pre-line leading-relaxed text-sm md:text-base text-gray-700"
          dangerouslySetInnerHTML={{ __html: block.value }}
        />
      );
    }
  };

  const handleImageFileChange = async (blockId: string, file: File) => {
    setUploadingBlocks(prev => ({ ...prev, [blockId]: true }));
    try {
      const reader = new FileReader();
      const content = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/github/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, content })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(lang === 'ru' ? 'Ошибка загрузки: ' + (data.error || 'Неизвестная ошибка') : 'Помилка завантаження: ' + (data.error || 'Невідома помилка'));
        return;
      }
      handleUpdateBlock(blockId, data.url);
    } catch (err: any) {
      alert(lang === 'ru' ? 'Ошибка загрузки файла' : 'Помилка завантаження файлу');
    } finally {
      setUploadingBlocks(prev => ({ ...prev, [blockId]: false }));
    }
  };

  // Handle block management
  const handleAddBlock = (type: 'text' | 'image') => {
    const newBlock: BlogBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      value: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleInsertBlockAt = (index: number, type: 'text' | 'image') => {
    const newBlock: BlogBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      value: ''
    };
    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    setBlocks(updated);
  };

  const handleUpdateBlock = (id: string, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b));
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length === 1) {
      setBlocks([{ id: 'reset-text', type: 'text', value: '' }]);
    } else {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  const handleAddPost = () => {
    if (!newTitle.trim()) return;

    // Filter out completely empty blocks
    const filteredBlocks = blocks.filter(b => b.value.trim() !== '');
    if (filteredBlocks.length === 0) return;

    // Compile fallbacks for backwards compatibility
    const fallbackContent = filteredBlocks
      .filter(b => b.type === 'text')
      .map(b => b.value)
      .join('\n\n');

    const fallbackImages = filteredBlocks
      .filter(b => b.type === 'image')
      .map(b => b.value);

    const existingPost = posts.find(p => p.id === editingPostId);

    const post: BlogPost = {
      id: editingPostId || Date.now().toString(),
      title: newTitle,
      content: fallbackContent,
      images: fallbackImages,
      blocks: filteredBlocks,
      date: existingPost ? existingPost.date : new Date().toISOString()
    };

    onAddPost(post);
    setIsComposing(false);
    setEditingPostId(null);
    setNewTitle('');
    setBlocks([{ id: 'initial-text', type: 'text', value: '' }]);
    setComposeTab('edit');
  };

  // Scroll smoothly to a specific article when clicked in sidebar
  const scrollToPost = (id: string) => {
    const element = document.getElementById(`post-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-colors duration-300">
      <style>{`
        .blog-editor-contenteditable:empty::before {
          content: attr(data-placeholder);
          color: #a19992;
          cursor: text;
        }
      `}</style>
      
      {/* Header and Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="text-[#e02484]">✿</span>
            {lang === 'ru' ? 'Блог Ласточки' : 'Блог Ластівки'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-sans">
            {lang === 'ru' ? 'Мода, красота и полезные советы' : 'Мода, краса та корисні поради'}
          </p>
        </div>
        {managerMode && !isComposing && (
          <button
            onClick={() => setIsComposing(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e02484] to-pink-600 text-white rounded-lg font-bold hover:shadow-md transition-all text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            {lang === 'ru' ? 'Написать статью' : 'Написати статтю'}
          </button>
        )}
      </div>

      {/* Editor Panel (Compose Mode) */}
      {isComposing && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 md:p-8 rounded-2xl border border-pink-100 shadow-lg mb-12 space-y-6"
        >
          {/* Editor Header / Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 font-sans">
              <Sparkles className="w-5 h-5 text-[#e02484]" />
              {editingPostId 
                ? (lang === 'ru' ? 'Редактирование статьи' : 'Редагування статті')
                : (lang === 'ru' ? 'Создание новой статьи' : 'Створення нової статті')}
            </h3>
            
            {/* Tab Toggler */}
            <div className="flex p-1 bg-gray-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setComposeTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  composeTab === 'edit'
                    ? 'bg-white text-[#e02484] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {lang === 'ru' ? 'Редактор' : 'Редактор'}
              </button>
              <button
                type="button"
                onClick={() => setComposeTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  composeTab === 'preview'
                    ? 'bg-white text-[#e02484] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {lang === 'ru' ? 'Предпросмотр' : 'Перегляд'}
              </button>
            </div>
          </div>

          {composeTab === 'edit' ? (
            <div className="space-y-6">
              {/* Title input */}
              <input
                type="text"
                placeholder={lang === 'ru' ? 'Заголовок статьи...' : 'Заголовок статті...'}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:border-[#e02484] focus:ring-1 focus:ring-[#e02484] outline-none font-bold text-xl md:text-2xl"
              />

              {/* Dynamic Blocks Container */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  {lang === 'ru' ? 'Содержимое статьи (блоки текста и фото вставляются по очереди):' : 'Вміст статті (блоки тексту та фото вставляються по черзі):'}
                </p>

                {blocks.map((block, index) => (
                  <div key={block.id} className="group relative">
                    
                    {/* Inline top insertion bar */}
                    {index > 0 && (
                      <div className="relative h-4 flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-x-0 h-[1px] border-t border-dashed border-pink-200" />
                        <div className="absolute flex gap-1 bg-white px-2 z-10">
                          <button
                            type="button"
                            onClick={() => handleInsertBlockAt(index, 'text')}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-200 hover:border-pink-300 hover:text-[#e02484] rounded-full transition-all text-gray-500"
                          >
                            <Plus className="w-2.5 h-2.5" /> {lang === 'ru' ? 'Текст' : 'Текст'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertBlockAt(index, 'image')}
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-200 hover:border-pink-300 hover:text-[#e02484] rounded-full transition-all text-gray-500"
                          >
                            <Plus className="w-2.5 h-2.5" /> {lang === 'ru' ? 'Фото' : 'Фото'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Block Card */}
                    <div className="bg-gray-50/30 border border-gray-200/80 rounded-xl p-4 flex gap-4 items-start hover:border-pink-100 hover:bg-white transition-all">
                      {/* Drag/Move indicators & block type badge */}
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(index, 'up')}
                          disabled={index === 0}
                          className="hover:text-[#e02484] disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                          title={lang === 'ru' ? 'Вверх' : 'Вгору'}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 rounded px-1 py-0.5 select-none uppercase tracking-wider">
                          {block.type === 'text' ? (lang === 'ru' ? 'Текст' : 'Текст') : (lang === 'ru' ? 'Фото' : 'Фото')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(index, 'down')}
                          disabled={index === blocks.length - 1}
                          className="hover:text-[#e02484] disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                          title={lang === 'ru' ? 'Вниз' : 'Вниз'}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content Editor area */}
                      <div className="flex-1">
                        {block.type === 'text' ? (
                          <div className="space-y-3 w-full">
                            {/* Formatting Toolbar */}
                            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-100 text-gray-500">
                              {/* Subtype selector */}
                              <select
                                value={block.subtype || 'paragraph'}
                                onChange={e => handleUpdateBlockProperty(block.id, 'subtype', e.target.value)}
                                className="text-xs bg-gray-100 border-none rounded-lg px-2 py-1 outline-none text-gray-750 font-bold focus:ring-1 focus:ring-pink-300 cursor-pointer"
                              >
                                <option value="paragraph">{lang === 'ru' ? 'Обычный текст' : 'Звичайний текст'}</option>
                                <option value="h1">{lang === 'ru' ? 'Заголовок H1' : 'Заголовок H1'}</option>
                                <option value="h2">{lang === 'ru' ? 'Подзаголовок H2' : 'Підзаголовок H2'}</option>
                                <option value="quote">{lang === 'ru' ? 'Цитата' : 'Цитата'}</option>
                                <option value="list">{lang === 'ru' ? 'Список (•)' : 'Список (•)'}</option>
                              </select>

                              {/* Color selector circle palette */}
                              <div className="flex items-center gap-1.5 border-l border-gray-200 pl-2">
                                {[
                                  { value: '', label: 'Default', class: 'bg-gray-800' },
                                  { value: '#e02484', label: 'Pink', class: 'bg-[#e02484]' },
                                  { value: '#d4af37', label: 'Gold', class: 'bg-[#d4af37]' },
                                  { value: '#9d174d', label: 'Burgundy', class: 'bg-[#9d174d]' },
                                  { value: '#6b21a8', label: 'Purple', class: 'bg-[#6b21a8]' },
                                  { value: '#15803d', label: 'Green', class: 'bg-[#15803d]' },
                                ].map(color => {
                                  const selColor = editorSelection[block.id]?.color || '';
                                  const rgbColor = color.value ? (
                                    color.value.startsWith('#') ? hexToRgb(color.value) : color.value
                                  ) : '';
                                  const isActive = selColor && rgbColor ? (
                                    selColor.replace(/\s+/g, '').toLowerCase() === rgbColor.replace(/\s+/g, '').toLowerCase() || 
                                    selColor.toLowerCase() === color.value.toLowerCase()
                                  ) : (!color.value && !selColor);

                                  return (
                                    <button
                                      key={color.value}
                                      type="button"
                                      onMouseDown={e => {
                                        e.preventDefault();
                                        if (color.value) {
                                          document.execCommand('foreColor', false, color.value);
                                        } else {
                                          document.execCommand('foreColor', false, '#374151');
                                        }
                                        const el = document.getElementById(`editor-${block.id}`);
                                        if (el) {
                                          handleUpdateBlock(block.id, el.innerHTML);
                                          handleSelectionChange(block.id);
                                        }
                                      }}
                                      className={`w-4 h-4 rounded-full ${color.class} border-2 ${
                                        isActive || (!color.value && (block.textColor || '') === '') ? 'border-pink-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                                      } transition-all cursor-pointer`}
                                      title={color.label}
                                    />
                                  );
                                })}
                              </div>

                              {/* Formatting Toggles */}
                              <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                                <button
                                  type="button"
                                  onMouseDown={e => {
                                    e.preventDefault();
                                    document.execCommand('bold', false);
                                    const el = document.getElementById(`editor-${block.id}`);
                                    if (el) {
                                      handleUpdateBlock(block.id, el.innerHTML);
                                      handleSelectionChange(block.id);
                                    }
                                  }}
                                  className={`p-1 rounded text-xs font-bold w-6 h-6 flex items-center justify-center transition-all cursor-pointer ${
                                    editorSelection[block.id]?.bold || block.isBold ? 'bg-pink-100 text-[#e02484]' : 'hover:bg-gray-100 text-gray-500'
                                  }`}
                                  title={lang === 'ru' ? 'Жирный' : 'Жирний'}
                                >
                                  B
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={e => {
                                    e.preventDefault();
                                    document.execCommand('italic', false);
                                    const el = document.getElementById(`editor-${block.id}`);
                                    if (el) {
                                      handleUpdateBlock(block.id, el.innerHTML);
                                      handleSelectionChange(block.id);
                                    }
                                  }}
                                  className={`p-1 rounded text-xs italic font-serif w-6 h-6 flex items-center justify-center transition-all cursor-pointer ${
                                    editorSelection[block.id]?.italic || block.isItalic ? 'bg-pink-100 text-[#e02484]' : 'hover:bg-gray-100 text-gray-500'
                                  }`}
                                  title={lang === 'ru' ? 'Курсив' : 'Курсив'}
                                >
                                  I
                                </button>
                              </div>

                              {/* Alignment toggles */}
                              <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2">
                                {[
                                  { value: 'left', icon: '←' },
                                  { value: 'center', icon: '↔' },
                                  { value: 'right', icon: '→' },
                                  { value: 'justify', icon: '＝' },
                                ].map(align => (
                                  <button
                                    key={align.value}
                                    type="button"
                                    onClick={() => handleUpdateBlockProperty(block.id, 'alignment', align.value)}
                                    className={`p-1 rounded text-[10px] font-bold w-6 h-6 flex items-center justify-center transition-all cursor-pointer ${
                                      (block.alignment || 'left') === align.value ? 'bg-pink-100 text-[#e02484]' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {align.icon}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Text Input */}
                            <div
                              id={`editor-${block.id}`}
                              contentEditable
                              suppressContentEditableWarning
                              data-placeholder={
                                block.subtype === 'h1' ? (lang === 'ru' ? 'Заголовок H1...' : 'Заголовок H1...') :
                                block.subtype === 'h2' ? (lang === 'ru' ? 'Подзаголовок H2...' : 'Підзаголовок H2...') :
                                block.subtype === 'quote' ? (lang === 'ru' ? 'Текст цитаты...' : 'Текст цитати...') :
                                block.subtype === 'list' ? (lang === 'ru' ? 'Элемент списка...' : 'Елемент списку...') :
                                (lang === 'ru' ? 'Введите текст...' : 'Введіть текст...')
                              }
                              ref={el => {
                                if (el && el.innerHTML !== block.value) {
                                  if (document.activeElement !== el) {
                                    el.innerHTML = block.value;
                                  }
                                }
                              }}
                              onInput={e => {
                                handleUpdateBlock(block.id, e.currentTarget.innerHTML);
                                handleSelectionChange(block.id);
                              }}
                              onBlur={e => {
                                handleUpdateBlock(block.id, e.currentTarget.innerHTML);
                              }}
                              onKeyUp={() => handleSelectionChange(block.id)}
                              onMouseUp={() => handleSelectionChange(block.id)}
                              onFocus={() => handleSelectionChange(block.id)}
                              style={{
                                color: block.textColor || undefined,
                                fontWeight: block.isBold || block.subtype === 'h1' || block.subtype === 'h2' ? 'bold' : 'normal',
                                fontStyle: block.isItalic || block.subtype === 'quote' ? 'italic' : 'normal',
                                textAlign: block.alignment || 'left',
                              }}
                              className={`blog-editor-contenteditable w-full bg-transparent border-0 outline-none focus:ring-0 p-0 text-gray-755 leading-relaxed min-h-[60px] cursor-text ${
                                block.subtype === 'h1' ? 'text-xl md:text-2xl font-serif font-bold' :
                                block.subtype === 'h2' ? 'text-lg md:text-xl font-serif font-bold' :
                                block.subtype === 'quote' ? 'text-base pl-3 border-l-2 border-pink-300 italic' :
                                'text-sm md:text-base font-sans'
                              }`}
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder={lang === 'ru' ? 'Вставьте URL адрес изображения...' : 'Вставте URL адресу зображення...'}
                                value={block.value}
                                onChange={e => handleUpdateBlock(block.id, e.target.value)}
                                className="flex-1 bg-transparent border-b border-gray-200 outline-none focus:border-[#e02484] text-xs py-1 px-1 text-gray-700 placeholder-gray-400"
                              />
                              <label className="cursor-pointer flex items-center justify-center gap-1 px-3 py-1 bg-gray-100 hover:bg-[#ffd5ea] hover:text-[#e02484] rounded-lg transition-all text-xs font-bold text-gray-600 shrink-0 border border-transparent hover:border-pink-200 select-none">
                                <span>{uploadingBlocks[block.id] ? (lang === 'ru' ? 'Загрузка...' : 'Завантаження...') : (lang === 'ru' ? 'Загрузить файл' : 'Завантажити файл')}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingBlocks[block.id]}
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageFileChange(block.id, file);
                                  }}
                                />
                              </label>
                            </div>
                            {block.value.trim() && (
                              <div className="max-w-md border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                                <img 
                                  src={block.value} 
                                  alt="Preview" 
                                  className="w-full h-36 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1594913785162-e678537db3b4?q=80&w=600';
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Block */}
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors self-center p-1.5 rounded-lg hover:bg-gray-50"
                        title={lang === 'ru' ? 'Удалить этот блок' : 'Видалити цей блок'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Add Block Quick Buttons */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-dashed border-gray-100">
                <button
                  type="button"
                  onClick={() => handleAddBlock('text')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#ffd5ea] hover:text-[#e02484] text-gray-700 rounded-xl font-semibold transition-all text-xs border border-transparent hover:border-pink-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  + {lang === 'ru' ? 'Абзац текста' : 'Абзац тексту'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('image')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#ffd5ea] hover:text-[#e02484] text-gray-700 rounded-xl font-semibold transition-all text-xs border border-transparent hover:border-pink-200"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  + {lang === 'ru' ? 'Фото' : 'Фото'}
                </button>
              </div>
            </div>
          ) : (
            // Editor Live Preview Mode
            <div className="border border-gray-100 rounded-xl p-4 md:p-8 bg-gray-50/40">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2 font-serif">
                {newTitle || (lang === 'ru' ? 'Без заголовка' : 'Без заголовка')}
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
                {new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              
              <div className="prose max-w-none text-gray-700 font-sans space-y-6">
                {blocks.map((block, idx) => {
                  if (block.type === 'text') {
                    return block.value.trim() ? renderStyledTextBlock(block) : null;
                  } else {
                    return block.value.trim() ? (
                      <div key={block.id} className="my-6 max-w-2xl mx-auto rounded-xl overflow-hidden border border-gray-100 bg-gray-100 shadow-sm">
                        <img 
                          src={block.value} 
                          alt="Article body" 
                          className="w-full h-auto object-cover max-h-[450px]" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : null;
                  }
                })}
              </div>
            </div>
          )}

          {/* Editor Footer Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsComposing(false);
                setEditingPostId(null);
                setNewTitle('');
                setBlocks([{ id: 'initial-text', type: 'text', value: '' }]);
                setComposeTab('edit');
              }}
              className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-all text-xs cursor-pointer"
            >
              {lang === 'ru' ? 'Отмена' : 'Скасувати'}
            </button>
            <button
              type="button"
              onClick={handleAddPost}
              disabled={!newTitle.trim() || blocks.filter(b => b.value.trim() !== '').length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-[#e02484] to-pink-600 text-white rounded-xl font-bold hover:shadow-md transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {editingPostId 
                ? (lang === 'ru' ? 'Сохранить изменения' : 'Зберегти зміни')
                : (lang === 'ru' ? 'Опубликовать статью' : 'Опублікувати статтю')}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Blog Layout - Multi Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Popular Articles Sidebar (matches screenshot visual styling) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#ffd5ea]/35 border border-pink-100/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 pb-2 border-b border-[#ffd5ea] flex items-center gap-1.5 font-sans">
              <Star className="w-4 h-4 text-[#e02484] fill-[#e02484]" />
              {lang === 'ru' ? 'Популярные Статьи' : 'Популярні Статті'}
            </h3>
            
            <div className="flex flex-col gap-5">
              {posts.map(post => {
                // Find first image block or fallback image
                let thumb = 'https://images.unsplash.com/photo-1594913785162-e678537db3b4?q=80&w=600';
                if (post.blocks) {
                  const imgBlock = post.blocks.find(b => b.type === 'image');
                  if (imgBlock && imgBlock.value) thumb = imgBlock.value;
                } else if (post.images && post.images.length > 0) {
                  thumb = post.images[0];
                }

                return (
                  <div 
                    key={`popular-${post.id}`} 
                    className="flex flex-col gap-2 group cursor-pointer border-b border-gray-100/60 pb-4 last:border-0 last:pb-0"
                    onClick={() => scrollToPost(post.id)}
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-150 relative">
                      <img 
                        src={thumb} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-white/95 text-[9px] font-bold text-[#e02484] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        {lang === 'ru' ? 'Рекомендовано' : 'Рекомендовано'}
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#e02484] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      
                      {/* Rating Stars row */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] text-gray-400 ml-1 font-semibold">5.0</span>
                      </div>
                      
                      {/* Action buttons matching the style */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-[#e02484] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                          {lang === 'ru' ? 'Подробнее' : 'Детальніше'}
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Feed of Articles */}
        <div className="lg:col-span-3 space-y-12">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 shadow-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 opacity-60" />
              <p className="text-gray-500 font-medium">
                {lang === 'ru' ? 'Пока нет ни одной статьи.' : 'Поки немає жодної статті.'}
              </p>
            </div>
          ) : (
            posts.map(post => (
              <article 
                key={post.id} 
                id={`post-${post.id}`}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 md:p-10">
                  {/* Article header */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight font-serif hover:text-[#e02484] transition-colors">
                      {post.title}
                    </h3>
                    
                    {managerMode && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="text-gray-400 hover:text-[#e02484] hover:bg-pink-50/50 p-2 rounded-xl transition-all cursor-pointer"
                          title={lang === 'ru' ? 'Редактировать статью' : 'Редагувати статтю'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePost(post.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer"
                          title={lang === 'ru' ? 'Удалить статью' : 'Видалити статтю'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date badge */}
                  <div className="text-[11px] text-gray-400 mb-6 uppercase tracking-widest font-bold font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e02484]" />
                    {new Date(post.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {/* Article content render */}
                  {post.blocks && post.blocks.length > 0 ? (
                    // Rendering of Block-Based Article
                    <div className="prose max-w-none text-gray-700 font-sans space-y-6">
                      {post.blocks.map((block) => {
                        if (block.type === 'text') {
                          return renderStyledTextBlock(block);
                        } else {
                          return (
                            <div key={block.id} className="my-8 max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-150 shadow-md bg-gray-50/50 group/img">
                              <img 
                                src={block.value} 
                                alt={post.title} 
                                className="w-full h-auto object-cover max-h-[500px] hover:scale-[1.01] transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    // Legacy Support Rendering (Standard Paragraphs & bottom Image Grid)
                    <div className="space-y-6">
                      <div className="prose max-w-none text-gray-700 font-sans whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {post.content}
                      </div>

                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-50">
                          {post.images.map((img, idx) => (
                            <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm relative group">
                              <img 
                                src={img} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </article>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
