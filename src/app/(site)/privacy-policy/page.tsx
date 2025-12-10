'use client'
import { useAppSelector } from '@/store/hooks'
import React from 'react'

const PrivacyPolicy = () => {
  const configData = useAppSelector((state) => state.config.data)

  const privacyData = configData?.privacy_policy || ''

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div
        className="prose prose-lg max-w-3xl text-gray-800 leading-relaxed bg-white p-6 rounded-xl shadow"
        dangerouslySetInnerHTML={{ __html: privacyData }}
      />
    </div>
  )
}

export default PrivacyPolicy
