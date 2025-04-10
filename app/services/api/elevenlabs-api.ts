import axios from "axios"
import { Platform } from "react-native"

// Define environment variables as constants for now
// In production, these should come from a secure source
const ELEVENLABS_API_KEY = "your_elevenlabs_api_key" // Replace with your actual key in production
const ELEVENLABS_VOICE_ID = "your_elevenlabs_voice_id" // Replace with your actual voice ID in production
const N8N_WEBHOOK_URL = "your_n8n_webhook_url_here" // Replace with your actual webhook URL in production
const AGENT_ID = "8UFLK0pIqEgO0bbnTyfm" // This seems to be a constant in your code

// Define interfaces for better type safety
interface ConversationEntry {
  role: "user" | "assistant"
  content: string
}

interface N8nResponseData {
  url: string
  status: string
  message?: string
}

interface ErrorResponseData {
  detail?: string
  message?: string
}

interface ConversationResult {
  success: boolean
  data?: N8nResponseData
  error?: string
}

// Create an axios instance with default headers
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "xi-api-key": ELEVENLABS_API_KEY,
    "User-Agent": `GraceAssistant/1.0.0 (${Platform.OS})`,
  },
})

export const elevenLabsApi = {
  getSignedUrl: async (text: string): Promise<string | null> => {
    try {
      const response = await axiosInstance.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        { responseType: "arraybuffer" }
      )

      return URL.createObjectURL(new Blob([response.data as ArrayBuffer]))
    } catch (error) {
      console.error("Error getting signed URL:", error)
      return null
    }
  },

  processWithN8n: async (conversation: ConversationEntry[]): Promise<ConversationResult> => {
    try {
      const response = await axios.post<N8nResponseData>(N8N_WEBHOOK_URL, {
        conversation,
        agentID: AGENT_ID,
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      let errorMessage = "Unknown error occurred"

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      console.error("N8n API error:", errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}
