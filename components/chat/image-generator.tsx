"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageGenerator({ open, onOpenChange }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error("[v0] Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setPrompt("")
    setGeneratedImage(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Image</DialogTitle>
          <DialogDescription>Create an image from your text description</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Image Description</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at sunset..."
              disabled={isGenerating}
            />
          </div>

          {generatedImage ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border">
                <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="h-auto w-full" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setGeneratedImage(null)} variant="outline" className="flex-1">
                  Generate New
                </Button>
                <Button asChild className="flex-1">
                  <a href={generatedImage} download="generated-image.png">
                    Download
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="mr-2">🪄</span>
                  Generate Image
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
