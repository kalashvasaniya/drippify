"use client"
import React from "react";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Loader2, Copy, Check, Upload, FileUp } from "lucide-react";

export default function Home() {
  // Removed type definitions from useState
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [showURL, setShowURL] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("START UPLOADING");
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null); // Removed type definition from useRef
  const [imageUrl, setImageUrl] = useState(null); // Or ""

  const copyToClipboard = useCallback(() => {
    if (typeof image === "string") {
      navigator.clipboard.writeText(image);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
    }
  }, [image]);

  const handleFileChange = useCallback((e) => { // Removed type annotation for event 'e'
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewURL(objectUrl);
      setUploadButtonDisabled(false);
      setUploadMessage("START UPLOADING"); // Reset message when new file selected
      setUploadSuccess(false); // Reset success state
      setShowURL(false); // Hide URL section if a new file is selected
      setIsInputVisible(true); // Ensure input area is visible

      // Clean up the object URL when component unmounts or when a new file is selected
      // This cleanup should happen when the effect dependencies change or component unmounts.
      // The return function from useCallback isn't the right place for side-effect cleanup based on file changes.
      // A useEffect hook would be better if complex cleanup is needed, but for simple revokeObjectURL,
      // doing it before setting a *new* previewURL is often sufficient. Let's revoke the *previous* one if it exists.

      // Revoke previous URL if it exists before setting a new one
      // (Self-contained within the handler is simpler here than useEffect)
      setPreviewURL(prevUrl => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return objectUrl; // Set the new URL
      });

    } else {
      // Optional: Handle case where user cancels file selection
      setImage(null);
      setPreviewURL(prevUrl => { // Revoke if one existed
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
      setUploadButtonDisabled(true);
    }
  }, []); // Removed state setters from dependencies as they are stable

  const submit = useCallback(
    async (e) => { // Removed type annotation for event 'e'
      e.preventDefault();
      // Ensure image is a File object before proceeding
      if (!image || typeof image === "string") return;

      setUploading(true);
      setUploadMessage("UPLOADING...");
      setUploadButtonDisabled(true); // Disable button during upload

      const formData = new FormData();
      formData.append("file", image); // image is guaranteed to be File here

      // IMPORTANT: Use Environment Variables for sensitive data like cloud name and presets!
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "thelinko"); // Replace "thelinko" with default or error if var missing
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwb211sw5");   // Replace "dwb211sw5"
      formData.append("folder", "linko"); // Folder name is usually less sensitive

      // Construct URL using environment variable if available
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwb211sw5";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        }
        );

        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.secure_url);
          setImage(data.secure_url); // Update state to the URL string
          setUploadSuccess(true);
          setUploadMessage("UPLOAD SUCCESSFUL");
          setShowURL(true);
          setIsInputVisible(false); // Hide preview/upload button section
          setPreviewURL(prevUrl => { // Revoke the preview URL, no longer needed
            if (prevUrl) {
              URL.revokeObjectURL(prevUrl);
            }
            return null;
          });
        } else {
          console.error("Upload failed:", response.statusText);
          const errorData = await response.text(); // Get more error details
          console.error("Error response:", errorData);
          setUploadMessage("UPLOAD FAILED");
          setUploadSuccess(false); // Ensure success state is false
        }
      } catch (err) {
        console.error("Error during upload:", err);
        setUploadMessage("UPLOAD FAILED");
        setUploadSuccess(false); // Ensure success state is false
      } finally {
        setUploading(false);
        // Re-enable button only on failure to allow retry
        if (!uploadSuccess) {
          setUploadButtonDisabled(false);
        }
      }
    },
    [image] // Keep image dependency
  );

  // Helper render function for common UI (desktop/mobile)
  const renderContent = () => (
    <div className="flex flex-col justify-center items-center pt-10 md:pt-20 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Drippify
      </h1>
      <p className="font-bold text-lg font-mono mt-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Upload and share your images.
      </p>

      {/* Upload Area */}
      <div className="w-full max-w-xl my-6 flex flex-col justify-center items-center">
        <div className="pt-8 w-full">
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Preview Image */}
            {isInputVisible && previewURL && (
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-3xl overflow-hidden border border-gray-700">
                {/* Note: 'layout' and 'objectFit' are deprecated in newer Next.js Image. Use style or className. */}
                <Image
                  src={previewURL}
                  alt="Preview"
                  fill // Use fill and style the parent
                  style={{ objectFit: 'contain' }} // Use style for objectFit
                  priority />
              </div>
            )}

            {/* File Input & Select Button */}
            {isInputVisible && (
              <div className="flex flex-col items-center mt-4"> {/* Added margin top */}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {/* Show Select File only if no image is selected yet */}
                {!image && (
                  <label
                    htmlFor="file-upload"
                    className="bg-sky-500 cursor-pointer hover:scale-105 transition-transform duration-200 text-base font-semibold font-mono px-8 py-2 rounded-full text-white flex items-center gap-2"
                  >
                    <FileUp size={18} />
                    SELECT FILE...
                  </label>
                )}
              </div>
            )}

            {/* Upload/Status Button */}
            {/* Show this button only if an image File is selected (not null, not string) */}
            {isInputVisible && image && typeof image !== 'string' && (
              <button
                className={`${uploadSuccess ? "bg-green-500 cursor-not-allowed" : uploading ? "bg-sky-700 cursor-wait" : "bg-sky-500 hover:bg-sky-600"
                  } transition-colors duration-200 text-lg font-semibold font-mono px-6 py-2 rounded-full text-white flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4`}
                onClick={submit} // Removed conditional logic, handled by disabled state
                disabled={uploading || uploadSuccess || uploadButtonDisabled} // Disable if uploading, successful, or explicitly disabled
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {uploadMessage}
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={18} />
                    {uploadMessage}
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    {uploadMessage}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Result URL Section */}
        {showURL && typeof image === 'string' && ( // Ensure image is string (URL)
          <div className="mt-8 w-full">
            <div className="font-mono text-center text-white">
              Thank you for choosing Drippify
              <br />
              <span>
                We're excited to have you in our{" "}
                <a
                  href="https://www.thepairup.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline transition-colors"
                >
                  Community
                </a>
                !
              </span>
            </div>

            <div className="mt-4 font-mono text-center text-white">
              <a
                href={image} // Use image directly as it's the URL string now
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline transition-colors"
              >
                Click here!
              </a>{" "}
              - to view your image
            </div>

            <div className="mt-6 w-full">
              <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between w-full overflow-hidden">
                <div className="truncate text-gray-300 text-sm pr-2">{image}</div> {/* Added padding right */}
                <button
                  className={`ml-2 flex-shrink-0 ${copied ? "text-green-500" : "text-sky-500 hover:text-sky-400"
                    } transition-colors duration-200`}
                  onClick={copyToClipboard}
                  aria-label="Copy URL to clipboard"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Add button to upload another image */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setImage(null);
                  setPreviewURL(prevUrl => { // Also revoke URL on reset
                    if (prevUrl) {
                      URL.revokeObjectURL(prevUrl);
                    }
                    return null;
                  });
                  setShowURL(false);
                  setIsInputVisible(true);
                  setUploadSuccess(false);
                  setUploadMessage("START UPLOADING");
                  setUploadButtonDisabled(true);
                  setCopied(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset file input
                  }
                }}
                className="bg-gray-600 hover:bg-gray-500 transition-colors duration-200 text-base font-semibold font-mono px-6 py-2 rounded-full text-white flex items-center gap-2 mx-auto"
              >
                <Upload size={18} /> Upload Another
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );

  // Main return remains the same
  return (
    <main>
      {/* Desktop View */}
      <div
        className="hidden md:block bg-black text-white min-h-screen bg-cover bg-center" // Simplified background props
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')",
        }}
      >
        {renderContent()}
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden bg-black text-white min-h-screen bg-cover bg-center" // Simplified background props
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')",
        }}
      >
        {renderContent()}
      </div>
    </main>
  );
}