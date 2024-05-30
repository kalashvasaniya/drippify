"use client"
import React from 'react'
import { useState } from 'react'


const Home = () => {

  const [image, setImage] = useState('');

  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);
  const [postMessage, setPostMessage] = useState('')
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [showurl, setshowurl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('Upload Image');
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);

  const submit = async (e) => {
    e.preventDefault();

    setUploading(true);
    setUploadMessage('Uploading...');

    // Simulate the upload process for 5 seconds (replace with your actual upload logic)
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setUploadMessage('Upload Successful');
      setshowurl(true);
    }, 5000);
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


  const handleSubmit = async (e, image) => {
    e.preventDefault();

    // if (!image) {
    //   alert('Please upload an image before submitting.');
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append('file', image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      console.log(json, "Hello");

      if (json.success) {
        setIsInputVisible(false);
        setSuccessMessage('Image uploaded');
        setPostMessage('Post Created Successfully');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-black text-white">

        <div className="flex flex-col justify-center items-center pb-52">

          <div className="text-4xl text-sky-400 pt-12 font-mono">
            Drippify
          </div>

          {postMessage && (
            <p className="text-green-400 md:text-xl text-lg py-4 font-bold underline underline-offset-1">{postMessage}</p>
          )}

          <div className="max-w-xl my-6 flex flex-col justify-center items-center bg-black">

            <form onSubmit={handleSubmit} className="flex flex-col bg-gray-800 rounded-xl">

              {/* image  */}
              <div className="pt-8 py-4">
                <div className="flex flex-col space-x-4">
                  {isInputVisible && image && (
                    <img src={createObjectURL} className='rounded-3xl mb-4' />
                  )}

                  {isInputVisible && (
                    <input
                      type="file"
                      onChange={(e) => {
                        setImage(e.target.files[0])
                        setCreateObjectURL(URL.createObjectURL(e.target.files[0]))
                        if (e.target.files.length > 0) {
                          setUploadButtonDisabled(false); // Enable the button
                        } else {
                          setUploadButtonDisabled(true); // Disable the button
                        }
                      }}
                    />
                  )}

                  {isInputVisible && (
                    <button
                      className={`bg-sky-500 text-lg px-4 p-2 rounded-full text-white ${uploadSuccess ? 'bg-green-500' : ''}`}
                      onClick={uploadSuccess ? null : submit}
                      disabled={uploading || uploadButtonDisabled}
                    >
                      {uploadMessage}
                    </button>
                  )}

                  {successMessage && (
                    <div className="text-green-500 mt-2">{successMessage}</div>
                  )}

                </div>
              </div>

              {showurl && (
                <div className="mt-4">
                  <p className="text-lg">Saved Image:</p>
                  <a href={image} target="_blank" rel="noopener noreferrer">{image}</a>
                </div>
              )}

              {/* Copy Link! */}
              <div>
                <div className="flex flex-row justify-end">
                  <button type="submit" className="hover:text-white text-sky-500 hover:bg-sky-500 rounded-full text-lg px-4 py-1 font-bold">
                    Copy Link!
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>

      </div>
    </>

  )
}

export default Home
