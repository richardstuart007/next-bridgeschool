'use client'

import DatabaseTools from 'nextjs-shared/DatabaseTools'

export default function DbToolsTabs({ tables, baseDir }: { tables: string[]; baseDir: string }) {
  return <DatabaseTools tables={tables} baseDir={baseDir} />
}
