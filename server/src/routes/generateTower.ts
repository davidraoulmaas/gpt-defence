import { Router } from "express";
import { z, ZodError } from "zod";
import { callLLM } from "../llm/llmClient";
import { loadPrompt } from "../llm/promptLoader";
import { validateTower } from "../validation/validateTower";

export const generateTowerRouter = Router();

const RequestBodySchema = z.object({
  prompt: z.string().min(1).max(500),
});

generateTowerRouter.post("/", async (req, res) => {
  // 1. Validate request body
  const body = RequestBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request", details: body.error.flatten() });
    return;
  }

  try {
    // 2. Load prompt template
    const systemPrompt = loadPrompt("tower_generation_v1.md", {
      PLAYER_PROMPT: body.data.prompt,
    });

    // 3. Call the LLM
    const llmResponse = await callLLM({
      systemPrompt,
      userMessage: body.data.prompt,
    });

    // 4. Validate the LLM output against the Zod schema
    const tower = validateTower(llmResponse.content);

    // 5. Return the validated tower definition
    res.json(tower);
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
    console.error("[generateTower]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
