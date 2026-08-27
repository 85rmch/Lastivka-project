import express from "express";
import { Telegraf } from "telegraf";
import { Octokit } from "octokit";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const router = express.Router();

const CONFIG_FILE_PATH = path.join(process.cwd(), "supabase_config.json");

function getServerConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.url) {
        return { ...parsed, mode: "supabase" };
      }
    }
  } catch (e) {
    console.error("Failed to read server config:", e);
  }
  return {
    mode: "supabase",
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
    secretKey: process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || "",
    tableName: process.env.VITE_SUPABASE_TABLE_NAME || "products"
  };
}

function saveServerConfig(config: any) {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write server config:", e);
    return false;
  }
}

function escapeHTML(str: string) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let activeBot: Telegraf | null = null;
let botUsername: string | null = null;

async function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    console.log("Telegram Bot: TELEGRAM_BOT_TOKEN is not set. Bot is disabled.");
    return;
  }

  try {
    const bot = new Telegraf(token);
    
    // Fetch bot info to get username and check token validity
    const botInfo = await bot.telegram.getMe();
    botUsername = botInfo.username;
    console.log(`Telegram Bot @${botUsername} successfully connected!`);

    // Handle /start command with order ID deep link
    bot.start(async (ctx) => {
      try {
        const payload = ctx.payload || (ctx.message && 'text' in ctx.message ? ctx.message.text.split(' ')[1] : '');
        const chatId = ctx.chat?.id;

        if (!payload) {
          const welcomeMsg = 
            "🌸 Вітаю в інтернет-магазині «Ластівка»!\n\n" +
            "Це простір модної нижньої білизни, одягу для дому, термобілизни, та товарів 18+ 💕\n\n" +
            "💌 Із задоволенням допоможу підібрати білизну саме для Вас. Пишіть 🤗\n\n" +
            "Оля Ластівка, 096-048-67-14\n" +
            "Відправка по Україні зі складу в Кривому Розі.\n\n" +
            "Тисніть \"Перейти до магазину\", для перегляду товарів в наявності\n👇";

          await ctx.reply(
            welcomeMsg,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Перейти до магазину 🛍",
                      web_app: { url: "https://lastivka-wine.vercel.app/" }
                    }
                  ],
                  [
                    {
                      text: "Відкрити в браузері 🌐",
                      url: "https://lastivka-wine.vercel.app/"
                    }
                  ]
                ]
              }
            }
          );
          return;
        }

        const orderId = payload.trim();
        console.log(`Bot received /start with orderId/payload: ${orderId} from chatId: ${chatId}`);

        const config = getServerConfig();
        const supabaseUrl = config.url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = config.secretKey || config.anonKey || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error("Supabase config is missing, cannot link order");
          await ctx.reply("❌ Произошла ошибка на сервере при подключении уведомлений. Пожалуйста, обратитесь в поддержку.");
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Find order
        const { data: order, error: fetchErr } = await supabase
          .from("orders")
          .select("id, customer_name, delivery_info")
          .eq("id", orderId)
          .maybeSingle();

        if (fetchErr || !order) {
          console.log(`Order ${orderId} not found or fetch error:`, fetchErr);
          await ctx.reply(`❌ Заказ с номером *${escapeHTML(orderId)}* не найден.\nПроверьте правильность ссылки или обратитесь к менеджеру.`, { parse_mode: "Markdown" });
          return;
        }

        // Link Chat ID in delivery_info if not already present
        let currentDelivery = order.delivery_info || "";
        const idTag = `TG Chat ID: ${chatId}`;
        
        if (!currentDelivery.includes("TG Chat ID:")) {
          currentDelivery = currentDelivery ? `${currentDelivery} | ${idTag}` : idTag;
          
          const { error: updateErr } = await supabase
            .from("orders")
            .update({ delivery_info: currentDelivery })
            .eq("id", orderId);

          if (updateErr) {
            console.error("Failed to update order with Chat ID:", updateErr);
            await ctx.reply("❌ Не удалось подключить уведомления. Попробуйте еще раз позже.");
            return;
          }
        }

        await ctx.reply(
          `🔔 *Уведомления успешно подключены!*\n\n` +
          `🌸 Привет, *${escapeHTML(order.customer_name || "клиент")}*!\n` +
          `Мы привязали твой Telegram к заказу *#${escapeHTML(orderId)}*.\n\n` +
          `Ты будешь получать сюда мгновенные сообщения об изменении его статуса (когда он будет собран или отправлен)!`,
          { parse_mode: "Markdown" }
        );

      } catch (err) {
        console.error("Error in bot.start handler:", err);
        await ctx.reply("❌ Произошла непредвиденная ошибка при подключении уведомлений.");
      }
    });

    // Start polling in background, catching errors to avoid crashing the server
    bot.launch().catch((err) => {
      console.error("Telegraf launch error:", err);
    });

    activeBot = bot;

    // Enable graceful stop
    process.once('SIGINT', () => { if (activeBot) activeBot.stop('SIGINT'); });
    process.once('SIGTERM', () => { if (activeBot) activeBot.stop('SIGTERM'); });

  } catch (err) {
    console.error("Failed to initialize Telegram Bot polling:", err);
  }
}

