'use client'
import { useAppSelector } from '@/store/hooks'
import React from 'react'

const TermsAndCondition = () => {
  const configData = useAppSelector((state) => state.config.data)

  const termsData = configData?.terms_condition || ''

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div
        className="prose prose-lg max-w-3xl text-gray-800 leading-relaxed bg-white p-6 rounded-xl shadow"
        dangerouslySetInnerHTML={{ __html: termsData }}
      />
    </div>
  )
}

export default TermsAndCondition
