"use client"
import React from 'react'
import { useState } from 'react'

const Home = () => {

  const [image, setImage] = useState('');
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [isInputVisible, setIsInputVisible] = useState(true);
  const [showurl, setshowurl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('START UPLOADING');
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(image);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000); // Reset copied state after 2 seconds
  };

  const submit = async (e) => {
    e.preventDefault();

    setUploading(true);
    setUploadMessage('UPLOADING...');

    // Simulate the upload process for 5 seconds (replace with your actual upload logic)
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setUploadMessage('UPLOAD SUCCESSFUL');
      setshowurl(true);
      setIsInputVisible(false);
    }, 10000);
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
      {/* laptop  */}
      <div className="md:block hidden bg-black text-white" style={{
        backgroundImage: `url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}>
        {/* Your content */}
        <div className="flex flex-col justify-center items-center pt-10 md:pt-20">

          {/* Your existing content */}
          <div className="flex flex-col justify-center items-center pt-10 md:pt-20">

            <div className="font-bold text-5xl md:text-6xl lg:text-7xl text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
              Drippify
            </div>

            <div className="font-bold text-lg font-mono mt-4 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
              Upload and share your images.
            </div>

            <div className="max-w-xl my-6 flex flex-col justify-center items-center">

              {/* image  */}
              <div className="pt-8">
                <div className="flex flex-col space-x-4">
                  {isInputVisible && image && (
                    <img src={createObjectURL} className='rounded-3xl mb-4' />
                  )}

                  {isInputVisible && (
                    <div className="flex flex-col items-center mt-4">
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setImage(file);
                          setCreateObjectURL(URL.createObjectURL(file));
                          setUploadButtonDisabled(!file);
                        }}
                      />
                      {!image && (
                        <label
                          htmlFor="file-upload"
                          className="bg-sky-500 cursor-pointer hover:scale-105 text-base font-semibold font-mono px-8 p-2 rounded-full text-white"
                        >
                          SELECT FILE...
                        </label>
                      )}
                    </div>
                  )}

                  {isInputVisible && image && (
                    <button
                      className={`bg-sky-500 text-lg font-semibold font-mono px-4 p-2 rounded-full text-white ${uploadSuccess ? 'bg-green-500' : ''}`}
                      onClick={uploadSuccess ? null : submit}
                      disabled={uploading || uploadButtonDisabled}
                    >
                      {uploadMessage}
                    </button>
                  )}

                </div>
              </div>

              {showurl && (
                <>
                  <div className="mt-8 font-mono">
                    <div className='text-green-500'>
                      <span className='flex flex-row justify-center text-center'>Thank you for choosing Drippify <br /> we're excited to have you in our community!</span>
                    </div>
                  </div>
                  <div className="mt-4 font-mono">
                    <div className='text-green-500'>
                      <a target='_blank' className='text-sky-500 decoration-sky-500 underline' href={image}>Click here!</a>
                      &nbsp; - <span className=''>to redirect</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row justify-end">
                      <button
                        className={`text-white font-mono ${copied ? "text-sky-500 " : "bg-sky-500"} rounded-full text-base px-4 py-1 font-bold mt-8`}
                        onClick={copyToClipboard}
                      >
                        {copied ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* mobile  */}
      <div className="md:hidden block bg-black text-white pt-8 h-screen" style={{
        backgroundImage: `url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Make the div fill the entire viewport height
      }}>
        {/* Your content */}
        <div className="flex flex-col justify-center items-center pt-10 md:pt-20">
          <div className="flex flex-col justify-center items-center pt-10 md:pt-20">

            <div className="font-bold text-5xl md:text-6xl lg:text-7xl text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
              Drippify
            </div>

            <div className="font-bold text-lg font-mono mt-4 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
              Upload and share your images.
            </div>

            <div className="max-w-xl my-6 flex flex-col justify-center items-center">

              {/* image  */}
              <div className="pt-8">
                <div className="flex flex-col space-x-4">
                  {isInputVisible && image && (
                    <img src={createObjectURL} className='rounded-3xl mb-4' />
                  )}

                  {isInputVisible && (
                    <div className="flex flex-col items-center mt-4">
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setImage(file);
                          setCreateObjectURL(URL.createObjectURL(file));
                          setUploadButtonDisabled(!file);
                        }}
                      />
                      {!image && (
                        <label
                          htmlFor="file-upload"
                          className="bg-sky-500 cursor-pointer hover:scale-105 text-base font-semibold font-mono px-8 p-2 rounded-full text-white"
                        >
                          SELECT FILE...
                        </label>
                      )}
                    </div>
                  )}

                  {isInputVisible && image && (
                    <button
                      className={`bg-sky-500 text-lg font-semibold font-mono px-4 p-2 rounded-full text-white ${uploadSuccess ? 'bg-green-500' : ''}`}
                      onClick={uploadSuccess ? null : submit}
                      disabled={uploading || uploadButtonDisabled}
                    >
                      {uploadMessage}
                    </button>
                  )}

                </div>
              </div>

              {showurl && (
                <>
                  <div className="mt-8 font-mono">
                    <div className='text-green-500'>
                      <span className='flex flex-row justify-center text-center'>Thank you for choosing Drippify <br /> we're excited to have you in our community!</span>
                    </div>
                  </div>
                  <div className="mt-4 font-mono">
                    <div className='text-green-500'>
                      <a target='_blank' className='text-sky-500 decoration-sky-500 underline' href={image}>Click here!</a>
                      &nbsp; - <span className=''>to redirect</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-row justify-end">
                      <button
                        className={`text-white font-mono ${copied ? "text-sky-500 " : "bg-sky-500"} rounded-full text-base px-4 py-1 font-bold mt-8`}
                        onClick={copyToClipboard}
                      >
                        {copied ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Home