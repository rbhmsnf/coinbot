const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');
const https = require('https');
const express = require('express');
const cors = require('cors');
const AliExpressLibrary = require('./afflinker.js');
const AliExpressLibraryCart = require('./cart.js');
const app = express();
const botToken = process.env.token;
const appkey = process.env.appkeys;
const secertkey = process.env.secertkeys;
const tarckin_id = process.env.tarckin_ids;
const AdminChatId = process.env.AdminChatId;
const IdChannel = process.env.ChannelId;
const Channel = process.env.ChannelUser;
const link_cart = process.env.cart;
const proxy = process.env.proxy || "http://jicaojup-rotate:s43a9fo6n6bq@p.webshare.io:80/";
const bot = new Telegraf(botToken);
const aliExpressLib = new AliExpressLibrary(appkey, secertkey, tarckin_id, AdminChatId, proxy);
const aliExpressLibCart = new AliExpressLibraryCart(appkey, secertkey, tarckin_id);
const { createClient } = require('@supabase/supabase-js');
// Original Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
let sessionState = {
    waitingForCookie: false,
    waitingForMode: false
};

// 1. Updated Admin Keyboard with the new cookie button
const markup_admin = {
    reply_markup: {
        keyboard: [
            ['تغيير الكوكيز'], ['تغيير وضع التوليد'], // Added button here
        ],
        resize_keyboard: true
    }
};

// 2. The Keyboard shown while waiting for the cookie (with Cancel button)
const markup_cancel_cookie = {
    reply_markup: {
        keyboard: [
            ['إلغاء تغيير الكوكيز'] // Specialized cancel button
        ],
        resize_keyboard: true,
    }
};
const markup_cancel_mode = {
    reply_markup: {
        keyboard: [
            ['وضع api', 'وضع cookies'],
            ['إلغاء تغيير وضع التوليد']
        ],
        resize_keyboard: true,
    }
};

bot.hears('تغيير الكوكيز', async (ctx) => {
    sessionState.waitingForCookie = true;
    notifyMe("يرجى لصق الكوكيز الجديدة الآن: ", markup_cancel_cookie);
});

bot.hears('تغيير وضع التوليد', async (ctx) => {
    sessionState.waitingForMode = true;
    notifyMe("الوضع العالي هو ," + aliExpressLib.getGenerateMode() + " يرجى تحديد وضع التوليد الجديد : ", markup_cancel_mode);
});

bot.hears('وضع api', async (ctx) => {
    sessionState.waitingForMode = false;
    aliExpressLib.changeGenerateMode('api');
    notifyMe("تم تغيير وضع التوليد إلى api.", markup_admin);
});
bot.hears('وضع cookies', async (ctx) => {
    sessionState.waitingForMode = false;
    aliExpressLib.changeGenerateMode('cookies');
    notifyMe("تم تغيير وضع التوليد إلى cookies.", markup_admin);
});


bot.hears('إلغاء تغيير الكوكيز', async (ctx) => {
    sessionState.waitingForCookie = false;
    notifyMe("تم إلغاء العملية ولم يتغير شيء.", markup_admin);
});
bot.hears('إلغاء تغيير وضع التوليد', async (ctx) => {
    sessionState.waitingForMode = false;
    notifyMe("تم إلغاء العملية ولم يتغير شيء.", markup_admin);
});
async function reLoadMode() {
    try {
        // Fetch the updated user's usage_count and product_message_type
        const { data, error: selectError } = await supabase
            .from('generateMode')
            .select('mode')
            .limit(1)
        if (selectError) throw selectError;
        const mode = data?.[0]?.mode;

        if (!mode) {
            notifyMe("ما كاين حتى mode");
            return;
        }
        // Return an array containing coockie
        aliExpressLib.SetMode(mode);
        notifyMe("mode found on supabase is : " + mode);
    } catch (e) {
        console.error(`حدث خطأ: ${e.message}`);
        notifyMe("yaw khlat generate mode mabghach yatbadl (high problem on supabase found)\ncontact @desoh now for help!");
    }
}
let couponRanges = [];
// New Supabase credentials for referral functionality
app.use(bot.webhookCallback('/bot'))

