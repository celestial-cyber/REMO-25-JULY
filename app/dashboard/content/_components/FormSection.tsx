'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation' // ✅ import this
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

interface PROPS {
  selectedTemplate?: TEMPLATE
  loading: boolean
  setLoading: (val: boolean) => void
  setAiOutput: (val: string) => void
}

export default function FormSection({ selectedTemplate, loading, setLoading, setAiOutput }: PROPS) {
  const [formData, setFormData] = useState<any>({})
  const pathname = usePathname() // ✅ get current path

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const prompt = Object.values(formData).join(' ')

      // Step 1: Generate content from AI (Gemini)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      const aiOutput = data.output || '⚠️ No response from AI.'
      setAiOutput(aiOutput)

      // Step 2: Save to PHP backend (submit.php)
      await fetch('http://localhost/remo/backend/submit.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, response: aiOutput }),
      })
    } catch (error) {
      console.error('Error generating content:', error)
      setAiOutput('❌ Failed to generate content. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className='p-5 shadow-md border rounded-lg'>
      <h2 className='font-bold text-2xl mb-2 text-purple-700'>
        {selectedTemplate?.Name}
      </h2>
      <p className='text-gray-500 text-sm'>{selectedTemplate?.desc}</p>

      <form className='mt-6' onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((item, index) => (
          <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
            <label className='font-bold'>{item.label}</label>
            {item.field === 'input' ? (
              <Input
                name={item.Name}
                required={item?.required}
                onChange={handleInputChange}
              />
            ) : item.field === 'textarea' ? (
              <Textarea
                name={item.Name}
                required={item?.required}
                onChange={handleInputChange}
              />
            ) : null}
          </div>
        ))}

        <Button type='submit' className='w-full py-6' disabled={loading}>
          {loading && <Loader2Icon className='animate-spin mr-2 h-5 w-5' />}
          {pathname === '/dashboard/content/generate-blog-title'
            ? 'Generate Title'
            : 'Generate Content'}
        </Button>
      </form>
    </div>
  )
}
