'use client'

import { useState } from 'react'
import { Download, Settings, Upload } from 'lucide-react'
import { exportLockerItems, importLockerItems, type LockerItemImport } from '@/app/actions/locker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportLockerItems()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vibecoding-locker-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Export successful')
    } catch {
      toast.error('Failed to export locker data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data: unknown = JSON.parse(text)

      if (!Array.isArray(data)) {
        throw new Error('Invalid JSON format. Expected an array of locker items.')
      }

      const inserted = await importLockerItems(data as LockerItemImport[])
      toast.success(`Import successful. Added ${inserted} items.`)
      e.target.value = ''
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to import locker data'))
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <header className="rounded-lg border border-border bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-primary/14 text-primary ring-1 ring-primary/22">
            <Settings className="size-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage backups and restore locker data.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg border-border bg-card py-0 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Download className="size-5 text-primary" />
              Export Locker
            </CardTitle>
            <CardDescription>
              Download a JSON backup of all snippets, commands, and prompts.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <Button onClick={handleExport} disabled={isExporting} className="h-10 w-full font-semibold">
              {isExporting ? 'Exporting...' : 'Download JSON Backup'}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border bg-card py-0 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Upload className="size-5 text-primary" />
              Import Locker
            </CardTitle>
            <CardDescription>
              Restore from a JSON backup. Exact title and content duplicates are skipped.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5">
            <Label htmlFor="import-file" className="sr-only">Choose backup file</Label>
            <input
              type="file"
              id="import-file"
              accept=".json"
              className="block w-full rounded-lg border border-input bg-input/45 p-2 text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
              onChange={handleImport}
              disabled={isImporting}
            />
            {isImporting && <p className="text-sm text-muted-foreground animate-pulse">Importing data, please wait...</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