app.get('/', (req, res) => { res.sendStatus(200) });
// Sur votre backend Node.js/Express
app.get('/changeGenMode', (req, res) => {
    let mode = req.query.mode;
    let currentMode = aliExpressLib.changeGenerateMode(mode);
    res.status(200).json({ currentMod: currentMode });
});
app.get('/ping', (req, res) => { res.status(200).json({ message: 'Ping successful' }); });
app.get('/isUserSubscribed', async (req, res) => {
    let id = req.query.id;
    let isSub = await isUserSubscribed(id);
    res.status(200).json({ isUserSubscribed: isSub });
});

function isJomo3aTime() {
    const now = new Date();

    // Check if it's Friday (Friday = 5 because Sunday = 0)
    const isFriday = now.getDay() === 5;

    // Get current hours and minutes
    const hours = now.getHours() + 1;
    const minutes = now.getMinutes();
    console.log(`server Time : ${hours}:${minutes}`)
    // Convert time to minutes since midnight
    const totalMinutes = hours * 60 + minutes;

    // Range in minutes: 12:30 (750) to 13:40 (820)
    const start = 12 * 60 + 30;
    const end = 13 * 60 + 40;

    const inRange = totalMinutes >= start && totalMinutes <= end;
    console.log(`is friday : ${isFriday} inRange : ${inRange}`)
    return isFriday && inRange;
}


app.get('/reloadcoockies', (req, res) => {
    (async () => {
        await reLoadCoockies();
        console.log("AFTER:", aliExpressLib.cookies);
    })();
    res.status(200).json({ message: 'cbon cookies triglo' });
});

function escapeMarkdownV2(text) {
    return text.replace(/([_*()~`>#+\-=|{}.!])/g, "\\$1");
}

function keepAppRunning() {
    setInterval(() => {
        // Ping the Node.js service
        https.get(`${process.env.RENDER_EXTERNAL_URL}/ping`, (resp) => {
            if (resp.statusCode === 200) {
                console.log('Node.js service: Ping successful');
            } else {
                console.error('Node.js service: Ping failed');
            }
        }).on('error', (e) => {
            console.error(`Node.js service: Ping failed - ${e.message}`);
        });

    }, 5 * 60 * 1000); // Ping every 5 minutes
}

function ping() {

    // Ping the Node.js service
    https.get(`${process.env.RENDER_EXTERNAL_URL}/ping`, (resp) => {
        if (resp.statusCode === 200) {
            console.log('Node.js service: Ping successful');
        } else {
            console.error('Node.js service: Ping failed');
        }
    }).on('error', (e) => {
        console.error(`Node.js service: Ping failed - ${e.message}`);
    });
}


bot.telegram.setMyCommands([
    {
        command: 'start',
        description: 'بدء الاستخدام',
    }

]);


bot.command(['start', 'help'], async (ctx) => {
    let replyMarkup;
    const userChatId = ctx.chat.id;
    const firstName = ctx.chat.first_name;
    const lastName = ctx.chat.last_name;
    const username = ctx.chat.username;

    const messageText = ctx.message.text;

    // تحقق إذا كان المستخدم مسجل
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('chat_id', userChatId)
        .single();

    if (!existingUser) {
        // تسجيل المستخدم
        await addUser(firstName, lastName, username, userChatId);
    }
    if (userChatId.toString() == AdminChatId) {
        replyMarkup = {
            keyboard: [
                ['تغيير الكوكيز'], // Added button here
            ],
            resize_keyboard: true,
            inline_keyboard: [
                [{ text: '✨ تجد أفضل العروض هنا ✨', url: `https://t.me/${Channel}` }]
            ],
        };
    } else {
        replyMarkup = {
            inline_keyboard: [
                [{ text: '✨ تجد أفضل العروض هنا ✨', url: `https://t.me/${Channel}` }]
            ],
        };
    }
    const welcomeMessage = `مرحبًا بك في بوت 
مهمة هذا البوت 🤖 معرفة أقل سعر للمنتج المراد شراءه 😍 حيث يعطيك 3 روابط
⏪رابط تخفيض النقاط (العملات) حيث يقوم بزيادة التخفيض من 1%-2% لتصل حتى الى 24% حسب المنتج 🔥
        ⏪رابط تخفيض نقاط  🔥
        ⏪ رابط الباندل ديلز 🔥
        🔴انسخ رابط المنتج وضعه في البوت وقارن بين الروابط الثلاث واشتري بأقل سعر وقم بتثبيت البوت (épinglée) لتسهيل استعماله.`;

    await ctx.reply(welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
    });
});

let responses = {};