// Start initialization in background
initTelegramBot();

function getBot() {
  if (activeBot) return activeBot;
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return null;
  return new Telegraf(token);
}

router.get("/api/telegram/bot-info", async (req, res) => {
  try {
    if (botUsername) {
      return res.json({ username: botUsername });
    }
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) {
      return res.json({ username: null });
    }
    const bot = new Telegraf(token);
    const botInfo = await bot.telegram.getMe();
    botUsername = botInfo.username;
    res.json({ username: botUsername });
  } catch (err: any) {
    console.error("Failed to fetch bot info dynamically:", err);
    res.json({ username: null, error: err.message });
  }
});

function getOctokit(token?: string) {
  const githubToken = token || process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error("GITHUB_TOKEN is missing");
  return new Octokit({ auth: githubToken });
}

function getSheetClient(clientEmail?: string, privateKey?: string) {
  const email = clientEmail || process.env.GOOGLE_CLIENT_EMAIL;
  const key = privateKey || process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) return null;

  const formattedKey = key.replace(/\\n/g, "\n");
  return new google.auth.JWT({ email, key: formattedKey, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
}

async function appendToSheet(sheetId: string, values: any[]) {
  const auth = getSheetClient();
  if (!auth) return;

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A:A",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

router.post("/api/admin/login", (req, res) => {
  const { adminPassword } = req.body;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    return res.json({ success: true, message: "No admin password configured on server" });
  }
  if (adminPassword === envPassword) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: "Неверный пароль" });
  }
});

router.post("/api/telegram/order", async (req, res) => {
  try {
    const { order, cartItems, total, supabaseConfig } = req.body;
    
    // Save order to Supabase table if config is available on the server or passed by the client
    const config = getServerConfig();
    const supabaseUrl = config.url || supabaseConfig?.url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = config.secretKey || supabaseConfig?.secretKey || config.anonKey || supabaseConfig?.anonKey || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
    let dbSuccess = true;
    let dbErrorMessage: string | null = null;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        let dbItemsText = cartItems
          .map(
            (item: any, idx: number) =>
              `${idx + 1}. ${item.product?.name || "Товар"} (Код: ${item.product?.product_code || ""})\n   Размер: ${item.selectedSize || ""}, Цвет: ${item.selectedColor || ""}, Кол-во: ${item.quantity}\n   Цена: ${item.product?.price || 0} грн`,
          )
          .join("\n\n");

        const { error: dbError } = await supabase.from("orders").insert({
          id: order.id,
          customer_name: order.customerInfo?.name || "",
          customer_phone: order.customerInfo?.phone || "",
          delivery_info: order.customerInfo?.telegram
            ? `${order.customerInfo?.delivery || ""} | TG Chat ID: ${order.customerInfo?.telegram}`
            : (order.customerInfo?.delivery || ""),
          total: total,
          status: "pending",
          items: cartItems,
          items_text: dbItemsText,
        });

        if (dbError) {
          dbSuccess = false;
          dbErrorMessage = dbError.message;
          console.error("Server: Error inserting order to Supabase:", dbError);
        } else {
          console.log(`Server: Order ${order.id} successfully inserted into Supabase!`);
        }
      } catch (dbErr: any) {
        dbSuccess = false;
        dbErrorMessage = dbErr?.message || String(dbErr);
        console.error("Server: Exception during saving order to Supabase:", dbErr);
      }
    }

    const bot = getBot();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!bot || !chatId) {
      console.log("Telegram bot or chatId not configured. Order saved to Supabase successfully.");
      return res.json({ 
        success: true, 
        supabaseSaved: dbSuccess, 
        supabaseError: dbErrorMessage,
        warning: "Order saved to database. Telegram bot notification skipped (variables not set)." 
      });
    }

    let itemsText = cartItems
      .map(
        (item: any, idx: number) =>
          `${idx + 1}. ${escapeHTML(item.product.name)}\n   Размер: ${escapeHTML(item.selectedSize)}, Цвет: ${escapeHTML(item.selectedColor)}, Кол-во: ${item.quantity}\n   Цена: ${item.product.price} грн`,
      )
      .join("\n\n");

    const message =
      `🚨 <b>НОВЫЙ ЗАКАЗ (${escapeHTML(order.id)})</b> 🚨\n\n` +
      `👤 <b>Покупатель:</b>\n` +
      `Имя: ${escapeHTML(order.customerInfo?.name || "Не указано")}\n` +
      `Телефон: ${escapeHTML(order.customerInfo?.phone || "Не указано")}\n` +
      `Доставка: ${escapeHTML(order.customerInfo?.delivery || "Не указано")}\n\n` +
      `🛍 <b>Товары:</b>\n${itemsText}\n\n` +
      `💰 <b>Сумма заказа:</b> ${escapeHTML(String(total))} грн\n` +
      `📅 <b>Дата:</b> ${escapeHTML(String(order.date))}`;

    await bot.telegram.sendMessage(chatId, message, { parse_mode: "HTML" });
    res.json({ 
      success: true, 
      supabaseSaved: dbSuccess, 
      supabaseError: dbErrorMessage 
    });
  } catch (error) {
    console.error("Telegram notification error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send notification" });
  }
});

