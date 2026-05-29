import { LEVELS, QUIZ_COLOR, VIDEO_COLOR, READ_COLOR } from '@/src/root/constants/colours'

export default function ColourTest() {
  const buttonColours = [
    { label: 'Read',  cls: READ_COLOR },
    { label: 'Video', cls: VIDEO_COLOR },
    { label: 'Quiz',  cls: QUIZ_COLOR },
  ]

  return (
    <div className='p-8 space-y-6'>
      <h1 className='text-lg font-bold'>Colour test</h1>
      <div className='grid grid-cols-5 gap-4'>
        {LEVELS.map(level => (
          <div key={level.key} className={`p-3 rounded-lg ${level.color} space-y-2`}>
            <p className='text-xs font-bold'>{level.label}</p>
            {buttonColours.map(b => (
              <button
                key={b.label}
                className={`w-full py-1 rounded text-xs font-semibold ${b.cls}`}
              >
                {b.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