async function notifyMe(message, extra = {}) {
    try {
        bot.telegram.sendMessage(AdminChatId, message, extra);
    } catch (error) {
        console.error(`Error sending notification to chat ID :`, error);
    }
}
async function addUser(first_name, last_name, user_name, chat_id) {
    try {
        // تحقق إذا كان المستخدم مسجل
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('chat_id', chat_id)
            .single();

        if (existingUser) {
            return true; // User already exists, no need to insert
        }
        // Perform upsert
        const { error: upsertError } = await supabase
            .from('users')
            .upsert(
                { first_name, last_name, user_name, chat_id },
                { onConflict: 'chat_id' }
            );

        if (upsertError) throw upsertError;

        return true;
    } catch (e) {
        console.error(`حدث خطأ: ${e.message}`);
        return false; // Return an array of nulls in case of an error
    }
}



async function reLoadCoockies() {
    try {

        // Fetch the updated user's usage_count and product_message_type
        const { data, error: selectError } = await supabase
            .from('coockie')
            .select('cookie')
            .limit(1)
        if (selectError) throw selectError;
        const cookie = data?.[0]?.cookie;

        if (!cookie) {
            notifyMe("ما كاين حتى cookie");
            return;
        }
        // Return an array containing coockie
        aliExpressLib.SetCookies(cookie);
        notifyMe("coockies tbadlo cbon");
    } catch (e) {
        console.error(`حدث خطأ: ${e.message}`);
        notifyMe("yaw khlat cookies mabghawch yatbadlo");
    }
}

async function isUserSubscribed(user_id) {
    try {
        const user_info = await bot.telegram.getChatMember(-1002004335860, user_id);
        console.log(user_info);
        return ['member', 'administrator', 'creator'].includes(user_info.status);
    } catch (e) {
        console.error(`حدث خطأ: ${e.message}`);
        return false;
    }
}

function includesAny(url, decodedUrl, needle) {
    return decodedUrl.includes(needle) || url.includes(needle);
}

function getLinkType(url) {
    if (!url) return null;
    const decodedUrl = decodeURIComponent(url);

    if (includesAny(url, decodedUrl, 'sourceType=561') || includesAny(url, decodedUrl, 'sourceType%3D561')) {
        return 'العرض المحدود';
    } else if (includesAny(url, decodedUrl, 'sourceType=562') || includesAny(url, decodedUrl, 'sourceType%3D562')) {
        return 'سوبر ديلز';
    } else if (includesAny(url, decodedUrl, 'sourceType=620') || includesAny(url, decodedUrl, 'sourceType%3D620')) {
        return 'العملات القديم';
    } else if (includesAny(url, decodedUrl, 'sourceType=680') || includesAny(url, decodedUrl, 'sourceType%3D680')) {
        return 'bigsave';
    } else if (includesAny(url, decodedUrl, 'sourceType=570') || includesAny(url, decodedUrl, 'sourceType%3D570')) {
        return 'choice';
    } else if (includesAny(url, decodedUrl, 'sourceType=504') || includesAny(url, decodedUrl, 'sourceType%3D504')) {
        return 'المحتمل';
    } else if (includesAny(url, decodedUrl, 'BundleDeals2')) {
        return 'بندلز';
    } else {
        return 'المنتج في صفحة العملات'; // fallback
    }
}
async function incrementUsage(chat_id, currentUsageCount) {
    try {
        // Increment the usage_count directly in the database
        const { data, error } = await supabase
            .from('users')
            .update({ usage_count: currentUsageCount + 1 })
            .eq('chat_id', chat_id)
            .select('usage_count')
            .single();

        if (error) throw error;

    } catch (e) {
        console.error(`Error updating usage count for ${chat_id}: ${e.message}`);
    }
}
async function getUseCount(chat_id) {
    try {

        // Fetch the updated user's usage_count and product_message_type
        const { data, error: selectError } = await supabase
            .from('users')
            .select('usage_count, product_message_type')
            .eq('chat_id', chat_id)
            .limit(1);
        console.log(data);
        if (selectError) throw selectError;

        // Return an array containing usage_count and product_message_type
        return data[0].usage_count || 0;
    } catch (e) {
        console.error(`حدث خطأ: ${e.message}`);
        return 0; // Return an array of nulls in case of an error
    }
}