router.post("/api/github/upload", async (req, res) => {
  try {
    const { filename, content, githubToken } = req.body;
    const octokit = getOctokit(githubToken);
    const safeFilename =
      Date.now() + "_" + filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    console.log("Uploading to GitHub:", safeFilename);

    // Upload to GitHub repository 85rmch/lastivka-photo
    const owner = process.env.GITHUB_OWNER || "85rmch";
    const repo = process.env.GITHUB_REPO || "lastivka-photo";
    const path = `products/${safeFilename}`;

    const githubRes = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
        message: "Add product image",
        content: content.split(",")[1],
      },
    );
    console.log("GitHub upload response status:", githubRes.status);
    
    // Return standard cdn or raw URL
    const rawUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${path}`;
    res.json({
      url: rawUrl,
    });
  } catch (e: any) {
    console.error(
      "GitHub upload error:",
      JSON.stringify(e, Object.getOwnPropertyNames(e)),
    );
    res.status(500).json({ error: e.message });
  }
});

router.post("/api/products/add", async (req, res) => {
  try {
    const {
      product,
      sheetId,
      tableName,
      supabaseUrl,
      supabaseSecretKey,
      adminPassword,
      token,
    } = req.body;

    const serverConfig = getServerConfig();
    const url = supabaseUrl || serverConfig.url;
    const key = serverConfig.secretKey || supabaseSecretKey || serverConfig.anonKey;

    if (!url || !key) {
      return res.status(400).json({ error: "Missing Supabase config" });
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    if (token) {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return res.status(401).json({ error: "Unauthorized user token" });
      }
    } else if (
      process.env.ADMIN_PASSWORD &&
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Неверный пароль администратора" });
    }

    const dbProduct = {
      name: product.name,
      category: product.category,
      description: product.description,
      product_code: product.product_code,
      vendor_code: product.vendor_code,
      color: product.color,
      purchase_price: product.purchase_price,
      cup_type: product.cup_type,
      price: product.price,
      photo: Array.isArray(product.photo)
        ? product.photo
        : product.photo
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      sizes: product.sizes,
      stock: product.stock,
    };

    const targetTable = tableName || serverConfig.tableName || "products";

    const { data: existingData, error: searchError } = await supabase
      .from(targetTable)
      .select("*")
      .eq("product_code", product.product_code);

    let supabaseError;
    let insertedData;

    if (existingData && existingData.length > 0) {
      const existing = existingData[0];
      const mergeStrings = (a: any, b: any) => {
        const arrA = (a || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
        const arrB = (b || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
        return Array.from(new Set([...arrA, ...arrB])).join(", ");
      };

      let existingPhotos: string[] = [];
      const rawPhoto = existing.photo || existing.photos || existing.image;
      if (rawPhoto) {
        if (Array.isArray(rawPhoto)) existingPhotos = rawPhoto;
        else if (typeof rawPhoto === "string") {
          try {
            existingPhotos = JSON.parse(rawPhoto);
          } catch {
            existingPhotos = rawPhoto
              .split(",")
              .map((s: string) => s.trim().replace(/[\[\]"']/g, ""));
          }
        }
      }

      dbProduct.product_code = existing.product_code;
      const isEditMode = req.body.isEdit !== false;
      if (!isEditMode) {
        dbProduct.color = mergeStrings(existing.color, dbProduct.color);
        dbProduct.sizes = mergeStrings(existing.sizes, dbProduct.sizes);
        dbProduct.photo = Array.from(
          new Set([...existingPhotos, ...dbProduct.photo]),
        ).slice(0, 8);
        dbProduct.stock =
          (Number(existing.stock) || 0) + (Number(dbProduct.stock) || 0);
      }

      const res = await supabase
        .from(targetTable)
        .update(dbProduct)
        .eq("id", existing.id)
        .select();
      supabaseError = res.error;
      insertedData = res.data;
    } else {
      const res = await supabase
        .from(targetTable)
        .insert([dbProduct])
        .select();
      supabaseError = res.error;
      insertedData = res.data;
    }

    if (supabaseError) {
      throw new Error("Supabase error: " + JSON.stringify(supabaseError));
    }

    // Sheets
    if (sheetId) {
      const values = [
        product.product_code,
        product.vendor_code,
        product.name,
        product.category,
        product.color,
        product.description,
        product.purchase_price,
        product.price,
        product.cup_type,
        product.sizes,
        product.stock,
        Array.isArray(product.photo) ? product.photo.join(", ") : product.photo,
      ];
      try {
        await appendToSheet(sheetId, values);
      } catch (sheetError: any) {
        console.error("Sheets error (non-fatal):", JSON.stringify(sheetError));
      }
    }

    res.json({ status: "ok" });
  } catch (e: any) {
    console.error("Error adding product:", JSON.stringify(e));
    res.status(500).json({ error: e.message });
  }
});

router.post("/api/products/update", async (req, res) => {
  try {
    const {
      product,
      tableName,
      supabaseUrl,
      supabaseSecretKey,
      adminPassword,
      token,
    } = req.body;

    const serverConfig = getServerConfig();
    const url = supabaseUrl || serverConfig.url;
    const key = serverConfig.secretKey || supabaseSecretKey || serverConfig.anonKey;

    if (!url || !key)
      return res.status(400).json({ error: "Missing config" });

    const options: any = { auth: { persistSession: false } };
    if (token) {
      options.global = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }

    const supabase = createClient(url, key, options);

    if (token) {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return res.status(401).json({ error: "Unauthorized user token" });
      }
    } else if (
      process.env.ADMIN_PASSWORD &&
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Неверный пароль администратора" });
    }

    const dbProduct: any = {
      product_code: product.product_code,
      name: product.name,
      category: product.category,
      description: product.description,
      vendor_code: product.vendor_code,
      color: product.color,
      purchase_price: product.purchase_price,
      cup_type: product.cup_type,
      price: product.price,
      photo: product.photo,
      sizes: product.sizes,
      stock: product.stock,
      is_hidden: product.isHidden ?? product.is_hidden ?? false,
    };

    const targetTable = tableName || serverConfig.tableName || "products";
    let updateRes = null;

    // Helper execute update
    const executeUpdate = async (dataToSave: any) => {
      let res = null;
      if (product.id) {
        res = await supabase
          .from(targetTable)
          .update(dataToSave)
          .eq("id", product.id)
          .select();
      }
      if (!res?.data || res.data.length === 0) {
        if (product.product_code) {
          res = await supabase
            .from(targetTable)
            .update(dataToSave)
            .eq("product_code", product.product_code)
            .select();
        }
      }
      return res;
    };

    updateRes = await executeUpdate(dbProduct);

    // Fallback if is_hidden column does not exist in custom schema
    if (updateRes?.error && (updateRes.error.message?.includes('is_hidden') || updateRes.error.code === '42703')) {
      const dbProductFallback = { ...dbProduct };
      delete dbProductFallback.is_hidden;
      updateRes = await executeUpdate(dbProductFallback);
    }

    if (updateRes?.error) return res.status(400).json({ error: updateRes.error.message });
    if (!updateRes?.data || updateRes.data.length === 0)
      return res.status(404).json({ error: "Товар не найден или нет прав" });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/products/delete", async (req, res) => {
  try {
    const {
      id,
      product_code,
      tableName,
      supabaseUrl,
      supabaseSecretKey,
      adminPassword,
      token,
    } = req.body;

    const serverConfig = getServerConfig();
    const url = supabaseUrl || serverConfig.url;
    const key = serverConfig.secretKey || supabaseSecretKey || serverConfig.anonKey;

    if (!url || !key)
      return res.status(400).json({ error: "Missing config" });

    const options: any = { auth: { persistSession: false } };
    if (token) {
      options.global = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }

    const supabase = createClient(url, key, options);

    if (token) {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return res.status(401).json({ error: "Unauthorized user token" });
      }
    } else if (
      process.env.ADMIN_PASSWORD &&
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Неверный пароль администратора" });
    }

    const targetTable = tableName || serverConfig.tableName || "products";
    let deleteRes = null;

    // 1. Try delete by ID first if provided
    if (id) {
      deleteRes = await supabase
        .from(targetTable)
        .delete()
        .eq("id", id)
        .select();
    }

    // 2. If no rows deleted by ID (or no ID), try delete by product_code
    if (!deleteRes?.data || deleteRes.data.length === 0) {
      if (product_code) {
        deleteRes = await supabase
          .from(targetTable)
          .delete()
          .eq("product_code", product_code)
          .select();
      }
    }

    if (deleteRes?.error) return res.status(400).json({ error: deleteRes.error.message });
    if (!deleteRes?.data || deleteRes.data.length === 0)
      return res.status(404).json({ error: "Товар не найден или нет прав" });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function translateStatusToUA(status: string): string {
  const s = (status || "").toLowerCase().trim();
  if (s === "pending") {
    return "Очікує підтвердження";
  }
  if (s.startsWith("в работе") || s === "processing") {
    return "В роботі";
  }
  if (s === "собран" || s === "assembled") {
    return "Зібраний";
  }
  if (s.startsWith("отправлен на почту")) {
    const match = status.match(/ТТН:\s*([^\s)]+)/i) || status.match(/ТТН:\s*(.+)/i);
    if (match && match[1]) {
      return `Відправлено на пошту (ТТН: ${match[1].replace(/[)]/g, "").trim()})`;
    }
    return "Відправлено на пошту";
  }
  if (s.startsWith("отклонен")) {
    const match = status.match(/отклонен:\s*(.+)/i);
    if (match && match[1]) {
      return `Відхилено (Причина: ${match[1].trim()})`;
    }
    return "Відхилено";
  }
  return status;
}

function formatItemsToUA(items: any[]): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((item: any, idx: number) => {
      const prodName = item.product?.name || "Товар";
      const prodCode = item.product?.product_code ? ` (Код: ${item.product.product_code})` : "";
      const size = item.selectedSize || item.size || "";
      const color = item.selectedColor || item.color || "";
      const qty = item.quantity || 1;
      const price = item.product?.price || 0;

      let desc = `${idx + 1}. ${prodName}${prodCode}\n`;
      const details: string[] = [];
      if (size) details.push(`Розмір: ${size}`);
      if (color) details.push(`Колір: ${color}`);
      details.push(`Кількість: ${qty}`);
      desc += `   ${details.join(", ")}\n   Ціна: ${price} грн`;
      return desc;
    })
    .join("\n\n");
}

router.post("/api/orders/update", async (req, res) => {
  try {
    const { orderId, status, adminPassword, token, supabaseConfig } = req.body;
    const config = getServerConfig();
    const supabaseUrl = config.url || supabaseConfig?.url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = config.secretKey || supabaseConfig?.secretKey || config.anonKey || supabaseConfig?.anonKey || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: "Missing Supabase connection details on the server. Please configure Supabase in Admin Panel settings." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (token) {
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: "Unauthorized user token" });
    } else if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) throw error;

    // Send Telegram notification to the customer if they provided their Chat ID
    try {
      const { data: orderData, error: fetchError } = await supabase
        .from("orders")
        .select("delivery_info, customer_name, items, items_text")
        .eq("id", orderId)
        .single();

      if (!fetchError && orderData && orderData.delivery_info) {
        const match = orderData.delivery_info.match(/TG Chat ID:\s*([-\d]+)/);
        if (match && match[1]) {
          const userChatId = match[1];
          const bot = getBot();
          if (bot) {
            const isProcessing = status.toLowerCase().startsWith("в работе") || status.toLowerCase() === "processing";
            
            let userMessage =
              `🔔 <b>Оновлення статусу замовлення</b>\n\n` +
              `🛍 <b>Замовлення:</b> #${escapeHTML(orderId)}\n` +
              `👤 <b>Отримувач:</b> ${escapeHTML(orderData.customer_name || "")}\n` +
              `✨ <b>Новий статус:</b> <b>${escapeHTML(translateStatusToUA(status))}</b>\n`;

            if (isProcessing) {
              let itemsSection = "";
              if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
                itemsSection = formatItemsToUA(orderData.items);
              } else if (orderData.items_text) {
                itemsSection = orderData.items_text
                  .replace(/Размер:/g, "Розмір:")
                  .replace(/Цвет:/g, "Колір:")
                  .replace(/Кол-во:/g, "Кількість:")
                  .replace(/Цена:/g, "Ціна:");
              }
              if (itemsSection) {
                userMessage += `\n📦 <b>Склад замовлення:</b>\n${itemsSection}\n`;
              }
            }

            userMessage += `\n🌸 Дякуємо, що обрали Ласточку!`;
            
            await bot.telegram.sendMessage(userChatId, userMessage, { parse_mode: "HTML" });
            console.log(`Telegram notification successfully sent to customer chat ID: ${userChatId}`);
          }
        }
      }
    } catch (tgError) {
      console.error("Failed to send customer Telegram notification:", tgError);
    }

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/api/orders/list", async (req, res) => {
  try {
    const { adminPassword, token, supabaseConfig } = req.body;
    const config = getServerConfig();
    const supabaseUrl = config.url || supabaseConfig?.url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = config.secretKey || supabaseConfig?.secretKey || config.anonKey || supabaseConfig?.anonKey || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(400).json({ error: "Missing Supabase connection details on the server. Please configure Supabase in Admin Panel settings." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (token) {
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: "Unauthorized user token" });
    } else if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/api/blog/save", async (req, res) => {
  try {
    const {
      post,
      tableName = "blog_posts",
      supabaseUrl,
      supabaseSecretKey,
      adminPassword,
      token,
    } = req.body;

    if (!supabaseUrl || !supabaseSecretKey) {
      return res.status(400).json({ error: "Missing Supabase config" });
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false },
    });

    if (token) {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return res.status(401).json({ error: "Unauthorized user token" });
      }
    } else if (
      process.env.ADMIN_PASSWORD &&
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Неверный пароль администратора" });
    }

    const dbPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images,
      blocks: post.blocks,
      date: post.date,
    };

    const { error, data } = await supabase
      .from(tableName)
      .upsert([dbPost])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/blog/delete", async (req, res) => {
  try {
    const {
      id,
      tableName = "blog_posts",
      supabaseUrl,
      supabaseSecretKey,
      adminPassword,
      token,
    } = req.body;

    if (!supabaseUrl || !supabaseSecretKey) {
      return res.status(400).json({ error: "Missing Supabase config" });
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false },
    });

    if (token) {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser(token);
      if (authErr || !user) {
        return res.status(401).json({ error: "Unauthorized user token" });
      }
    } else if (
      process.env.ADMIN_PASSWORD &&
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Неверный пароль администратора" });
    }

    const { error, data } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/api/config", (req, res) => {
  try {
    const config = getServerConfig();
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/config/save", async (req, res) => {
  try {
    const { config, adminPassword, token } = req.body;
    
    // Auth validation
    if (token) {
      const serverConfig = getServerConfig();
      const supabaseUrl = serverConfig.url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = serverConfig.secretKey || serverConfig.anonKey || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
      const supabase = createClient(supabaseUrl!, supabaseKey!);
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: "Unauthorized user token" });
    } else if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const success = saveServerConfig(config);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to save configuration on server" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/debug/env", (req, res) => {
  res.json({
    telegramBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: !!process.env.TELEGRAM_CHAT_ID,
    botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
    chatIdLength: process.env.TELEGRAM_CHAT_ID?.length,
    nodeEnv: process.env.NODE_ENV
  });
});
export default router;

