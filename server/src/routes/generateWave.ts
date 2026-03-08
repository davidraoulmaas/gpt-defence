import { Router } from "express";
import { z, ZodError } from "zod";
import { callLLM } from "../llm/llmClient";
import { loadPrompt } from "../llm/promptLoader";
import { validateWave } from "../validation/validateWave";

export const generateWaveRouter = Router();

const RequestBodySchema = z.object({
  prompt: z.string().min(1).max(500),
  waveNumber: z.number().int().min(1).default(1),
});

generateWaveRouter.post("/", async (req, res) => {
  // 1. Validate request body
  const body = RequestBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request", details: body.error.flatten() });
    return;
  }

  try {
    // 2. Load prompt template
    const systemPrompt = loadPrompt("wave_generation_v1.md", {
      PLAYER_PROMPT: body.data.prompt,
      WAVE_NUMBER: String(body.data.waveNumber),
    });

    // 3. Call the LLM
    const llmResponse = await callLLM({
      systemPrompt,
      userMessage: body.data.prompt,
    });

    // 4. Validate the LLM output against the Zod schema
    const wave = validateWave(llmResponse.content);

    // 5. Return the validated wave definition
    res.json(wave);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(422).json({
        error: "LLM output failed validation",
        details: err.flatten(),
      });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(422).json({ error: "LLM returned invalid JSON" });
      return;
    }
    console.error("[generateWave]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
