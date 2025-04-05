"use client"; // Required for hooks and browser APIs

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Loader2, Copy, Check, Upload, FileUp } from "lucide-react";

export default function Home() {
  // State variables
  // 'image' holds the File object before upload, or the Cloudinary URL string after upload
  const [image, setImage] = useState < File | string | null > (null);
  // 'previewURL' holds the temporary blob URL for the selected file preview
  const [previewURL, setPreviewURL] = useState < string | null > (null);
  // 'isInputVisible' controls visibility of the file selection/preview/upload button area
  const [isInputVisible, setIsInputVisible] = useState(true);
  // 'showURL' controls visibility of the result section (URL, copy button)
  const [showURL, setShowURL] = useState(false);
  // 'uploading' indicates if an upload is in progress
  const [uploading, setUploading] = useState(false);
  // 'uploadSuccess' indicates if the last upload was successful
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // 'uploadMessage' displays status messages on the upload button
  const [uploadMessage, setUploadMessage] = useState("START UPLOADING");
  // 'copied' indicates if the URL has been copied to the clipboard
  const [copied, setCopied] = useState(false);
  // Ref for the hidden file input element
  const fileInputRef = useRef < HTMLInputElement > (null);

  // --- Callbacks ---

  // Function to copy the uploaded image URL to clipboard
  const copyToClipboard = useCallback(() => {
    // Ensure 'image' is the URL string before copying
    if (typeof image === "string") {
      navigator.clipboard.writeText(image);
      setCopied(true);
      // Reset the copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    }
  }, [image]); // Dependency: image state

  // Function to handle file selection from the input
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Set state to the selected File object

      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);

      // Set the preview URL, revoking the previous one if it exists
      setPreviewURL(prevUrl => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl); // Clean up previous blob URL
        }
        return objectUrl; // Set the new blob URL
      });

      // Reset states for a new upload attempt
      setUploadMessage("START UPLOADING");
      setUploadSuccess(false);
      setShowURL(false); // Hide result section
      setIsInputVisible(true); // Ensure input section is visible
      setCopied(false); // Reset copy status

    } else {
      // Handle case where user cancels file selection
      setImage(null);
      setPreviewURL(prevUrl => { // Revoke if a preview URL existed
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
      // Reset relevant states
      setUploadMessage("START UPLOADING");
      setUploadSuccess(false);
    }
  }, []); // No dependencies needed as state setters are stable

  // Function to submit the image file to Cloudinary
  const submit = useCallback(async (e) => {
    e.preventDefault();
    // Guard against non-file image state or no image
    if (!image || typeof image !== 'object' || !(image instanceof File)) return;

    setUploading(true);
    setUploadMessage("UPLOADING...");
    setUploadSuccess(false); // Ensure success state is false initially

    const formData = new FormData();
    formData.append("file", image); // Append the File object

    // Append Cloudinary configuration - **Use Environment Variables**
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const folder = "linko"; // Optional: Specify a folder in Cloudinary

    if (!uploadPreset || !cloudName) {
      console.error("Cloudinary environment variables (NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) are not set!");
      setUploadMessage("CONFIG ERROR");
      setUploading(false);
      return;
    }

    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("folder", folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      }
      );

      if (response.ok) {
        const data = await response.json();
        // IMPORTANT: Update 'image' state to the returned URL string
        setImage(data.secure_url);
        setUploadSuccess(true);
        setUploadMessage("UPLOAD SUCCESSFUL");
        setShowURL(true); // Show the result section
        setIsInputVisible(false); // Hide the input/preview section
        setPreviewURL(prevUrl => { // Revoke the preview URL, no longer needed
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return null;
        });
      } else {
        // Handle upload failure
        console.error("Upload failed:", response.status, response.statusText);
        try {
          const errorData = await response.json(); // Try to parse Cloudinary error
          console.error("Cloudinary error response:", errorData);
          setUploadMessage(`UPLOAD FAILED: ${errorData?.error?.message || response.statusText}`);
        } catch {
          setUploadMessage("UPLOAD FAILED"); // Fallback error message
        }
        setUploadSuccess(false);
      }
    } catch (err) {
      // Handle network or other errors during fetch
      console.error("Error during upload:", err);
      setUploadMessage("NETWORK ERROR");
      setUploadSuccess(false);
    } finally {
      // Reset loading state regardless of outcome
      setUploading(false);
    }
  },
    [image] // Dependency: image state (the File object)
  );

  // Function to reset the component state to allow another upload
  const resetState = useCallback(() => {
    setImage(null);
    setPreviewURL(prevUrl => { // Clean up preview URL
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
    setShowURL(false);
    setIsInputVisible(true);
    setUploadSuccess(false);
    setUploadMessage("START UPLOADING");
    setCopied(false);
    // Reset the file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []); // No dependencies needed

  // --- Derived State ---

  // Determine if the main upload button should be disabled
  const uploadButtonDisabled =
    !image || typeof image === "string" || uploading; // Disabled if no file, already uploaded (string URL), or currently uploading

  // --- Render Logic ---

  // Helper function to render the main content (consistent for mobile/desktop)
  const renderContent = () => (
    <div className="flex flex-col justify-center items-center pt-10 md:pt-20 px-4 max-w-4xl mx-auto text-center">
      {/* Header */}
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Drippify
      </h1>
      <p className="font-bold text-lg font-mono mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Upload and share your images instantly.
      </p>

      {/* Main Interaction Area */}
      <div className="w-full max-w-xl my-6 flex flex-col justify-center items-center">

        {/* Input Section: Visible before successful upload */}
        {isInputVisible && (
          <div className="pt-8 w-full flex flex-col items-center space-y-4">
            {/* Preview Image: Visible when a file is selected */}
            {previewURL && (
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-3xl overflow-hidden border border-gray-700 mb-4">
                <Image
                  src={previewURL}
                  alt="Selected file preview"
                  fill // Use fill layout
                  style={{ objectFit: 'contain' }} // Control how image fits
                  priority={false} // Preloading likely not needed for user uploads
                />
              </div>
            )}

            {/* File Input Trigger & Upload Button */}
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Hidden actual file input */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif, image/webp" // Be specific about accepted types
                disabled={uploading} // Disable input while uploading
              />

              {/* Show "SELECT FILE" only if no file is selected */}
              {!image && (
                <label
                  htmlFor="file-upload"
                  className="bg-sky-500 cursor-pointer hover:scale-105 transition-transform duration-200 text-base font-semibold font-mono px-8 py-2 rounded-full text-white flex items-center gap-2"
                >
                  <FileUp size={18} />
                  SELECT FILE...
                </label>
              )}

              {/* Show Upload/Status Button only if a file is selected (and not yet uploaded) */}
              {image && typeof image !== 'string' && (
                <button
                  className={`${uploadSuccess ? "bg-green-500 cursor-not-allowed" : // Success state (button remains briefly visible then area hides)
                    uploading ? "bg-sky-700 cursor-wait" : // Uploading state
                      "bg-sky-500 hover:bg-sky-600" // Default state
                    } transition-colors duration-200 text-lg font-semibold font-mono px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full max-w-xs`}
                  onClick={submit}
                  disabled={uploadButtonDisabled || uploadSuccess} // Disable if conditions met or success (before hiding)
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
        )}

        {/* Result Section: Visible after successful upload */}
        {showURL && typeof image === 'string' && ( // Ensure image is the URL string
          <div className="mt-8 w-full flex flex-col items-center space-y-4">
            <div className="font-mono text-center text-white">
              Thank you for choosing Drippify!
              <br />
              <span>
                We're excited to have you in our{" "}
                <a
                  href="https://www.thepairup.in" // Replace with actual community link if desired
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline transition-colors"
                >
                  Community
                </a>
                !
              </span>
            </div>

            {/* Link to view the image */}
            <div className="font-mono text-center text-white">
              <a
                href={image} // Use the URL string from state
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline transition-colors"
              >
                Click here to view your uploaded image
              </a>
            </div>

            {/* URL display and Copy Button */}
            <div className="mt-2 w-full max-w-md">
              <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between w-full overflow-hidden border border-gray-700">
                {/* Truncate URL display */}
                <span className="truncate text-gray-300 text-sm pr-2 font-mono">{image}</span>
                {/* Copy button */}
                <button
                  className={`ml-2 flex-shrink-0 p-1 rounded ${copied ? "text-green-500" : "text-sky-500 hover:text-sky-400"
                    } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-600`}
                  onClick={copyToClipboard}
                  aria-label="Copy URL to clipboard"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Button to upload another image */}
            <div className="text-center mt-6">
              <button
                onClick={resetState} // Call the reset function
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

  // --- Component Return ---
  // Renders two divs with different background images, controlled by Tailwind's responsive classes
  return (
    <main>
      {/* Desktop View */}
      <div
        className="hidden md:block bg-black text-white min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')", // Desktop background
        }}
      >
        {renderContent()}
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden bg-black text-white min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')", // Mobile background
        }}
      >
        {renderContent()}
      </div>
    </main>
  );
}