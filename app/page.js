"use client"
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {

  useEffect(() => {
    // not in used
  }, [])

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'thelinko');
    formData.append('cloud_name', `${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
    formData.append('folder', 'linko');

    const response2 = await fetch(`https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    if (response2.ok) {
      const data = await response2.json();
      setImage(data.secure_url);
    } else {
      console.error('Upload failed:', response2.statusText);
    }
  }

  return (
    <>
      <div className="bg-black text-white">
        <form onSubmit={submit}>

        </form>
      </div>
    </>

  )
}

export default Home
