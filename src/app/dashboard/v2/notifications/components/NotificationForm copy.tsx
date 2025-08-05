import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const NotificationForm = () => {
  return (
    <div className='flex flex-col gap-3 w-full mt-5'>
      <div className='w-full'>
        <Label htmlFor='Titre' className='text-xs leading-4'>
          Titre
        </Label>
        <Input id="Titre" name='Titre' type='text' placeholder='Titre...' className='h-10 bg-gray-100 border-none outline-transparent ring-transparent' />
      </div>
      <div className='w-full'>
        <Label htmlFor='Texte' className='text-xs leading-4'>
          Texte
        </Label>
        <Textarea id='Texte' className='bg-gray-100' rows={7} />
      </div>
      <p className='text-xs leading-4'>Ajouter une image de fond</p>
      <div className='w-full border border-gray-400 rounded-lg flex justify-center items-center'>
        <p className='text-[10px] leading-[34.5px] text-gray-600'>cliquer pour importer une image</p>
      </div>
    </div>
  )
}

export default NotificationForm
