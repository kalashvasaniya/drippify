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
  const [uploadMessage, setUploadMessage] = useState('Upload Image');
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(image);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // Reset copied state after 2 seconds
  };

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
      <div className="bg-black text-white">

        <div className="flex flex-col justify-center items-center pt-10 md:pt-20">

          <div className="font-bold text-5xl md:text-6xl lg:text-7xl text-center md:text-left">
            Drippify
          </div>

          <div className="max-w-xl my-6 flex flex-col justify-center items-center bg-black">

            {/* image  */}
            <div className="pt-8">
              <div className="flex flex-col space-x-4">
                {isInputVisible && image && (
                  <img src={createObjectURL} className='rounded-3xl mb-4' />
                )}

                {isInputVisible && (
                  <input className='mt-4'
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

              </div>
            </div>

            {showurl && (
              <>
                <div className="mt-8">
                  <div className='text-green-500'>
                    <span className='flex flex-row justify-center text-center'>Thank you for choosing Drippify <br /> we're excited to have you in our community!</span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-row justify-end">
                    <button
                      className="text-white bg-sky-500 rounded-full text-lg px-4 py-1 font-bold mt-4"
                      onClick={copyToClipboard}
                    >
                      {copied ? 'Copied!' : 'Copy Link!'}
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </>

  )
}

export default Home