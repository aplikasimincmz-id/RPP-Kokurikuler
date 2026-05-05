import React from 'react';
import { ThemeSettings } from '../types';
import { Moon, Sun, Monitor, Palette, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeSettingsProps {
  settings: ThemeSettings;
  onChange: (settings: ThemeSettings) => void;
}

const colorSchemes = [
  { id: 'teal', label: 'Teal', bg: 'bg-teal-500', 
    vars: {
      '--primary-50': '#f0fdfa',
      '--primary-100': '#ccfbf1',
      '--primary-200': '#99f6e4',
      '--primary-300': '#5eead4',
      '--primary-400': '#2dd4bf',
      '--primary-500': '#14b8a6',
      '--primary-600': '#0d9488',
      '--primary-700': '#0f766e',
      '--primary-800': '#115e59',
      '--primary-900': '#134e4a',
      '--primary-950': '#042f2e',
    }
  },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500',
    vars: {
      '--primary-50': '#eff6ff',
      '--primary-100': '#dbeafe',
      '--primary-200': '#bfdbfe',
      '--primary-300': '#93c5fd',
      '--primary-400': '#60a5fa',
      '--primary-500': '#3b82f6',
      '--primary-600': '#2563eb',
      '--primary-700': '#1d4ed8',
      '--primary-800': '#1e40af',
      '--primary-900': '#1e3a8a',
      '--primary-950': '#172554',
    }
  },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500',
    vars: {
      '--primary-50': '#eef2ff',
      '--primary-100': '#e0e7ff',
      '--primary-200': '#c7d2fe',
      '--primary-300': '#a5b4fc',
      '--primary-400': '#818cf8',
      '--primary-500': '#6366f1',
      '--primary-600': '#4f46e5',
      '--primary-700': '#4338ca',
      '--primary-800': '#3730a3',
      '--primary-900': '#312e81',
      '--primary-950': '#1e1b4b',
    }
  },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500',
    vars: {
      '--primary-50': '#faf5ff',
      '--primary-100': '#f3e8ff',
      '--primary-200': '#e9d5ff',
      '--primary-300': '#d8b4fe',
      '--primary-400': '#c084fc',
      '--primary-500': '#a855f7',
      '--primary-600': '#9333ea',
      '--primary-700': '#7e22ce',
      '--primary-800': '#6b21a8',
      '--primary-900': '#581c87',
      '--primary-950': '#3b0764',
    }
  },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500',
    vars: {
      '--primary-50': '#ecfdf5',
      '--primary-100': '#d1fae5',
      '--primary-200': '#a7f3d0',
      '--primary-300': '#6ee7b7',
      '--primary-400': '#34d399',
      '--primary-500': '#10b981',
      '--primary-600': '#059669',
      '--primary-700': '#047857',
      '--primary-800': '#065f46',
      '--primary-900': '#064e3b',
      '--primary-950': '#022c22',
    }
  }
];

export const ThemeSettingsComponent: React.FC<ThemeSettingsProps> = ({ settings, onChange }) => {
  const applyColors = (schemeId: string) => {
    const scheme = colorSchemes.find(s => s.id === schemeId);
    if (scheme) {
      Object.entries(scheme.vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      onChange({ ...settings, primaryColor: schemeId as any });
    }
  };

  const toggleMode = (mode: 'light' | 'dark' | 'system') => {
    onChange({ ...settings, mode });
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 w-72 print:hidden overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="text-primary-600" size={18} />
        <h3 className="font-bold text-gray-800 dark:text-neutral-100 text-sm">Tema Aplikasi</h3>
      </div>

      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tampilan</p>
          <div className="flex bg-gray-50 dark:bg-neutral-800 p-1 rounded-xl border border-gray-100 dark:border-neutral-700">
            <button 
              onClick={() => toggleMode('light')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${settings.mode === 'light' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Sun size={14} />
            </button>
            <button 
              onClick={() => toggleMode('dark')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${settings.mode === 'dark' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => toggleMode('system')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${settings.mode === 'system' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Monitor size={14} />
            </button>
          </div>
        </div>

        {/* Primary Color */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Warna Utama</p>
          <div className="grid grid-cols-5 gap-2 px-1">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => applyColors(scheme.id)}
                className={`w-full aspect-square rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${scheme.bg} ${settings.primaryColor === scheme.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                title={scheme.label}
              >
                {settings.primaryColor === scheme.id && <Check size={12} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
