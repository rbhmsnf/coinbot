const crypto = require("crypto");
const axios = require('axios');
const cheerio = require('cheerio');
class AliExpressLibrary {
    constructor(AppKey, API_SECRET, Tracking_ID, AdminID) {
        this.AdminID = AdminID;
        this.generateMode = "cookies"; // api or cookies
        this.isInTimeout = false;
        this.API_URL = "https://api-sg.aliexpress.com/sync";
        this.AppKey = AppKey;
        this.API_SECRET = API_SECRET;
        this.Tracking_ID = Tracking_ID;
        this.cookies = 'ali_apache_id=33.65.6.156.17419854930.970271.7; cna=EwrIHVUyrxACAZr1lco5mPfZ; e_id=pt90; x_router_us_f=x_alimid=3813280957; aep_common_f=U+3iDKFpJNPXfwhsIp30yVaEHB9OCkM4Hmy4UcavImFZ3dssYyTPMw==; _fbp=fb.1.1741985653676.342734452679182007; _pin_unauth=dWlkPU9HWm1aREEzWlRRdFpHVTNZUzAwT1RjNUxXRTBNREF0TWpZeU9UQTFNbUl3TjJRMg; account_v=1; lzd_cid=1d0d4a57-9492-4a72-9459-e7829e702044; af_ss_a=1; af_ss_b=1; x-hng=lang=en-US; _ga=GA1.1.2051528296.1741985502; ali_apache_track=mt=1|mid=dz2208331984yljae; _gcl_au=1.1.1098665134.1750951902; sgcookie=E100eJn4ga6gn6+mBzhdkujd0aHl58WBfK+7PGGpa0V4hXh9nz0dAKXyJtItxQ4JVHzzLbjT3jA7ZyWhFsNWmqB609S90aM6pk7HC9Wb4+EUMsY=; _history_login_user_info={"userName":"Sohaib","avatar":"","phonePrefix":"","expiresTime":1754850321493}; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=3813280957&isfb=y&re_sns=google&isb=y&region=DZ&b_locale=en_US&ae_u_p_s=2; xman_us_f=x_locale=en_US&x_l=1&x_user=DZ|Sohaib|Dehrib|ifm|3813280957&x_lid=dz2208331984yljae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%2232723bf7d49f4c29878dd80a89d7948b-1754408891489-07938-_oom5Hnz%22%2C%22affiliateKey%22%3A%22_oom5Hnz%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%221985164986%22%2C%22tagtime%22%3A1754408891489%7D&acs_rt=d1b2eaae3b8b438d91580dacbffd20fa&intl_locale=en_US; aeu_cid=32723bf7d49f4c29878dd80a89d7948b-1754408891489-07938-_oom5Hnz; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005008515322680%091005005120109293%091005008793998168%091005008011706365%091005008788307890%091005006292909780%091005007408875766%091005007306877704; acs_usuc_t=x_csrf=105adl48vvq02&acs_rt=270355c3a7934a50a7090e6b23ed390f; _m_h5_tk=2431934365cb9014ae370ceb566d1d4d_1754754458101; _m_h5_tk_enc=1e22aeef245559cede6c7098dd761577; xman_us_t=ctoken=17x3gynyw36de&l_source=aliexpress&x_user=5Biu4v8EflTpoDrixAtrM9a2FJPDH6wgCUiqvfrBhLs=&x_lid=dz2208331984yljae&sign=y&rmb_pp=sohaiblacite70@gmail.com; xman_t=1xA9IZANSBNUinhbbvit1EkXv3h9TbIKLi+LFRD4YxENUaswR5nuNq6hKBwOpzcU2j2MRK7uOqrcTd9BllnPCIE9mK5GIiUBVVWRZOD9ntpRKZVTyw6qho6UZ+NF9bCCpWTRU6Ze45+BrduI6Not7qy5FsAVylHU42661KV9G9p42EEdfLi0UBYNEWin1UvscjTTA/oRuzMU0KQw4Zegb+odco1di9cPwP8/BoXy2KReFhJ2D4x7rIycOxvTZFD3kNr8oncawUs3UY2kqzdX5+wNZ59L67AP4MIaYPi1rlHrVbc59sWcWzLLUvz4KI37TeUijvtbtNNNKWQFky3CmvRU/PzLqVcaZdoec8Uabv4FTf46pBpWbRmFL8goKz7Y+Kr2u+C1uJebrSRYuxDvHvVWO2mHUrKqNTblOz+ZaoqRyMaIE4LtEbwW5DRL92e1QWuWcclTN5SBD848bZjiw1SpRx/j2AIqB9XZF4kgvsLNiJOjp1Cq0Q+VwLWYpGgUBPYiYl2jExfMysJ2+92fCWyYLv0Q1gXspCngV5kQmcx5EnDmjc8LJe7hEJ15rZoLFnprMCoIU6F+ruXo9Mk0L3eaQVMnBx+qqtAZA7DnjXMfdKs/JRbjItg1mc9nNbGD0lyaTqGYJovYoJek/HfjMPT2+tuRvNIQzJlk9i09NKCamVEKfH1VKtjmegYP059FcdpYqkX/+BLo//bImLdIU2H8M+3ITZeb; intl_locale=en_US; intl_common_forever=FK/YDaRMcW2Zs858R5EhEn6vn0e6iCkN4gMZcyuwuTjFEXAosaCrAw==; xman_f=JaCrDuNXSb6yj7zVY1OwCq92EhIgwKh7wVow77rWpMKuJhMhF5eqNcz75hzWFiUWAs7+qTym7/S8PPZ/A1v8pMinXYafxRZoF1QI0fs6dQ7a4D4YgcSmVkUBhnz27Y9pR2qNz+JUx99A7EY5ai0UizLnPplg1lL2AzwMT3qm7SuHZx2p1A8nZ70Cq7gFgNZ4b1m8L+a3QSJM9+caaSmXU8nP76exanYrWfOo7DJR6vLrooWxIdaQYdcg3MpMBhfMcjycKdy7UW3Keg7lpdf694hH6KJPxF/RhIbmuckl/xizk+s367bVv94egp1qkpzitYXm7cuVunNwcfx25hbIVOeS3h1hhgIY40Za5tWDOkh3yWVb9mVRhuwLrwudRTvgubuIEj2qrWRBajE0ovqvVNHoeUJ4ikulKuL6Zmp5EBYgAN0RXcSXQgVKfPD9AYng3l1xsY/BlVw=; cto_bundle=5F0o9l9ia2VGNzVmb0dLV0FkaFAlMkJOSjhyR0F2VWFFWXhJVUhEYzNqZldJOVpzZDN5dk9LU0pRS1hybFRqcGV4cmhEdU1jN3diQW1RQU9CYUZ1b0I4YjFTSmZYeTN3dlAlMkZYMGwzRyUyQmhBckpHNnVmbVVNWSUyQk9PdEQ5NzVaaEhXbElDR1FBNElSQWY1dmVwRTFQcVFUOEZRSjhXUSUzRCUzRA; _uetsid=c9007360753311f08b1b15700c173179; _uetvid=8e9a25d0d50511efbbb011dcd82c12cf; _ga_VED1YSGNC7=GS2.1.s1754752562$o32$g1$t1754752769$j60$l0$h0; JSESSIONID=308D04F6361CF1952296A4F69BBA0A0C; _baxia_sec_cookie_=%257B%2522lwrid%2522%253A%2522AgGVlm8LbhgK4JeUnS%25252BxX39uI26G%2522%252C%2522lwrtk%2522%253A%2522AAIEaJfWpuQqNMy5SXHX0d6dKD59WqbtA7d5HhgrOLITr4UukAqIPd8%253D%2522%252C%2522epssw%2522%253A%25229*mmCVpH7J3NfRWuV3dQS6kCqiQILO7tvOdSZO5yZH3tZRayhHutVO3ImmmmHUhM2dUmbTKRmDkPBuuk2f-elhUImmwQT6BjmDVA7n6tuKu06b0E8kY3WxHB6hMz5HGQzZiqw1txxE9LNmdwYq4DFbwdqfUgJxGpzzZXU7EMkgI4YZ36YtPsbLrb0EmmLJ0_meToIiHmLuuu3ZEYfVNQgaTePOJMLieYD2CmIyBv0MsTPOXnmBDE3Ru_TuC5cuu2CXQAUmmmmmmmHXdcma3LL0uoH9OKso4YyaIm9G5fBhmBN-yPU0svRRXhswWuDly71UBfteWt5eXgtDROOgJfpGSYO2bejc%2522%252C%2522tfstk%2522%253A%2522gstnkFx3Se7CRNZQ-YjIRc_-up3OAMsW4QERwgCr7151w6QRwgDkU1HC2eHQULJkikEpUXOkq1RkyULd2QbyhQj8vMrLqafw_pQJ9DNuqCAcev1Rva8MOKRlPv1Ra_AJUeHtDmpBdgsyqjnxDQ5lZbd3Tu7EUNWfUABFb8KwNgsrMfBxQ-XFVBPMwXjyQAXRET5yay5ZI9BV4k7zYPPN1TSP4w5U7PWChTWP8akMQ16P4TRP8AjN1TSPaQSrtryFOZQwbb0vvoKPB6xGKwf2IcZzqKZA8s-R_ul2f9Vfgp5g4u5BF1ApIph3cdIBfIXv9crHiLJXzNxu_jfWjd-ezdNnZMv9OnjemXqdBdvykNxt3msh4F8NXF3s_aIHtE1fWVG6ZUJ94GxrglfPf1jd73cZmMLvH3_2YDVf6Z6ksZLnikAV4yaau3eQVOkJbza58O6GMDUncQzkPeEnIA44PwW1LLkiIza58O6GMADgo9_FC9JP.%2522%257D; isg=BKeni3SSgymtEwpzdU2ILJ0xNttxLHsO4lPLDXkU-TZNaMYqgf8GXhUuinB2gFOG';
    }

