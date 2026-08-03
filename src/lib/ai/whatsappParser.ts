export interface ParsedWhatsAppOrder {
  customerName?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  items: {
    productTitleQuery: string;
    size: "A5" | "A4" | "A3" | "A2" | "CANVAS" | "ACRYLIC" | "CUSTOM";
    frame: "UNFRAMED" | "BLACK_FRAME" | "WOOD_FRAME" | "CUSTOM";
    quantity: number;
  }[];
  customNotes?: string;
  confidence: number;
}

export async function parseWhatsAppChatWithAI(rawChatText: string): Promise<ParsedWhatsAppOrder> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return heuristicWhatsAppParse(rawChatText);
  }

  try {
    const promptText = `
You are an expert order processing AI for Polacraft Studio (a fine art cinema poster store).
Extract structured customer and product order details from this raw WhatsApp chat text message.

RAW CHAT TEXT:
"""
${rawChatText}
"""

INSTRUCTIONS:
1. Extract customer name, 10-digit Indian phone number, email, street address, city, state, pincode if mentioned.
2. Extract all poster items mentioned (Movie / Poster title, size like A5, A4, A3, A2, frame preference, quantity).
3. If size is unspecified, default to "A4". If quantity is unspecified, default to 1.
4. Set confidence score between 0.0 and 1.0.

Return ONLY a valid JSON object matching this schema:
{
  "customerName": "Gowtham Das",
  "phone": "9895012345",
  "email": "gowtham@example.com",
  "street": "MG Road",
  "city": "Kochi",
  "state": "Kerala",
  "zip": "682001",
  "items": [
    {
      "productTitleQuery": "Lucifer",
      "size": "A4",
      "frame": "UNFRAMED",
      "quantity": 2
    },
    {
      "productTitleQuery": "Premam",
      "size": "A3",
      "frame": "BLACK_FRAME",
      "quantity": 1
    }
  ],
  "customNotes": "Customer requested delivery by Monday",
  "confidence": 0.95
}
`;

    const modelsToTry = ["gemini-flash-latest", "gemini-3-flash-preview", "gemini-2.0-flash"];

    for (const modelName of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
            }),
          }
        );

        if (res.ok) {
          const resData = await res.json();
          let rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(rawText);
            if (parsed) return parsed;
          }
        }
      } catch (err) {
        console.warn(`[Gemini WA Parser ${modelName} Warning]:`, err);
      }
    }
  } catch (err) {
    console.warn("[Gemini WA Parser Outer Error]:", err);
  }

  return heuristicWhatsAppParse(rawChatText);
}

function heuristicWhatsAppParse(text: string): ParsedWhatsAppOrder {
  const phoneMatch = text.match(/(\+91[\-\s]?)?[6-9]\d{9}/);
  const zipMatch = text.match(/\b\d{6}\b/);
  
  return {
    phone: phoneMatch ? phoneMatch[0].replace(/\D/g, "") : undefined,
    zip: zipMatch ? zipMatch[0] : undefined,
    items: [
      {
        productTitleQuery: text.slice(0, 40),
        size: text.toLowerCase().includes("a3") ? "A3" : "A4",
        frame: text.toLowerCase().includes("frame") ? "BLACK_FRAME" : "UNFRAMED",
        quantity: 1,
      },
    ],
    customNotes: text,
    confidence: 0.6,
  };
}
