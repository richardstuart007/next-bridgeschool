export type CopyEnv = {
  label: string
  envFile: string
}

export const copyEnvs: CopyEnv[] = [
  { label: 'Local-Local', envFile: '.env.locallocal' },
  { label: 'Local-Dev',   envFile: '.env.localdev'   },
  { label: 'Local-Prod',  envFile: '.env.localprod'  },
]
