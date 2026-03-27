'use client'
import Loader from '@/common/loader'
import Container from '@/components/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useGetConfig } from '@/hooks/useConfig'
import React from 'react'

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetConfig()

  const privacyData = data?.privacy_policy || ''

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Container className="mt-4 sm:px-[70px]">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Privacy Policy" }
          ]}
        />
      </Container>
      <Container className='mt-4 mb-16 sm:px-[189px]'>
        <div
          className="prose prose-lg text-gray-800 leading-relaxed bg-white rounded-xl"
          dangerouslySetInnerHTML={{ __html: privacyData }}
        />
      </Container>
    </>
  )
}

export default PrivacyPolicy
