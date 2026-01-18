import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fen, legalMoves, difficulty } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const difficultyPrompts: Record<string, string> = {
      easy: "You are a beginner chess player. Sometimes make suboptimal moves. Prioritize piece development but occasionally miss good captures.",
      medium: "You are an intermediate chess player. Make solid moves, protect your pieces, and look for basic tactics like forks and pins.",
      hard: "You are an advanced chess player. Always find the best move. Look for tactics, control the center, and think several moves ahead."
    };

    const systemPrompt = `${difficultyPrompts[difficulty] || difficultyPrompts.medium}

You are playing as Black in a chess game. Given the current board position (FEN notation) and list of legal moves, respond with ONLY the move you want to make in algebraic notation (e.g., "e7e5" or "g8f6").

CRITICAL: Your response must be EXACTLY one of the legal moves provided. Do not include any explanation, just the move in the format "fromSquareToSquare" (e.g., "e7e5").`;

    const userPrompt = `Current position (FEN): ${fen}

Legal moves available: ${legalMoves.join(", ")}

Choose your move:`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 10,
        temperature: difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 0.1 : 0.4,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let move = data.choices?.[0]?.message?.content?.trim().toLowerCase() || "";
    
    // Clean up the move - remove any extra characters
    move = move.replace(/[^a-h1-8]/g, '');
    
    // Validate the move is in the legal moves list
    const isValidMove = legalMoves.some((lm: string) => lm.toLowerCase() === move);
    
    if (!isValidMove && legalMoves.length > 0) {
      // If AI returned invalid move, pick a random legal move
      const randomIndex = Math.floor(Math.random() * legalMoves.length);
      move = legalMoves[randomIndex];
    }

    return new Response(JSON.stringify({ move }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chess AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
