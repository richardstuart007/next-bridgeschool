export const QUIZ_COLOR  = 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white'
export const VIDEO_COLOR = 'bg-orange-500 hover:bg-orange-600 text-white'
export const READ_COLOR  = 'bg-green-600 hover:bg-green-700 text-white'

export const DEFAULT_TEXT  = 'text-black'
export const DEFAULT_COLOR = `bg-sky-200 hover:bg-sky-200 ${DEFAULT_TEXT}`

export const LEVELS = [
  { key: 'Beginner',     label: 'Beginner',     text: 'text-black', color: 'bg-sky-200 hover:bg-sky-300 text-black' },
  { key: 'Improver',     label: 'Improver',     text: 'text-black', color: 'bg-sky-300 hover:bg-sky-400 text-black' },
  { key: 'Intermediate', label: 'Intermediate', text: 'text-black', color: 'bg-blue-400 hover:bg-blue-500 text-black' },
  { key: 'Advanced',     label: 'Advanced',     text: 'text-black', color: 'bg-blue-500 hover:bg-blue-600 text-black' },
  { key: 'Random',       label: 'Random',       text: 'text-black', color: 'bg-yellow-100 hover:bg-yellow-300 text-black' }
]

export function getLevelColor(sb_level: string | undefined): string {
  return LEVELS.find(l => l.key === sb_level)?.color ?? DEFAULT_COLOR
}

export function getLevelText(sb_level: string | undefined): string {
  return LEVELS.find(l => l.key === sb_level)?.text ?? DEFAULT_TEXT
}