    hash(method, s, format) {
        const sum = crypto.createHash(method);
        const isBuffer = Buffer.isBuffer(s);
        if (!isBuffer && typeof s === "object") {
            s = JSON.stringify(this.sortObject(s));
        }
        sum.update(s, "utf8");
        return sum.digest(format || "hex");
    }

    sortObject(obj) {
        return Object.keys(obj)
            .sort()
            .reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
    }

    signRequest(parameters) {
        const sortedParams = this.sortObject(parameters);
        const sortedString = Object.keys(sortedParams).reduce((acc, objKey) => {
            return `${acc}${objKey}${sortedParams[objKey]}`;
        }, "");
        const bookstandString = `${this.API_SECRET}${sortedString}${this.API_SECRET}`;
        const signedString = this.hash("md5", bookstandString, "hex");
        return signedString.toUpperCase();
    }

    // genmode 1 = direct source values, genmode 2 = star.aliexpress.com redirect URLs
    async generateApiLinkes(id, TrackingId, mode, genmode = 1) {
        const targetBaseUrl = `https://www.aliexpress.com/i/${id}.html`;

        let source_values;
            // genmode 2: wrap each URL as a star.aliexpress.com redirect
            const rawUrls = [
                `https://ar.aliexpress.com/i/${id}.html?sourceType=620&channel=coin`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=680`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=561`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=562`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=504&channel=coin`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=570&channel=coin`,
                `https://vi.aliexpress.com/i/${id}.html?sourceType=620&channel=coin`, // pointsNew fallback
                `https://www.aliexpress.com/ssr/300000512/BundleDeals2?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&productIds=${id}`,
            ];
            source_values = rawUrls
                .map(u => `https://star.aliexpress.com/share/share.htm?redirectUrl=${encodeURIComponent(u)}`)
                .join(',');

        const payload = {
            app_key: this.AppKey,
            sign_method: "md5",
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            format: "json",
            v: "2.0",
            method: "aliexpress.affiliate.link.generate",
            promotion_link_type: 2,
            tracking_id: TrackingId,
            source_values,
        };
        const sign = this.signRequest(payload);
        const allParams = { ...payload, sign };
        const affresponses = await axios.post(this.API_URL, new URLSearchParams(allParams));

        const promotionLinks = affresponses.data.aliexpress_affiliate_link_generate_response.resp_result.result.promotion_links.promotion_link;

        // Check if the response is valid (has source_value populated)
        const isValid = promotionLinks.some(item => item.source_value && item.source_value.trim() !== '');
        if (!isValid && genmode === 1) {
            console.log('generateApiLinkes genmode 1 returned no valid source_value, retrying with genmode 2');
            return this.generateApiLinkes(id, TrackingId, mode, 2);
        }

        const mappedData = promotionLinks.reduce((result, item) => {
            const sourceValue = item.source_value;
            let key = 'limited';
            if (sourceValue) {
                if (sourceValue.includes('sourceType=561') || sourceValue.includes('sourceType%3D561'))  key = 'limited';
                else if (sourceValue.includes('sourceType=562') || sourceValue.includes('sourceType%3D562'))  key = 'super';
                else if (sourceValue.includes('sourceType=680') || sourceValue.includes('sourceType%3D680'))  key = 'bigsave';
                else if (sourceValue.includes('sourceType=570') || sourceValue.includes('sourceType%3D570'))  key = 'choice';
                else if (sourceValue.includes('sourceType=504') || sourceValue.includes('sourceType%3D504'))  key = 'mohtamal';
                else if (sourceValue.includes('BundleDeals2'))    key = 'bundel';
                else if ((sourceValue.includes('sourceType=620') || sourceValue.includes('sourceType%3D620')) && !sourceValue.includes('star.aliexpress')) key = 'points';
                else if (sourceValue.includes('m.aliexpress.com/p/coin-index')) key = 'pointsNew';
                else    key = 'pointsNew';
            }
            if (mode == 2) result['api'] = "true";
            result[key] = item.promotion_link;
            return result;
        }, {});
        return mappedData;
    }

