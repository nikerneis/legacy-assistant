"use client"

import { useEffect, useState } from "react"

interface CaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
}

export function Captcha({ onVerify, onError }: CaptchaProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load hCaptcha script
    if (!window.hcaptcha) {
      const script = document.createElement("script")
      script.src = "https://js.hcaptcha.com/1/api.js"
      script.async = true
      script.defer = true
      script.onload = () => setLoaded(true)
      document.body.appendChild(script)
    } else {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded && window.hcaptcha) {
      const handleCaptchaChange = (token: string) => {
        if (token) {
          onVerify(token)
        }
      }

      // Initialize hCaptcha container
      const container = document.getElementById("h-captcha")
      if (container && container.childNodes.length === 0) {
        window.hcaptcha.render("h-captcha", {
          sitekey: "10000000-ffff-ffff-ffff-000000000001", // Test key
          theme: "light",
          callback: handleCaptchaChange,
        })
      }
    }
  }, [loaded, onVerify])

  return (
    <div id="h-captcha" className="flex justify-center mb-4">
      {!loaded && <p className="text-sm text-muted-foreground">Loading CAPTCHA...</p>}
    </div>
  )
}