async function sendPhotoAndMessage(ctx, img_s, messageLink, replyMarkup1) {
    try {
        // إرسال الصورة
        await ctx.sendPhoto({ url: img_s });

        // إرسال النص بعد الصورة
        await ctx.reply(messageLink, { parse_mode: "HTML", reply_markup: replyMarkup1, disable_web_page_preview: true });
    } catch (error) {
        console.error('Error sending photo and message:', error);
        // يمكنك إضافة إجراءات إضافية هنا إذا كنت ترغب في التعامل مع الأخطاء
    }
}
 async function updateCookieInSupabase(newCookieString) {
        try {
            // Fetch the first row ID to make sure we update the existing one
            const { data: existingData, error: fetchError } = await supabase
                .from('coockie')
                .select('id') // assuming your table has an 'id' column
                .limit(1);

            if (fetchError) throw fetchError;

            if (existingData && existingData.length > 0) {
                // Update the existing row
                const { error: updateError } = await supabase
                    .from('coockie')
                    .update({ cookie: newCookieString })
                    .eq('id', existingData[0].id);

                if (updateError) throw updateError;
            } else {
                // If the table is completely empty, insert a new row
                const { error: insertError } = await supabase
                    .from('coockie')
                    .insert([{ cookie: newCookieString }]);

                if (insertError) throw insertError;
            }

            return { success: true };
        } catch (e) {
            console.error(`Error updating Supabase: ${e.message}`);
            return { success: false, error: e.message };
        }
    }
