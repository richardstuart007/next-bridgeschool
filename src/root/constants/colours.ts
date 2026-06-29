export const QUIZ_COLOR  = 'bg-amber-800 hover:bg-amber-900 text-white'
export const VIDEO_COLOR = 'bg-orange-400 hover:bg-orange-500 text-white'
export const READ_COLOR  = 'bg-teal-600 hover:bg-teal-700 text-white'
export const REFS_COLOR  = 'bg-sky-600 hover:bg-sky-700 text-white'

export const DEFAULT_TEXT  = 'text-black'
export const DEFAULT_COLOR = `bg-sky-200 hover:bg-sky-200 ${DEFAULT_TEXT}`

export const LEVELS = [
  { key: 'Beginner',     label: 'Beginner',     text: 'text-white', color: 'bg-green-300 hover:bg-green-400 text-white' },
  { key: 'Improver',     label: 'Improver',     text: 'text-white', color: 'bg-teal-300 hover:bg-teal-400 text-white' },
  { key: 'Intermediate', label: 'Intermediate', text: 'text-white', color: 'bg-blue-300 hover:bg-blue-400 text-white' },
  { key: 'Advanced',     label: 'Advanced',     text: 'text-white', color: 'bg-purple-300 hover:bg-purple-400 text-white' },
  { key: 'Random',       label: 'Random',       text: 'text-gray-800', color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' }
]

export function getLevelColor(sb_level: string | undefined): string {
  return LEVELS.find(l => l.key === sb_level)?.color ?? DEFAULT_COLOR
}

export function getLevelText(sb_level: string | undefined): string {
  return LEVELS.find(l => l.key === sb_level)?.text ?? DEFAULT_TEXT
}
