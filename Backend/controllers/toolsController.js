const User = require('../models/userModel');

const allVerifiedColleges = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', verified: true }).select('name email');
        return res.json({ value: teachers });
    } catch (error) {
        console.error("❌ allVerifiedColleges error:", error);
        return res.status(500).json({ error: "Failed to fetch teachers" });
    }
};

const evaluatePaper = async (req, res) => {
    try {
        const modelFile = req.files?.["model"]?.[0];
        const studentFile = req.files?.["student"]?.[0];

        if (!modelFile || !studentFile) {
            return res.status(400).json({ error: "Please upload both files" });
        }

        const modelText = await extractText(modelFile.buffer);
        const studentText = await extractText(studentFile.buffer);

        const prompt = `
You are an intelligent and strict exam evaluator.

Compare the student answer with the model answer based on accuracy, completeness, and relevance.

Return ONLY valid JSON. Do NOT include:
- markdown
- code blocks
- stars
- explanations outside JSON
- any text before or after JSON

The response MUST start with { and end with }

Keep reasoning exactly 3 short lines:
1. correctness
2. missing or incorrect parts
3. final judgment with marks

Format:
{
  "marks": <number between 0 and 10>,
  "reasoning": [
    "line 1",
    "line 2",
    "line 3"
  ]
}

MODEL ANSWER:
${modelText}

STUDENT ANSWER:
${studentText}`;

        const result = await callGeminiAPI(prompt);

        let cleanText = result
            .replace(/```json|```/g, "")
            .replace(/^\uFEFF/, "")
            .trim();

        try {
            const firstBrace = cleanText.indexOf("{");
            const lastBrace = cleanText.lastIndexOf("}");

            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error("No JSON found");
            }

            const jsonString = cleanText.slice(firstBrace, lastBrace + 1);
            const parsedSummary = JSON5.parse(jsonString);

            return res.json({ result: parsedSummary });

        } catch (error) {
            console.error("❌ JSON parsing failed:", error.message);

            const retryPrompt = `
Fix the following JSON.

Return ONLY valid JSON.
No explanation.
No markdown.

${cleanText}
`;

            const resultFinal = await callGeminiAPI(retryPrompt);

            let retryClean = resultFinal
                .replace(/```json|```/g, "")
                .replace(/^\uFEFF/, "")
                .trim();

            try {
                const first = retryClean.indexOf("{");
                const last = retryClean.lastIndexOf("}");

                if (first === -1 || last === -1) {
                    throw new Error("Retry JSON not found");
                }

                const fixedJson = retryClean.slice(first, last + 1);
                const parsedRetry = JSON5.parse(fixedJson);

                return res.json({ result: parsedRetry });

            } catch (retryError) {
                console.error("❌ Retry parsing failed:", retryError.message);

                return res.json({
                    error: "Retry parsing failed",
                    raw: resultFinal
                });
            }
        }

    } catch (error) {
        console.error("❌ evaluatePaper error:", error);
        return res.status(500).json({ error: "Failed to evaluate paper" });
    }
};


module.exports = { evaluatePaper, allVerifiedColleges };
