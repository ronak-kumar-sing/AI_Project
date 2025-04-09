"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/UserContext"

export default function VideoChat() {
  const { currentUser } = useUser()
  const [isSearching, setIsSearching] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [partnerName, setPartnerName] = useState("")
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([])
  const [connectionTime, setConnectionTime] = useState(0)
  const [connectionTimer, setConnectionTimer] = useState<NodeJS.Timeout | null>(null)
  // New states for face verification
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  // Canvas reference for face verification
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start face verification process
  const startVerification = async () => {
    setIsVerifying(true)
    setVerificationMessage("Starting face verification...")

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // Audio not needed for verification
      })

      // Display local video during verification
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)
      }

      setVerificationMessage("Please look at the camera for face verification...")

      // Simulate verification process after 3 seconds
      setTimeout(() => {
        verifyFace(stream)
      }, 3000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsVerifying(false)
      setVerificationMessage("Could not access camera. Please check permissions.")
    }
  }

  // Verify face using the stream
  const verifyFace = async (stream: MediaStream) => {
    // Capture image from video stream
    if (localVideoRef.current && canvasRef.current) {
      const videoEl = localVideoRef.current
      const canvas = canvasRef.current
      canvas.width = videoEl.videoWidth
      canvas.height = videoEl.videoHeight
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)

        // In a real app, you would send this image to your verification API
        // For now, simulate a verification with 80% success rate
        const isSuccess = Math.random() < 0.8

        if (isSuccess) {
          setIsVerified(true)
          setVerificationMessage("Face verification successful!")
          // Keep stream open for the video chat
          setTimeout(() => {
            setIsVerifying(false)
            startSearching(stream) // Pass the existing stream
          }, 1000)
        } else {
          // Stop stream if verification fails
          stream.getTracks().forEach(track => track.stop())
          setLocalStream(null)
          setIsVerifying(false)
          setVerificationMessage("Face verification failed. Please try again.")
        }
      }
    }
  }

  // Simulate connection to another user
  const startSearching = async (existingStream?: MediaStream) => {
    setIsSearching(true)
    setMessage("Searching for available users...")

    try {
      let stream = existingStream

      if (!stream) {
        // Request camera and microphone access if we don't have a stream
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
      } else if (!stream.getAudioTracks().length) {
        // If we have a video-only stream from verification, add audio
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        // Add audio tracks to existing stream
        audioStream.getAudioTracks().forEach(track => {
          stream?.addTrack(track)
        })
      }

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)
      }

      // Simulate finding a partner after a random delay
      const searchTime = 2000 + Math.random() * 3000
      setTimeout(() => {
        const randomUsers = [
          "Alex",
          "Jordan",
          "Taylor",
          "Morgan",
          "Casey",
          "Riley",
          "Jamie",
          "Avery",
          "Quinn",
          "Skyler",
        ]
        const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)]
        setPartnerName(randomUser)
        setIsSearching(false)
        setIsConnected(true)
        setMessage(`Connected with ${randomUser}`)

        // Start connection timer
        const timer = setInterval(() => {
          setConnectionTime((prev) => prev + 1)
        }, 1000)
        setConnectionTimer(timer)

        // Add welcome message
        setMessages([
          {
            text: `Hi ${currentUser?.name}! Nice to meet you!`,
            sender: randomUser,
          },
        ])

        // Simulate remote video with a placeholder
        if (remoteVideoRef.current) {
          // In a real implementation, this would be the partner's stream
          remoteVideoRef.current.poster = `/placeholder.svg?height=480&width=640`
        }

        // Keep video and audio active - don't turn off camera after connecting
        // This leaves the camera on for the entire duration of the call
      }, searchTime)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsSearching(false)
      setMessage("Could not access camera or microphone. Please check permissions.")
    }
  }

  const endCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }

    // Reset state
    setIsConnected(false)
    setIsSearching(false)
    setPartnerName("")
    setMessages([])
    setMessage("")
    setConnectionTime(0)
    setIsVerified(false)

    // Clear timer
    if (connectionTimer) {
      clearInterval(connectionTimer)
      setConnectionTimer(null)
    }
  }

  const sendMessage = () => {
    if (messageInputRef.current && messageInputRef.current.value.trim()) {
      const newMessage = {
        text: messageInputRef.current.value,
        sender: currentUser?.name || "You",
      }

      setMessages((prev) => [...prev, newMessage])
      messageInputRef.current.value = ""

      // Simulate response after a short delay
      setTimeout(
        () => {
          const responses = [
            "That's interesting!",
            "I agree with you.",
            "Tell me more about that.",
            "How's your day going?",
            "What do you think about the weather today?",
            "Have you seen any good movies lately?",
          ]

          const randomResponse = {
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: partnerName,
          }

          setMessages((prev) => [...prev, randomResponse])
        },
        1000 + Math.random() * 2000,
      )
    }
  }

  // Format connection time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
      if (connectionTimer) {
        clearInterval(connectionTimer)
      }
    }
  }, [localStream, connectionTimer])

  return (
    <div className="mirror-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold gradient-text">Random Video Chat</h3>
        {isConnected && (
          <div className="flex items-center">
            <div className="mr-3 text-sm">
              <span className="text-green-400">●</span> Connected: {formatTime(connectionTime)}
            </div>
            <button
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
              onClick={endCall}
            >
              <i className="fas fa-phone-slash"></i>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video area */}
        <div className="space-y-4">
          <div className="relative bg-mirror-darker rounded-lg overflow-hidden aspect-video">
            {(isVerifying || isSearching || isConnected) ? (
              <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <i className="fas fa-video text-mirror-accent text-3xl mb-2"></i>
                  <p className="text-lg font-semibold">Your Video</p>
                  <p className="text-sm text-gray-300 mt-2">Verify face to enable camera</p>
                </div>
              </div>
            )}
            {isConnected && !localVideoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-center">
                  <i className="fas fa-video-slash text-red-500 text-3xl mb-2"></i>
                  <p className="text-white">Camera off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {currentUser?.name || "You"}
            </div>
          </div>

          <div className="relative bg-mirror-darker rounded-lg overflow-hidden aspect-video">
            {isConnected ? (
              <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <i className="fas fa-user-friends text-mirror-accent text-3xl mb-2"></i>
                  <p className="text-lg font-semibold">Partner Video</p>
                  <p className="text-sm text-gray-300 mt-2">
                    {isSearching ? "Searching for a partner..." : isVerifying ? "Complete verification first" : "Start verification to find someone"}
                  </p>
                </div>
              </div>
            )}
            {isConnected && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {partnerName}
              </div>
            )}
          </div>

          {!isConnected && !isSearching && !isVerifying && (
            <button
              className="w-full py-3 bg-mirror-accent rounded-lg text-white hover:bg-mirror-accent2 transition-all"
              onClick={startVerification}
            >
              <i className="fas fa-user-shield mr-2"></i>
              Verify Face to Start
            </button>
          )}

          {isVerifying && (
            <div className="text-center py-3 bg-mirror-darker rounded-lg">
              <div className="inline-block w-5 h-5 border-2 border-mirror-accent border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>{verificationMessage || "Verifying your face..."}</span>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-3 bg-mirror-darker rounded-lg">
              <div className="inline-block w-5 h-5 border-2 border-mirror-accent border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Searching for available users...</span>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex flex-col h-full">
          <div className="bg-mirror-darker rounded-lg p-4 flex-grow overflow-y-auto max-h-[300px] mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <i className="fas fa-comments text-2xl mb-2"></i>
                  <p>No messages yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === (currentUser?.name || "You") ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === (currentUser?.name || "You")
                        ? "bg-mirror-accent text-white"
                        : "bg-gray-700 text-white"
                        }`}
                    >
                      <div className="text-xs opacity-75 mb-1">{msg.sender}</div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex">
            <input
              ref={messageInputRef}
              type="text"
              className="flex-grow bg-mirror-darker border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:border-mirror-accent"
              placeholder={isConnected ? "Type a message..." : "Connect to start chatting"}
              disabled={!isConnected}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-mirror-accent text-white px-4 rounded-r-lg hover:bg-mirror-accent2 transition-all disabled:opacity-50"
              disabled={!isConnected}
              onClick={sendMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          {(message || verificationMessage) && (
            <div className="mt-3 text-center text-sm text-gray-400">
              {isVerifying ? verificationMessage : message}
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for face verification */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

