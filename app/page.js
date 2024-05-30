"use client"
import React from 'react'
import { useState } from 'react'

const Home = () => {
  const [image, setImage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'thelinko');
    formData.append('cloud_name', `dwb211sw5`);
    formData.append('folder', 'linko');

    const response2 = await fetch(`https://api.cloudinary.com/v1_1/dwb211sw5/image/upload`, {
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
          Hello
        </form>

        {/* Link of the post */}
        <div className="text-white"></div>
      </div>
    </>

  )
}

export default Home