bot.on('message', async (ctx) => {

    let message_type;
    let isstore = false;
    const chatId = ctx.chat.id;
    const text = ctx.message.text || ctx.message.caption || '';
    if (!text) {
        ctx.reply('يتم معالجة النصوص فقط 😔 ،يرجى ارسال رابط منتج ALIEXPRESS')
        return;
    }
    const userIdToCheck = ctx.message.from.id;
    let usercount;
    usercount = await getUseCount(ctx.chat.id);
    console.log(ctx.chat);
    await addUser(ctx.chat.first_name, ctx.chat.last_name, ctx.chat.username, chatId);
    if (sessionState.waitingForMode && chatId.toString() === AdminChatId) {
        return;
    }
    if (sessionState.waitingForCookie && chatId.toString() === AdminChatId) {
        if (!text || text.trim() === "") {
            notifyMe("الرجاء إدخال نص صالح");
            return;
        }

        notifyMe("جاري تغيير الكوكيز...");

        const result = await updateCookieInSupabase(text.trim());

        if (result.success) {
            notifyMe("تم التغيير بنجاح! 🎉");

            aliExpressLib.SetCookies(text.trim());
        } else {
            notifyMe("خلات عليك الكوكيز مبغاوش يتعدلو");
        }

        sessionState.waitingForCookie = false;
        return;
    }
   
    /*if (isJomo3aTime()) {
        ctx.reply(`قال الله تعالى : { يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلاةِ مِنْ يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَى ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ} [الجمعة:9]
استجابة لأمر الله تعالى، إن البوت الآن متوقف مؤقتا إلى نهاية صلاة الجمعة على الساعة 13:40 ( أي الواحدة و 40 دقيقة زوالا) . ✅
و كذلك لا تجوز أي تعاملات تجارية في وقت الجمعة منها شراء و بيع الدولار و الأورو أيضا. ❌`);
        return;
    }*/

    if (await isUserSubscribed(userIdToCheck) || usercount < 5) {
        // if (1) {
        console.log('t')
        try {
            if (text === "/start") {
                console.log("ok");
            } else {
                try {
                    const extractLinks = (text) => {
                        const urlPattern = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
                        const linksRedirect = text.match(urlPattern) || [];
                        return linksRedirect;
                    };

                    const links = extractLinks(text);
                    if (links.length === 0 || !links[0].includes("aliexpress")) {
                        ctx.reply('الرجاء إرسال رابط منتج من موقع AliExpress.');
                        return;
                    }
                    let idpresent = true;

                    let linkType = false;
                    const idCatcher = async (id, type) => {
                        if (id.includes("https")) {
                            id = id;
                        } else {
                            var url_parts = id.split("http");
                            id = "https" + url_parts[1];
                        }

                        const extractIdFromUrl = (url) => {
                            linkType = getLinkType(url);
                            const productIdsMatch = url.match(/productIds=(\d+)/);
                            if (productIdsMatch) return productIdsMatch[1];

                            const htmlIdMatch = url.match(/\/(\d+)\.html/);
                            if (htmlIdMatch) return htmlIdMatch[1];
                            return null;
                        };

                        const isLikely404 = (url) => {
                            id = extractIdFromUrl(url);
                            if (id === 404 || id === "404") console.log("hada fih 404 :", url);
                            return (id === 404 || id === "404");
                        };

                        const getFinalIdIfStartsWith3 = async (url) => {
                            try {
                                const response = await axios.head(url, {
                                    maxRedirects: 0,
                                    validateStatus: (status) => status >= 200 && status < 400
                                });

                                const finalUrl = decodeURIComponent(response.headers.location || '');
                                console.log("start with 3 : ", finalUrl)
                                if (isLikely404(finalUrl)) {
                                    ctx.reply('3 لا يمكن التعرف على المنتج من هذا الرابط \nيرجى نسخ الرابط من التطبيق');
                                    return null;
                                }
                                linkType = getLinkType(finalUrl);
                                const finalId = extractIdFromUrl(finalUrl);
                                if (!finalId) {
                                    console.log("tafa7a el kayl");
                                    return extractIdFromUrl(url);
                                }
                                return finalId || null;
                            } catch (error) {
                                console.error("Error resolving secondary redirect:", error.message || error);
                                return extractIdFromUrl(url);
                            }
                        };

                        // ++-+-+-+
                        if (/^\d+$/.test(id)) {
                            if (id.startsWith("3")) {
                                return await getFinalIdIfStartsWith3(id);
                            }
                            if (type !== 1 && isLikely404(id)) {
                                ctx.reply('لا يمكن التعرف على المنتج من هذا الرابط \nيرجى نسخ الرابط من التطبيق');
                                return null;
                            }
                            linkType = getLinkType(id);
                            return id;
                        } else if (id.includes("aliexpress.com")) {
                            let extractedId = extractIdFromUrl(id);
                            if (extractedId) {
                                if (extractedId.startsWith("3")) {
                                    return await getFinalIdIfStartsWith3(id);
                                }
                                return extractedId;
                            }

                            try {
                                const response = await axios.head(id, {
                                    maxRedirects: 0,
                                    validateStatus: (status) => status >= 200 && status < 400
                                });

                                const decodedUrl = decodeURIComponent(response.headers.location || '');
                                console.log("Redirected URL:", decodedUrl);

                                if (type !== 1 && isLikely404(decodedUrl)) {
                                    ctx.reply('لا يمكن التعرف على المنتج من هذا الرابط \nيرجى نسخ الرابط من التطبيق');
                                    return null;
                                }

                                if (type === 1 && decodedUrl.includes("/store/")) {
                                    isstore = true;
                                    console.log("store request");
                                    return 0;
                                }

                                extractedId = extractIdFromUrl(decodedUrl);
                                if (extractedId) {
                                    if (extractedId.startsWith("3")) {
                                        return await getFinalIdIfStartsWith3(decodedUrl);
                                    }
                                    return extractedId;
                                }
                            } catch (error) {
                                console.log('Error occurred while fetching the URL:', error);
                                ctx.reply('لا يمكن التعرف على المنتج من هذا الرابط \nيرجى نسخ الرابط من التطبيق');
                                return null;
                            }
                        }
                        if (type !== 1) ctx.reply('لا يمكن التعرف على المنتج من هذا الرابط \nيرجى نسخ الرابط من التطبيق');
                        return null;
                    };
                    let iddexmanzjek = await idCatcher(links[0], 1);
                    console.log(iddexmanzjek);
                    ctx.reply('دعني أفحص المنتج و المتجر بعناية 🕵')
                        .then((message) => {

                            if (links[0].includes("/p/trade/confirm.html")) {
                                const match = links[0].match(/availableProductShopcartIds=([\d,]+)/);
                                if (match) {
                                    let numbersText = match[1];
                                    numbersText = numbersText.replaceAll(',', '%2C');
                                    const finalUrl = `https://www.aliexpress.com/p/trade/confirm.html?availableProductShopcartIds=${numbersText}&extraParams=%7B%22channelInfo%22%3A%7B%22sourceType%22%3A%22620%22%7D%7D&aff_fcid=`;
                                    console.log(finalUrl);
                                    try {
                                        aliExpressLibCart.getData(finalUrl).then((data) => {

                                            const cart = `
 رابط السلة بعد التخفيض ⬇️
 ${data}                                   
                                    `;
                                            ctx.sendMessage(cart);
                                            ctx.deleteMessage(message.message_id);
                                        })
                                    } catch (error) {
                                        console.error(error.message);
                                    }
                                }
                            } else {
                                let isMe = false;
                                if (chatId === AdminChatId) {
                                    isMe = true;
                                }
                                let url_link;
                                if (links[0].includes("https")) {
                                    url_link = links[0];
                                } else {
                                    var url_parts = links[0].split("http");
                                    url_link = "https" + url_parts[1];
                                }
                                idCatcher(url_link, 0).then(response_link => {
                                    if (response_link === null || response_link === 404 && iddexmanzjek !== 0) {
                                        (async () => {
                                            await ctx.deleteMessage(message.message_id);
                                        })();
                                        return;
                                    }
                                    if (iddexmanzjek !== 0) response_link = iddexmanzjek;
                                    aliExpressLib.getData(response_link, chatId)
                                        .then((coinPi) => {
                                            let image = '';
                                            let links = `🔰 رابط المنتج في صفحة العملات:
${coinPi.aff.pointsNew}

🔰 رابط العملات القديم :
${coinPi.aff.points}

🔰 رابط بندلز : 
ادخل الى هذا الرابط :
${coinPi.aff.bundel}
ثم اضف المنتج في السلة من هنا :
${coinPi.aff.choice}

 `;
                                            let productMessage = "";
                                            console.log("coinPi : ", coinPi);
                                            if ('api' in coinPi.aff) {
                                                notifyMe(`noood ya rabe7 nooooooood rani nakhdem b api !
3omola ra7at !!`);
                                            }
                                            if ('info' in coinPi) {
                                                image = coinPi.info.image;
                                                productMessage = `🔰 تخفيض لـ :${coinPi.info.title}

السعر : ${coinPi.info.price}$ ( ${coinPi.info.discount} % تخفيض )

${links}

معلومات المتجر :
اسم المتجر : ${coinPi.info.store}
🌟تقييم المتجر : ${coinPi.info.storeRate}`;

                                            } else if ("ihtiyat" in coinPi) {
                                                if (coinPi.titleAvailable) {
                                                    productMessage = `🔰 تخفيض لـ : ${coinPi.ihtiyat.title}

${links}`;
                                                }
                                                else {
                                                    productMessage = links;
                                                }
                                                if (coinPi.imgAvailable) {
                                                    image = coinPi.ihtiyat.image;
                                                }
                                            }
                                            if (coinPi.imgAvailable == false) {
                                                ctx.reply(links, {
                                                    parse_mode: "HTML",
                                                    ...Markup.inlineKeyboard([
                                                        [Markup.button.url("✨ لا تنسى متابعة قناتنا ✨", `https://t.me/${Channel}`)]
                                                    ])
                                                });
                                            } else {
                                                ctx.replyWithPhoto({ url: image },
                                                    {
                                                        caption: productMessage
                                                        , parse_mode: "HTML",
                                                        ...Markup.inlineKeyboard([
                                                            [Markup.button.url("✨ لا تنسى متابعة قناتنا ✨", `https://t.me/${Channel}`)]
                                                        ])
                                                    });
                                            }

                                            ctx.deleteMessage(message.message_id);
                                        });
                                });
                            }
                            (async () => {
                                await incrementUsage(ctx.chat.id, usercount+1);
                            })();
                        })
                        .catch(error => {
                            console.error(error.message);
                        });
                } catch (error) {
                    ctx.reply('حدث خطأ غير متوقع');
                }
            }
        } catch (e) {
            ctx.reply('حدث خطأ غير متوقع');
        }
    } else {
        ctx.reply(`اشترك الآن في القناة لمواصلة استخدام البوت بدون حدود 🤩`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'متابعة القناة', url: `https://t.me/${Channel}` }]
                ]
            }
        });
    }
});

app.listen(3000, () => {
    bot.launch();
    /*bot.telegram.setWebhook(`${process.env.RENDER_EXTERNAL_URL}/bot`)
        .then(() => {*/
    console.log('Webhook Set ✅ & Server is running on port 3000 💻');
    ping();
    keepAppRunning();
    reLoadCoockies()
    // });
});
// bot.launch({ webhook: { domain: process.env.RENDER_EXTERNAL_URL, port: process.env.PORT }, allowedUpdates: ['message', 'callback_query'], })
//     .then(() => {
//         console.log('Bot is running');
//     })
//     .catch((error) => {
//         console.error('Error starting the bot:', error);
//     });
