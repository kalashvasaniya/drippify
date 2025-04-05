"use client";
import React, { useState, useCallback } from "react";
import Head from "next/head";

const Home = () => {
  const [image, setImage] = useState("");
  const [previewURL, setPreviewURL] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [showURL, setShowURL] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("START UPLOADING");
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(image);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  }, [image]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
      setUploadButtonDisabled(false);
    }
  }, []);

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadMessage("UPLOADING...");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "thelinko");
    formData.append("cloud_name", "dwb211sw5");
    formData.append("folder", "linko");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwb211sw5/image/upload",
        { method: "POST", body: formData }
      );
      if (response.ok) {
        const data = await response.json();
        setImage(data.secure_url);
        setUploadSuccess(true);
        setUploadMessage("UPLOAD SUCCESSFUL");
        setShowURL(true);
        setIsInputVisible(false);
      } else {
        console.error("Upload failed:", response.statusText);
        setUploadMessage("UPLOAD FAILED");
      }
    } catch (err) {
      console.error("Error during upload:", err);
      setUploadMessage("UPLOAD FAILED");
    } finally {
      setUploading(false);
    }
  }, [image]);

  // Helper render function for common UI (desktop/mobile)
  const renderContent = () => (
    <div className="flex flex-col justify-center items-center pt-10 md:pt-20">
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Drippify
      </h1>
      <p className="font-bold text-lg font-mono mt-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Upload and share your images.
      </p>
      <div className="max-w-xl my-6 flex flex-col justify-center items-center">
        <div className="pt-8">
          <div className="flex flex-col items-center space-y-4">
            {isInputVisible && previewURL && (
              <img src={previewURL} alt="Preview" className="rounded-3xl mb-4" />
            )}
            {isInputVisible && (
              <div className="flex flex-col items-center">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
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
                className={`bg-sky-500 text-lg font-semibold font-mono px-4 p-2 rounded-full text-white ${uploadSuccess ? "bg-green-500" : ""
                  }`}
                onClick={uploadSuccess ? undefined : submit}
                disabled={uploading || uploadButtonDisabled}
              >
                {uploadMessage}
              </button>
            )}
          </div>
        </div>

        {showURL && (
          <>
            <div className="mt-8 font-mono text-center text-white">
              Thank you for choosing Drippify
              <br />
              <span>
                We're excited to have you in our{" "}
                <a
                  href="https://www.thepairup.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  Community
                </a>
                !
              </span>
            </div>
            <div className="mt-4 font-mono text-center text-white">
              <a
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline"
              >
                Click here!
              </a>{" "}
              - to redirect
            </div>
            <div className="flex flex-row justify-end w-full mt-8">
              <button
                className={`font-mono rounded-full text-base px-4 py-1 font-bold ${copied ? "text-sky-500" : "bg-sky-500 text-white"
                  }`}
                onClick={copyToClipboard}
              >
                {copied ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Drippify | Image/PDF to URL</title>
        <meta
          name="description"
          content="Drippify converts any image/PDF file into a shareable public link (For Free)"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://drippify.example.com" />
        {/* Add other SEO meta tags as needed */}
      </Head>

      {/* Desktop View */}
      <div
        className="hidden md:block bg-black text-white"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        {/* Preloaded hidden iframe for performance */}
        <iframe
          className="hidden"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/yV2HyFC_gwo?autoplay=1&mute=1&si=u2KeHfwTe3vgwFmt"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        {renderContent()}
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden bg-black text-white h-screen pt-8"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <iframe
          className="hidden"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/yV2HyFC_gwo?autoplay=1&mute=1&si=u2KeHfwTe3vgwFmt"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        {renderContent()}
      </div>
    </>
  );
};

export default Home;
