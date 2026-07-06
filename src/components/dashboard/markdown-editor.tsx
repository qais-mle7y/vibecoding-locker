'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [tab, setTab] = useState('write')

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border bg-card ${className}`}>
      <Tabs value={tab} onValueChange={setTab} className="w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-border bg-muted/35 px-3 py-2">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 min-h-0">
          <TabsContent value="write" className="h-full m-0 data-[state=active]:flex">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Write your snippet here...'}
              className="h-full min-h-[300px] w-full resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm focus-visible:ring-0"
            />
          </TabsContent>
          <TabsContent value="preview" className="h-full m-0 data-[state=active]:block p-4 overflow-y-auto min-h-[300px]">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {value ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const {children, className, node, ...rest} = props
                      void node
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <SyntaxHighlighter
                          PreTag="div"
                          language={match[1]}
                          style={vscDarkPlus}
                          customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">Nothing to preview</p>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
