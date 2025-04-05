export const callGeminiAPI = async (prompt: string): Promise<string> => {
  const apiKey = 'AIzaSyCUWS9aINo_Bmb2FqJe1_GFOScsiHWQiJ0'
  if (!apiKey) {
    console.error("Gemini API key is missing. Please set the NEXT_PUBLIC_GEMINI_API_KEY environment variable.")
    return "Gemini API key is not configured."
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    })

    if (!response.ok) {
      console.error("Gemini API error:", response.status, response.statusText)
      return `Error from Gemini API: ${response.statusText}`
    }

    const data = await response.json()

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text || "No response from Gemini API."
    } else {
      console.warn("Unexpected Gemini API response format:", data)
      return "Unexpected response format from Gemini API."
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error)
    return `Failed to call Gemini API: ${error.message}`
  }
}

