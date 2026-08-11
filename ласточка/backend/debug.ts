import { Router } from "express";
const router = Router();
router.get("/api/debug/env", (req, res) => {
  res.json({
    telegramBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: !!process.env.TELEGRAM_CHAT_ID,
    botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
    chatIdLength: process.env.TELEGRAM_CHAT_ID?.length,
    viteSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    supabaseUrl: !!process.env.SUPABASE_URL
  });
});
export default router;
