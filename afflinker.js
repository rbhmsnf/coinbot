const crypto = require("crypto");
const axios = require('axios');
const cheerio = require('cheerio');
class AliExpressLibrary {
    constructor(AppKey, API_SECRET, Tracking_ID, AdminID) {
        this.AdminID = AdminID;
        this.generateMode = "api"; // api or cookies
        this.isInTimeout = false;
        this.API_URL = "https://api-sg.aliexpress.com/sync";
        this.AppKey = AppKey;
        this.API_SECRET = API_SECRET;
        this.Tracking_ID = Tracking_ID;
        this.cookies = 'ali_apache_id=33.64.211.54.1779984047444.244458.8; cna=sVSfItYOFhwCAWnrhy/5x72Y; af_ss_a=1; af_ss_b=1; x-hng=lang=en-US; _gcl_au=1.1.1761851887.1780562054; _ga=GA1.1.127079758.1780562054; xman_us_f=x_locale=en_US&x_l=1&x_user=DZ|RABEH|MSNF|ifm|4860735742&x_lid=dz3265767613aseae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%225856849ddcbb4dd9a90eda679e57ef37-1780700763697-04522-_c45d2J9R%22%2C%22affiliateKey%22%3A%22_c45d2J9R%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%224860735742%22%2C%22tagtime%22%3A1780700763697%7D&acs_rt=c1a2cf9ee7554620a3ac5c6b4451ff7c&intl_locale=en_US; aeu_cid=5856849ddcbb4dd9a90eda679e57ef37-1780700763697-04522-_c45d2J9R; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005012340431088%091005012340203471%091005006592615834%091005009689452176%091005009667523502%091005009689476054%091005010015859351%091005010313616628; lzd_uid=3100000119887; lzd_cid=38ca58e3-1940-460a-9cb3-c911c14ea0ec; _tb_token_=38757eb85663e; acs_usuc_t=x_csrf=knno6x_1i58l&acs_rt=424952f40225498ab3e69ea43dc57ddc; global_seller_sid=12c46e7714245ac63639b1a65e7d4cbe; _m_h5_tk=3ebdf0847381c443ecc65fa93e6fab09_1780742903613; _m_h5_tk_enc=8083bf5d12c5b2f2d73b46814b26ffd1; _lang=en_US; x5sec=7b22617365727665722d696e746c3b33223a22307c434a546d6a394547455058516a3566372f2f2f2f2f7745776d37614f69502f2f2f2f2f2f41513d3d222c2274223a313738303734303839302c22733b32223a2230306439366336646532383464373164227d; aep_usuc_f=city=null&re_sns=google&s_locale=zh_CN&b_locale=en_US&site=ara&province=null&c_tp=USD&x_alimid=4860735742&isfb=y&ups_d=0|0|0|0&isb=y&ups_u_t=&region=DZ&ae_u_p_s=1; isg=BFhY8lChhhg9paqnJIp7B5PfKYbqQbzLT8-PRJJJ3RNGLfkXOlSVWUAMYX0dPXSj; sgcookie=E1004gQ4pBHcQjvejBUeIBpFrskIih7j2egJlXw1J76odj+2ovrvZEdeZ1oniC+dMALuWV//r25S08tovn5La945XqZki5DEZYVLhxxd3y940X0=; xman_us_t=ctoken=18_xbe_sba61r&l_source=aliexpress&ae_g=n&x_user=Mb3NAYBpTOnRvcdO7WC6iRw0nQlZA53+1GyQ5+VL5Y0=&x_lid=dz3265767613aseae&sign=y&rmb_pp=rabehmsnf1@gmail.com; xman_t=8GnVkVLE0janhntECcbJJ5CNmwMrvDFUxjqyVN8h59p5EfrpM+5+trLrwRQhq1lQ6nr91o0zFLX8N+4YDuxP3UbXRsQlj46FghcopJHwh2pZQClatcO3qsEgPLXRvm5CqqxWmfWK+C1ioJBPT0oni5DIpzsiKChM0a7ZJxcRumy8QDXaODi/RxKec450jy51nCurR4f/xwZZCMr0UU0x0dqLcbLOCCuMEWpheroq12XlYKzGUluLOMo9Y+B29pYL7ozwtFAbwqgZqPVwmo1yThq8xZXtVglQi9wOAh5Mo30bZwxFuunUzj+kRKvQzsia09GGRrYOJt/AVZYB9yDKKPrtc6u+wiZmvcql2WVmWnOOOlJFLKtFKeGMq5fT0XFafb5mzuyMtg/fOKm9iNxF9lXKpM5FkecTNd8KAMse1M7DAn7zE1fPhU9nqwyo8X+vbfyxt1Mt05Z4sKvE4yrc4zE7lQZj9X1giha1fawCqW+kY6/bBnn/QCDv4KZ56Uq6l5dQOeQB6AdMeTUVOYbXkg2VsxVRtl5kTGVRhCV777XosqZgJUgfAvm3AUF0IqtLzLKonTCJh5jnzdZaiU40nls9pBX9ilpJh+eY+h6fVFjxkPIdkeyhVZLR+0ZsCmDUTo1yNw6iyGsjf33X8Kd9sRdPTfdlzQSdKjfHRZtocd9wUD3KOpqvthb2A3nDsq4iwASX6plfBO0=; _ga_VED1YSGNC7=GS2.1.s1780740924$o2$g0$t1780740924$j60$l0$h0; xman_f=+fYAC3edTf9w8nQHFMOzKqr1ccoDu+Foslg+d88HIupzs7PNCjlHRFCNk4Ki6Ilr0+pGzWzcUotwFGhoinCy1FkL2LVOA7vifeCAB2XZQgFVADpBdDt6m9VKvCkY2jOgC10vrmLwPuG1dqx8zq2uN3lDSc5qU0BJatvuBLUHjEc2q4ayP+YBLOgmprYSHtqg/2hLx2ZkyYNp5hnvagGnmmvVzvclzgzFmEEUbLXlXb7+E5ZyDs2ahgVK+wvBZ7W7bIrQ48oGsQMt0T/R2T7iKVNq1qYpNNlwwxLhrEzUms9jEkmw+kR2fjq1Pv3sKKpBb01NXVrBlrlY951hnRBsjv3dtyI/GgiOP0Vcp7Q4myJU+/jMKYJDXBQvBGNN/aqYjvtfENwgI6ABvLm61dWC4ZURpjmOf+7h60VGjK5ppFGWH6jSObruMKIdiR5sOiWe; global_sid=1af5e310b88e2e300d61b701e0c44373; lzd_b_csg=cd663c5a; JSESSIONID=E1D69166824F316E6DF29584C700AC21; _baxia_sec_cookie_=%257B%2522tfstk%2522%253A%2522g7Prktt-c_Crumjg7PcFQ15Iqwl-tXS1xWiI-y4nP0moObMn-kZDNvX8A6RUyy0QF0i73Dr000bRJwCU-o4BOaEIVo-3fkioO8aCYoZgbvwSdT33YyobABNUJBu3-kQ-AaBbyzhKtGs_z1a8ySK6muVyZIf0kVAn-tMubJ0fMGs11sNokdRffysy1_UmJm0o-BDhun0SmUAux0DDmVuttDq3xm4m72AnxLDnmKmx-Xm3xXbqim3EtDqntZzmwJUu-IusEatG0eBAqLH-jzm2tC-xzY0c6cdHTSHUuc4upBA3g4kzGkV8-Pk7KPHTNy5eMbaanj0_y_Rqsz0aVmZGsIl0lrqIB-Ip1xE4TAFoeevuuWorI7D2RCaZG2qnL-Iw14l73APzewK0rlizIbUB7gaqQ-ktoxYeEbw_5WHgZ_-tcA3UVmZGsIlmKgoWvqcr8WnnJpkokqo1uZSQgf3Mr8_24ppKncuqfanJppHoyqo1uapppxmSuc_Xu%2522%252C%2522lwrid%2522%253A%2522AgGeb1ErdcUQ6oSQeuI1X39uI03r%2522%252C%2522lwrtk%2522%253A%2522AAIEaiRjqyzv3pCUGFPh%252Bmq6imd2Xn5IKQE1MFzLoaNEA22dFQewmhI%253D%2522%252C%2522epssw%2522%253A%252212*f-pKB0tGGIAw-a5z8UizSVbiI1nYfEUndKuSmAqHGRbF4UXFl-IGt6XF8UQwWjoO4RWGGGOTj_e6XsMVb046bZ0xoDSrwAvLmiLsKT8j1GQy6p5yezvhTOcLoJWT8yQIPi7yXupwAF1xaxSn4o4cEJyhMwhppp_UrpqSQGyorPetXOFZo4wIY3N_OT0ov_p8iGmVtrXyinkEsWYry9Lj1i9HeIMGGMei0MFhpN0GyDKGGM3OGREMbwFE-dIkgcYGGGs88Kt-G_ptssxQPIMY6wfh7iYkfCMQctRmCnmPStxsKf5GeKPhEPqpKb4LyYCVzJST2mpxwSsUUUQf%2522%257D';
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
                `https://m.aliexpress.com/p/coin-index/index.html?_immersiveMode=true&tabname=configTab_1926001&from=syicon&productIds=${id}`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=620&channel=coin`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=680`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=561`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=562`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=504&channel=coin`,
                `https://ar.aliexpress.com/i/${id}.html?sourceType=570&channel=coin`,
                `https://vi.aliexpress.com/i/${id}.html?sourceType=620&channel=coin`,
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
                console.log("sourceValue: ", sourceValue);
                if (sourceValue.includes('sourceType=561') || sourceValue.includes('sourceType%3D561'))  key = 'limited';
                else if (sourceValue.includes('sourceType=562') || sourceValue.includes('sourceType%3D562'))  key = 'super';
                else if (sourceValue.includes('sourceType=680') || sourceValue.includes('sourceType%3D680'))  key = 'bigsave';
                else if (sourceValue.includes('sourceType=570') || sourceValue.includes('sourceType%3D570'))  key = 'choice';
                else if (sourceValue.includes('sourceType=504') || sourceValue.includes('sourceType%3D504'))  key = 'mohtamal';
                else if (sourceValue.includes('BundleDeals2'))    key = 'bundel';
                else if (sourceValue.includes('sourceType=620') || sourceValue.includes('sourceType%3D620')) key = 'points';
                else if (sourceValue.includes('coin-index')) key = 'pointsNew';
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
            TrackingId = "Rbhcoinbot";
        }
        console.log(TrackingId);
        const targetBaseUrl = `https://www.aliexpress.com/i/${id}.html`;
        let affLinks = {};
        let results = {};

        // Cookies mode URLs (genmode 1 = direct, genmode 2 = star redirect)
        const buildCookiesConfigs = (genmode) => {
            const makeUrl = (rawUrl) => {
                if (genmode === 1) return rawUrl;
                return `https://star.aliexpress.com/share/share.htm?redirectUrl=${encodeURIComponent(rawUrl)}`;
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
                    const cookiesGenmode1Valid = responses.slice(0, 8).every(r => r.data.success);

                    // If genmode 1 failed, redo the 8 cookie requests with genmode 2
                    let cookieResponses = responses.slice(0, 8);
                    console.log("cookies genmode 1 responses: ", cookieResponses.map(r => r.data));
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
                        console.log("cookies genmode 2 responses: ", cookieResponses.map(r => r.data));
                    }

                    // Map cookie responses (indices 0-7) + affiliate data (index 8 from original responses)
                    const allResponses = [...cookieResponses, responses[8]];

                    allResponses.forEach((response, index) => {
                        switch (index) {
                            case 0:
                                if (response.data.success) affLinks['points'] = response.data.data, console.log("points link: ", affLinks['points']);
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
                    console.log('API did not return points link, generating with API as fallback');
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
                    console.log(id);
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
