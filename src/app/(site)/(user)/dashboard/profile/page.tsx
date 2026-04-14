import React from 'react'
import ProfileForm from '@/components/forms/profile-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Profile | Braaap",
};

const ProfilePage = () => {
  return (
    <ProfileForm />
  )
}

export default ProfilePage