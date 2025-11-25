"use client"

import { useState, useEffect } from "react"

interface CreditsData {
  credits: number
  lastUpdated: string
}

export function useCredits() {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load credits from localStorage
    const loadCredits = () => {
      try {
        const stored = localStorage.getItem("legacoin_credits")
        if (stored) {
          const data: CreditsData = JSON.parse(stored)
          setCredits(data.credits)
        } else {
          // New user gets 5 free LEGACOIN
          setCredits(5)
          saveCredits(5)
        }
      } catch (error) {
        console.error("[v0] Error loading credits:", error)
        setCredits(5)
      } finally {
        setLoading(false)
      }
    }

    loadCredits()
  }, [])

  const saveCredits = (amount: number) => {
    try {
      const data: CreditsData = {
        credits: amount,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem("legacoin_credits", JSON.stringify(data))
      setCredits(amount)
    } catch (error) {
      console.error("[v0] Error saving credits:", error)
    }
  }

  const addCredits = async (amount: number) => {
    const newAmount = credits + amount
    saveCredits(newAmount)
  }

  const deductCredits = async (amount: number) => {
    if (credits >= amount) {
      const newAmount = credits - amount
      saveCredits(newAmount)
      return true
    }
    return false
  }

  return {
    credits,
    loading,
    addCredits,
    deductCredits,
  }
}