    async getDataAffiliate(product_id) {
        const payload = {
            app_key: this.AppKey,
            sign_method: "md5",
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            format: "json",
            v: "2.0",
            method: "aliexpress.affiliate.productdetail.get",
            product_ids: product_id,
            country: 'DZ',
            target_currency: 'USD',
            target_language: 'EN',
            tracking_id: 'default',
            fields: 'commission_rate'
        };

        const sign = this.signRequest(payload);
        const allParams = { ...payload, sign };

        try {
            const response = await axios.post(this.API_URL, new URLSearchParams(allParams));
            return response.data;
        } catch (error) {
            console.error('Error fetching data from AliExpress API:', error);
            throw error;
        }
    }

    async getData(id, isMe) {
        let TrackingId;
        if (isMe === this.AdminID) {
            TrackingId = "default";
        }
        else {
            TrackingId = "sohdeh";
        }
        console.log(TrackingId);
        const targetBaseUrl = `https://vi.aliexpress.com/item/${id}.html`;
        let affLinks = {};
        let results = {};

        // Cookies mode URLs (genmode 1 = direct, genmode 2 = star redirect)
        const buildCookiesConfigs = (genmode) => {
            const makeUrl = (rawUrl) => {
                if (genmode === 1) return rawUrl;
                return `https://star.aliexpress.com/share/share.htm?redirectUrl=${encodeURIComponent(rawUrl.replace('s-click.aliexpress.com', 'vi.aliexpress.com'))}`;
            };

            const url620New = makeUrl(`https://m.aliexpress.com/p/coin-index/index.html?_immersiveMode=true&tabname=configTab_1926001&from=syicon&productIds=${id}`);
            const url562   = makeUrl(`${targetBaseUrl}?sourceType=562`);
            const url561   = makeUrl(`${targetBaseUrl}?sourceType=561`);
            const url680   = makeUrl(`${targetBaseUrl}?sourceType=680`);
            const url570   = makeUrl(`${targetBaseUrl}?sourceType=570&channel=coin`);
            const url620   = makeUrl(`${targetBaseUrl}?sourceType=620&channel=coin`);
            const url504   = makeUrl(`${targetBaseUrl}?sourceType=504&channel=coin`);
            const urlbundel = makeUrl(`https://www.aliexpress.com/ssr/300000512/BundleDeals2?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&productIds=${id}&afSmartRedirect=y`);

            const base = `https://portals.aliexpress.com/tools/linkGenerate/generatePromotionLink.htm?trackId=${TrackingId}&targetUrl=`;
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                headers: {
                    'authority': 'portals.aliexpress.com',
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6',
                    'bx-v': '2.5.14',
                    'cookie': this.cookies,
                    'referer': 'https://portals.aliexpress.com/affiportals/web/link_generator.htm?spm=0._cps_dada.0.0.173aYrNWYrNW8G',
                    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                }
            };

            return [
                { ...config, url: `${base}${encodeURIComponent(url620)}&afSmartRedirect=y` },   // 0 points
                { ...config, url: `${base}${encodeURIComponent(url561)}&afSmartRedirect=y` },   // 1 limited
                { ...config, url: `${base}${encodeURIComponent(url562)}&afSmartRedirect=y` },   // 2 super
                { ...config, url: `${base}${encodeURIComponent(url680)}&afSmartRedirect=y` },   // 3 bigsave
                { ...config, url: `${base}${encodeURIComponent(url570)}&afSmartRedirect=y` },   // 4 choice
                { ...config, url: `${base}${encodeURIComponent(url504)}&afSmartRedirect=y` },   // 5 mohtamal
                { ...config, url: `${base}${encodeURIComponent(url620New)}&afSmartRedirect=y` },// 6 pointsNew
                { ...config, url: `${base}${encodeURIComponent(urlbundel)}&afSmartRedirect=y` },// 7 bundel
            ];
        };

