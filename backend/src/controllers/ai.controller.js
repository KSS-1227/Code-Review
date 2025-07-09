import { generateContent } from "../services/ai.service.js";

const getReview = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }
  try {
    const response = await generateContent(code);
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate content" });
  }
};

export default { getReview };
