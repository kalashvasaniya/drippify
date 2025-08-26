"use client"
import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Loader2, Copy, Check, Upload, FileUp } from "lucide-react"

export default function Home() {
  const [image, setImage] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [showURL, setShowURL] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("START UPLOADING")
  const [uploadButtonDisabled, setUploadButtonDisabled] = useState(true)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [selectedFileType, setSelectedFileType] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const copyToClipboard = useCallback(() => {
    if (typeof image === "string") {
      navigator.clipboard.writeText(image)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }, [image])

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      setErrorMessage("")
      const MAX_SIZE = 500 * 1024 * 1024 // 500MB
      if (file) {
        if (file.size > MAX_SIZE) {
          setErrorMessage("File is larger than 500MB. Please choose a smaller file.")
          setImage(null)
          if (previewURL) {
            URL.revokeObjectURL(previewURL)
            setPreviewURL(null)
          }
          setSelectedFileType(null)
          setSelectedFileName(null)
          setUploadButtonDisabled(true)
          return
        }

        setImage(file)
        setSelectedFileType(file.type || "application/octet-stream")
        setSelectedFileName(file.name || null)

        let objectUrl = null
        if (file.type?.startsWith("image/") || file.type?.startsWith("video/")) {
          objectUrl = URL.createObjectURL(file)
        }

        if (previewURL) {
          URL.revokeObjectURL(previewURL)
        }

        setPreviewURL(objectUrl)
        setUploadButtonDisabled(false)
        setUploadMessage("START UPLOADING")
        setUploadSuccess(false)
        setShowURL(false)
        setIsInputVisible(true)
      } else {
        setImage(null)
        if (previewURL) {
          URL.revokeObjectURL(previewURL)
          setPreviewURL(null)
        }
        setSelectedFileType(null)
        setSelectedFileName(null)
        setUploadButtonDisabled(true)
      }
    },
    [previewURL],
  )

  const submit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!image || typeof image === "string") return

      setUploading(true)
      setUploadMessage("UPLOADING...")
      setUploadButtonDisabled(true)

      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "thelinko")
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwb211sw5")
      formData.append("folder", "linko")

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwb211sw5"
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

      try {
        const response = await fetch(uploadUrl, {
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

          // Revoke the preview URL, no longer needed
          if (previewURL) {
            URL.revokeObjectURL(previewURL)
            setPreviewURL(null)
          }
        } else {
          console.error("Upload failed:", response.statusText)
          const errorData = await response.text()
          console.error("Error response:", errorData)
          setUploadMessage("UPLOAD FAILED")
          setUploadSuccess(false)
        }
      } catch (err) {
        console.error("Error during upload:", err)
        setUploadMessage("UPLOAD FAILED")
        setUploadSuccess(false)
      } finally {
        setUploading(false)
        if (!uploadSuccess) {
          setUploadButtonDisabled(false)
        }
      }
    },
    [image, previewURL, uploadSuccess],
  )

  // Helper render function for common UI (desktop/mobile)
  const renderContent = () => (
    <div className="flex flex-col justify-center items-center pt-10 md:pt-20 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Drippify
      </h1>
      <p className="font-bold text-lg font-mono mt-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-500">
        Upload and share your files.
      </p>

      {/* Upload Area */}
      <div className="w-full max-w-xl my-6 flex flex-col justify-center items-center">
        <div className="pt-8 w-full">
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Preview (image/video) */}
            {isInputVisible && previewURL && (
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-3xl overflow-hidden border border-gray-700 flex items-center justify-center bg-black/40">
                {selectedFileType?.startsWith("video/") ? (
                  <video src={previewURL} controls className="w-full h-full object-contain" />
                ) : (
                  <Image
                    src={previewURL || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    crossOrigin="anonymous"
                  />
                )}
              </div>
            )}
            {/* Non-previewable file information */}
            {isInputVisible && !previewURL && image && typeof image !== "string" && (
              <div className="w-full max-w-md rounded-3xl overflow-hidden border border-gray-700 p-4 text-center text-gray-200 bg-black/40">
                <div className="text-sm">Selected file:</div>
                <div className="font-mono text-xs mt-1 break-all">{selectedFileName}</div>
              </div>
            )}

            {/* File Input & Select Button */}
            {isInputVisible && (
              <div className="flex flex-col items-center mt-4">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="*/*"
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
            {isInputVisible && image && typeof image !== "string" && (
              <button
                className={`${uploadSuccess
                  ? "bg-green-500 cursor-not-allowed"
                  : uploading
                    ? "bg-sky-700 cursor-wait"
                    : "bg-sky-500 hover:bg-sky-600"
                  } transition-colors duration-200 text-lg font-semibold font-mono px-6 py-2 rounded-full text-white flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4`}
                onClick={submit}
                disabled={uploading || uploadSuccess || uploadButtonDisabled}
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
            {errorMessage && (
              <div className="text-red-400 text-sm mt-2 text-center max-w-md">{errorMessage}</div>
            )}
          </div>
        </div>

        {/* Result URL Section */}
        {showURL && typeof image === "string" && (
          <div className="mt-8 w-full">
            {/* <div className="font-mono text-center text-white">
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
            </div> */}

            <div className="mt-4 font-mono text-center text-white">
              <a
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline transition-colors"
              >
                Click here!
              </a>{" "}
              - to view your file
            </div>

            <div className="mt-6 w-full">
              <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between w-full overflow-hidden">
                <div className="truncate text-gray-300 text-sm pr-2">{image}</div>
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
                  setImage(null)
                  if (previewURL) {
                    URL.revokeObjectURL(previewURL)
                    setPreviewURL(null)
                  }
                  setShowURL(false)
                  setIsInputVisible(true)
                  setUploadSuccess(false)
                  setUploadMessage("START UPLOADING")
                  setUploadButtonDisabled(true)
                  setCopied(false)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
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
  )

  return (
    <main>
      {/* Desktop View */}
      <div
        className="hidden md:block bg-black text-white min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg')",
        }}
      >
        {renderContent()}
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden bg-black text-white min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dwb211sw5/image/upload/v1717164369/linko/azztvkmxxg4pxduzwch9.jpg')",
        }}
      >
        {renderContent()}
      </div>
    </main>
  )
}
