'use client'
import Container from '@/components/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useAppSelector } from '@/store/hooks'
import React from 'react'

const PrivacyPolicy = () => {
  const configData = useAppSelector((state) => state.config.data)

  const privacyData = configData?.privacy_policy || ''

  return (
    <>
      <Container className="max-w-[1400px] mx-auto px-3 mt-4">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Privacy Policy" }
          ]}
        />
      </Container>
      <Container className='mt-4 mb-16'>
        <div
          className="prose prose-lg max-w-4xl text-gray-800 leading-relaxed bg-white rounded-xl"
          dangerouslySetInnerHTML={{ __html: privacyData }}
        />
      </Container>
    </>
  )
}

export default PrivacyPolicy
