"use client"
import React from "react"
import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Loader2, Copy, Check, Upload, FileUp } from "lucide-react"

export default function Home() {
  const [image, setImage] = useState<File | string>("")
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [showURL, setShowURL] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("START UPLOADING")
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState("")

  const copyToClipboard = useCallback(() => {
    if (typeof image === "string") {
      navigator.clipboard.writeText(image)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }, [image])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewURL(objectUrl)
      setUploadButtonDisabled(false)

      // Clean up the object URL when component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [])

  const submit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!image || typeof image === "string") return

      setUploading(true)
      setUploadMessage("UPLOADING...")

      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", "thelinko")
      formData.append("cloud_name", "dwb211sw5")
      formData.append("folder", "linko")

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dwb211sw5/image/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setImageUrl(data.secure_url)
          setImage(data.secure_url)
          setUploadSuccess(true)
          setUploadMessage("UPLOAD SUCCESSFUL")
          setShowURL(true)
          setIsInputVisible(false)
        } else {
          console.error("Upload failed:", response.statusText)
          setUploadMessage("UPLOAD FAILED")
        }
      } catch (err) {
        console.error("Error during upload:", err)
        setUploadMessage("UPLOAD FAILED")
      } finally {
        setUploading(false)
      }
    },
    [image],
  )

  // Helper render function for common UI (desktop/mobile)
  const renderContent = () => (
    <div className="flex flex-col justify-center items-center pt-10 md:pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Drippify
      </h1>
      <p className="font-bold text-lg font-mono mt-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Upload and share your images.
      </p>
      <div className="w-full max-w-xl my-6 flex flex-col justify-center items-center">
        <div className="pt-8 w-full">
          <div className="flex flex-col items-center space-y-4 w-full">
            {isInputVisible && previewURL && (
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-3xl overflow-hidden">
                <Image src={previewURL || "/placeholder.svg"} alt="Preview" fill className="object-contain" priority />
              </div>
            )}

            {isInputVisible && (
              <div className="flex flex-col items-center">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
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

            {isInputVisible && image && (
              <button
                className={`${
                  uploadSuccess ? "bg-green-500" : uploading ? "bg-sky-700" : "bg-sky-500 hover:bg-sky-600"
                } transition-colors duration-200 text-lg font-semibold font-mono px-6 py-2 rounded-full text-white flex items-center gap-2`}
                onClick={uploadSuccess ? undefined : submit}
                disabled={uploading || uploadButtonDisabled}
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

        {showURL && (
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
                href={typeof image === "string" ? image : ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline transition-colors"
              >
                Click here!
              </a>{" "}
              - to redirect
            </div>

            <div className="mt-6 w-full">
              <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between w-full overflow-hidden">
                <div className="truncate text-gray-300 text-sm">{typeof image === "string" ? image : ""}</div>
                <button
                  className={`ml-2 flex-shrink-0 ${
                    copied ? "text-green-500" : "text-sky-500 hover:text-sky-400"
                  } transition-colors duration-200`}
                  onClick={copyToClipboard}
                  aria-label="Copy URL to clipboard"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <main>
      {/* Desktop View */}
      <div
        className="hidden md:block bg-black text-white min-h-screen"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {renderContent()}
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden bg-black text-white min-h-screen"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {renderContent()}
      </div>
    </main>
  )
}