        let config2 = {
            params: { 'gatewayAdapt': 'glo2vnm' },
            headers: {
                'authority': 'vi.aliexpress.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6',
                'cache-control': 'max-age=0',
                'cookie': this.cookies,
                'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
            }
        };

        let ihtiyat = { ...config2, url: `https://vi.aliexpress.com/i/${id}.html` };
        let success = false;
        let erroracount = 0;
        let imgAvailable = false;
        let titleAvailable = false;
        let checkdata = 1;

        while (erroracount < 3 && !success) {
            try {
                let responses = {};

                if (this.generateMode == "api") {
                    console.log(`i am in the api mode and the mode is ${this.generateMode}`);
                    responses = await Promise.all([
                        this.generateApiLinkes(id, TrackingId, 1), // starts with genmode=1, auto-falls back to 2
                        this.getDataAffiliate(id)
                    ]);
                    responses.forEach((response, index) => {
                        switch (index) {
                            case 0:
                                if (response) {
                                    affLinks = response;
                                }
                                break;
                            case 1:
                                console.log(response);
                                if (response.aliexpress_affiliate_productdetail_get_response.resp_result.resp_code == 200) {
                                    console.log(response.aliexpress_affiliate_productdetail_get_response.resp_result);
                                    console.log("this is the response");
                                    if (response.aliexpress_affiliate_productdetail_get_response.resp_result.result.current_record_count == 0) {
                                        checkdata = 0;
                                        console.log("checkdata is 0 in api mode");
                                    }
                                    if (checkdata != 0) {
                                        imgAvailable = true;
                                        titleAvailable = true;
                                        results['info'] = {
                                            title: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].product_title,
                                            price: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].sale_price,
                                            store: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].shop_name,
                                            image: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].product_main_image_url,
                                            discount: checkdata != "0" ? response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].discount : '2',
                                            storeRate: checkdata != 0 ? response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].evaluate_rate || '0' : '0'
                                        };
                                    }
                                }
                                break;
                        }
                    });
                    if (checkdata == 0) {
                        console.log("checkdata is 0");
                        let ihtiyatresp = await axios.request(ihtiyat);
                        const html = ihtiyatresp.data;
                        const $ = cheerio.load(html);
                        console.log("this is ihtiyat :");
                        const preview = {
                            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                            image: $('meta[property="og:image"]').attr('content') || '',
                        };
                        results['ihtiyat'] = { title: preview.title, image: preview.image };
                        imgAvailable = results.ihtiyat.image !== "";
                        titleAvailable = results.ihtiyat.title !== "";
                        console.log("ihtiyat : ", results.ihtiyat);
                    } else {
                        console.log("checkdata is not 0");
                        console.log("check : ", checkdata);
                    }
                } else {
                    console.log(`i am in the coockies mode and the mod is ${this.generateMode}`);

                    // Try cookies genmode 1 first
                    let cookieConfigs = buildCookiesConfigs(1);
                    const responses = await Promise.all([
                        axios.request(cookieConfigs[0]),
                        axios.request(cookieConfigs[1]),
                        axios.request(cookieConfigs[2]),
                        axios.request(cookieConfigs[3]),
                        axios.request(cookieConfigs[4]),
                        axios.request(cookieConfigs[5]),
                        axios.request(cookieConfigs[6]),
                        axios.request(cookieConfigs[7]),
                        this.getDataAffiliate(id),
                    ]);

                    // Check if genmode 1 gave valid results (at least one success)
                    const cookiesGenmode1Valid = responses.slice(0, 8).some(r => r.data.success);

                    // If genmode 1 failed, redo the 8 cookie requests with genmode 2
                    let cookieResponses = responses.slice(0, 8);
                    if (!cookiesGenmode1Valid) {
                        console.log('cookies genmode 1 failed, retrying with genmode 2');
                        cookieConfigs = buildCookiesConfigs(2);
                        const retryResponses = await Promise.all([
                            axios.request(cookieConfigs[0]),
                            axios.request(cookieConfigs[1]),
                            axios.request(cookieConfigs[2]),
                            axios.request(cookieConfigs[3]),
                            axios.request(cookieConfigs[4]),
                            axios.request(cookieConfigs[5]),
                            axios.request(cookieConfigs[6]),
                            axios.request(cookieConfigs[7]),
                        ]);
                        cookieResponses = retryResponses;
                    }

                    // Map cookie responses (indices 0-7) + affiliate data (index 8 from original responses)
                    const allResponses = [...cookieResponses, responses[8]];

                    allResponses.forEach((response, index) => {
                        switch (index) {
                            case 0:
                                if (response.data.success) affLinks['points'] = response.data.data;
                                break;
                            case 1:
                                if (response.data.success) affLinks['limited'] = response.data.data;
                                break;
                            case 2:
                                if (response.data.success) affLinks['super'] = response.data.data;
                                break;
                            case 3:
                                if (response.data.success) affLinks['bigsave'] = response.data.data;
                                break;
                            case 4:
                                if (response.data.success) affLinks['choice'] = response.data.data;
                                break;
                            case 5:
                                if (response.data.success) affLinks['mohtamal'] = response.data.data;
                                break;
                            case 6:
                                if (response.data.success) affLinks['pointsNew'] = response.data.data;
                                break;
                            case 7:
                                if (response.data.success) affLinks['bundel'] = response.data.data;
                                break;
                            case 8:
                                console.log(response);
                                if (response.aliexpress_affiliate_productdetail_get_response.resp_result.resp_code == 200) {
                                    console.log(response.aliexpress_affiliate_productdetail_get_response.resp_result);
                                    console.log("this is the response");
                                    if (response.aliexpress_affiliate_productdetail_get_response.resp_result.result.current_record_count == 0) {
                                        checkdata = 0;
                                        console.log("checkdata is 0 in api mode");
                                    }
                                    if (checkdata != 0) {
                                        imgAvailable = true;
                                        titleAvailable = true;
                                        results['info'] = {
                                            title: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].product_title,
                                            price: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].sale_price,
                                            store: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].shop_name,
                                            image: response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].product_main_image_url,
                                            discount: checkdata != "0" ? response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].discount : '2',
                                            storeRate: checkdata != 0 ? response.aliexpress_affiliate_productdetail_get_response.resp_result.result.products.product[0].evaluate_rate || '0' : '0'
                                        };
                                    }
                                }
                                break;
                        }
                    });

                    if (checkdata == 0) {
                        let ihtiyatresp = await axios.request(ihtiyat);
                        const html = ihtiyatresp.data;
                        const $ = cheerio.load(html);
                        console.log("this is ihtiyat :");
                        const preview = {
                            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                            image: $('meta[property="og:image"]').attr('content') || '',
                        };
                        results['ihtiyat'] = { title: preview.title, image: preview.image };
                        imgAvailable = results.ihtiyat.image !== "";
                        titleAvailable = results.ihtiyat.title !== "";
                        console.log(results.ihtiyat);
                    }
                }

                if (!('points' in affLinks)) {
                    affLinks = await this.generateApiLinkes(id, TrackingId, 2); // genmode defaults to 1, falls back to 2 internally
                    break;
                }
                affLinks["mode"] = this.generateMode;
                success = true;
            } catch (error) {
                console.error(`error in promise all : ${error.message}`);
                erroracount++;
                if (erroracount === 3) {
                    results = { "error": "tafa7a al kayl", "imgAvailable": "True" };
                    affLinks = await this.generateApiLinkes(id, TrackingId, 2);
                }
            }
        }
        results['aff'] = affLinks;
        results['imgAvailable'] = imgAvailable;
        results['titleAvailable'] = titleAvailable;
        return results;
    }

    changeGenerateMode(mode) {
        this.generateMode = mode;
        return this.generateMode;
    }

    SetCookies = (cookies) => {
        console.log("SET:", cookies);
        this.cookies = cookies;
        console.log("the new coockie ", this.cookies);
    }
}
module.exports = AliExpressLibrary;