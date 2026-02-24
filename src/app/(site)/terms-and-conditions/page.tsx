'use client'

import Loader from '@/common/loader'
import Container from '@/components/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useGetConfig } from '@/hooks/useConfig'
import React from 'react'

const TermsAndCondition = () => {
  const { data, isLoading } = useGetConfig()

  const termsData = data?.terms_condition || ''

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Container className="sm:px-[70px] mt-4">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: "Terms and Conditions" }
          ]}
        />
      </Container>
      <Container className='mt-4 mb-16 sm:px-[189px]'>
        <div
          className="prose prose-lg text-gray-800 leading-relaxed bg-white rounded-xl"
          dangerouslySetInnerHTML={{ __html: termsData }}
        />
      </Container>
    </>
  )
}

export default TermsAndCondition
