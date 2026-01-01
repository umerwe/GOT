'use client'
import Container from '@/components/container'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useAppSelector } from '@/store/hooks'
import React from 'react'

const TermsAndCondition = () => {
  const configData = useAppSelector((state) => state.config.data)

  const termsData = configData?.terms_condition || ''

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
