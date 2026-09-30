const crypto = require("crypto");
const axios = require('axios');
const cheerio = require('cheerio');
const { HttpsProxyAgent } = require('https-proxy-agent');

class AliExpressLibrary {
    constructor(AppKey, API_SECRET, Tracking_ID, AdminID, proxy = "") {
        this.proxy = proxy;
        this.AdminID = AdminID;
        this.generateMode = "cookies"; // api or cookies
        this.isInTimeout = false;
        this.API_URL = "https://api-sg.aliexpress.com/sync";
        this.AppKey = AppKey;
        this.API_SECRET = API_SECRET;
        this.Tracking_ID = Tracking_ID;
                this.cookies = 'ali_apache_id=33.64.211.54.1779984047444.244458.8; cna=sVSfItYOFhwCAWnrhy/5x72Y; af_ss_a=1; af_ss_b=1; x-hng=lang=en-US; _gcl_au=1.1.1761851887.1780562054; _ga=GA1.1.127079758.1780562054; xman_us_f=x_locale=en_US&x_l=1&x_user=DZ|RABEH|MSNF|ifm|4860735742&x_lid=dz3265767613aseae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%225856849ddcbb4dd9a90eda679e57ef37-1780700763697-04522-_c45d2J9R%22%2C%22affiliateKey%22%3A%22_c45d2J9R%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%224860735742%22%2C%22tagtime%22%3A1780700763697%7D&acs_rt=c1a2cf9ee7554620a3ac5c6b4451ff7c&intl_locale=en_US; aeu_cid=5856849ddcbb4dd9a90eda679e57ef37-1780700763697-04522-_c45d2J9R; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005012340431088%091005012340203471%091005006592615834%091005009689452176%091005009667523502%091005009689476054%091005010015859351%091005010313616628; lzd_uid=3100000119887; lzd_cid=38ca58e3-1940-460a-9cb3-c911c14ea0ec; _tb_token_=38757eb85663e; acs_usuc_t=x_csrf=knno6x_1i58l&acs_rt=424952f40225498ab3e69ea43dc57ddc; global_seller_sid=12c46e7714245ac63639b1a65e7d4cbe; _m_h5_tk=3ebdf0847381c443ecc65fa93e6fab09_1780742903613; _m_h5_tk_enc=8083bf5d12c5b2f2d73b46814b26ffd1; _lang=en_US; x5sec=7b22617365727665722d696e746c3b33223a22307c434a546d6a394547455058516a3566372f2f2f2f2f7745776d37614f69502f2f2f2f2f2f41513d3d222c2274223a313738303734303839302c22733b32223a2230306439366336646532383464373164227d; aep_usuc_f=city=null&re_sns=google&s_locale=zh_CN&b_locale=en_US&site=ara&province=null&c_tp=USD&x_alimid=4860735742&isfb=y&ups_d=0|0|0|0&isb=y&ups_u_t=&region=DZ&ae_u_p_s=1; isg=BFhY8lChhhg9paqnJIp7B5PfKYbqQbzLT8-PRJJJ3RNGLfkXOlSVWUAMYX0dPXSj; sgcookie=E1004gQ4pBHcQjvejBUeIBpFrskIih7j2egJlXw1J76odj+2ovrvZEdeZ1oniC+dMALuWV//r25S08tovn5La945XqZki5DEZYVLhxxd3y940X0=; xman_us_t=ctoken=18_xbe_sba61r&l_source=aliexpress&ae_g=n&x_user=Mb3NAYBpTOnRvcdO7WC6iRw0nQlZA53+1GyQ5+VL5Y0=&x_lid=dz3265767613aseae&sign=y&rmb_pp=rabehmsnf1@gmail.com; xman_t=8GnVkVLE0janhntECcbJJ5CNmwMrvDFUxjqyVN8h59p5EfrpM+5+trLrwRQhq1lQ6nr91o0zFLX8N+4YDuxP3UbXRsQlj46FghcopJHwh2pZQClatcO3qsEgPLXRvm5CqqxWmfWK+C1ioJBPT0oni5DIpzsiKChM0a7ZJxcRumy8QDXaODi/RxKec450jy51nCurR4f/xwZZCMr0UU0x0dqLcbLOCCuMEWpheroq12XlYKzGUluLOMo9Y+B29pYL7ozwtFAbwqgZqPVwmo1yThq8xZXtVglQi9wOAh5Mo30bZwxFuunUzj+kRKvQzsia09GGRrYOJt/AVZYB9yDKKPrtc6u+wiZmvcql2WVmWnOOOlJFLKtFKeGMq5fT0XFafb5mzuyMtg/fOKm9iNxF9lXKpM5FkecTNd8KAMse1M7DAn7zE1fPhU9nqwyo8X+vbfyxt1Mt05Z4sKvE4yrc4zE7lQZj9X1giha1fawCqW+kY6/bBnn/QCDv4KZ56Uq6l5dQOeQB6AdMeTUVOYbXkg2VsxVRtl5kTGVRhCV777XosqZgJUgfAvm3AUF0IqtLzLKonTCJh5jnzdZaiU40nls9pBX9ilpJh+eY+h6fVFjxkPIdkeyhVZLR+0ZsCmDUTo1yNw6iyGsjf33X8Kd9sRdPTfdlzQSdKjfHRZtocd9wUD3KOpqvthb2A3nDsq4iwASX6plfBO0=; _ga_VED1YSGNC7=GS2.1.s1780740924$o2$g0$t1780740924$j60$l0$h0; xman_f=+fYAC3edTf9w8nQHFMOzKqr1ccoDu+Foslg+d88HIupzs7PNCjlHRFCNk4Ki6Ilr0+pGzWzcUotwFGhoinCy1FkL2LVOA7vifeCAB2XZQgFVADpBdDt6m9VKvCkY2jOgC10vrmLwPuG1dqx8zq2uN3lDSc5qU0BJatvuBLUHjEc2q4ayP+YBLOgmprYSHtqg/2hLx2ZkyYNp5hnvagGnmmvVzvclzgzFmEEUbLXlXb7+E5ZyDs2ahgVK+wvBZ7W7bIrQ48oGsQMt0T/R2T7iKVNq1qYpNNlwwxLhrEzUms9jEkmw+kR2fjq1Pv3sKKpBb01NXVrBlrlY951hnRBsjv3dtyI/GgiOP0Vcp7Q4myJU+/jMKYJDXBQvBGNN/aqYjvtfENwgI6ABvLm61dWC4ZURpjmOf+7h60VGjK5ppFGWH6jSObruMKIdiR5sOiWe; global_sid=1af5e310b88e2e300d61b701e0c44373; lzd_b_csg=cd663c5a; JSESSIONID=E1D69166824F316E6DF29584C700AC21; _baxia_sec_cookie_=%257B%2522tfstk%2522%253A%2522g7Prktt-c_Crumjg7PcFQ15Iqwl-tXS1xWiI-y4nP0moObMn-kZDNvX8A6RUyy0QF0i73Dr000bRJwCU-o4BOaEIVo-3fkioO8aCYoZgbvwSdT33YyobABNUJBu3-kQ-AaBbyzhKtGs_z1a8ySK6muVyZIf0kVAn-tMubJ0fMGs11sNokdRffysy1_UmJm0o-BDhun0SmUAux0DDmVuttDq3xm4m72AnxLDnmKmx-Xm3xXbqim3EtDqntZzmwJUu-IusEatG0eBAqLH-jzm2tC-xzY0c6cdHTSHUuc4upBA3g4kzGkV8-Pk7KPHTNy5eMbaanj0_y_Rqsz0aVmZGsIl0lrqIB-Ip1xE4TAFoeevuuWorI7D2RCaZG2qnL-Iw14l73APzewK0rlizIbUB7gaqQ-ktoxYeEbw_5WHgZ_-tcA3UVmZGsIlmKgoWvqcr8WnnJpkokqo1uZSQgf3Mr8_24ppKncuqfanJppHoyqo1uapppxmSuc_Xu%2522%252C%2522lwrid%2522%253A%2522AgGeb1ErdcUQ6oSQeuI1X39uI03r%2522%252C%2522lwrtk%2522%253A%2522AAIEaiRjqyzv3pCUGFPh%252Bmq6imd2Xn5IKQE1MFzLoaNEA22dFQewmhI%253D%2522%252C%2522epssw%2522%253A%252212*f-pKB0tGGIAw-a5z8UizSVbiI1nYfEUndKuSmAqHGRbF4UXFl-IGt6XF8UQwWjoO4RWGGGOTj_e6XsMVb046bZ0xoDSrwAvLmiLsKT8j1GQy6p5yezvhTOcLoJWT8yQIPi7yXupwAF1xaxSn4o4cEJyhMwhppp_UrpqSQGyorPetXOFZo4wIY3N_OT0ov_p8iGmVtrXyinkEsWYry9Lj1i9HeIMGGMei0MFhpN0GyDKGGM3OGREMbwFE-dIkgcYGGGs88Kt-G_ptssxQPIMY6wfh7iYkfCMQctRmCnmPStxsKf5GeKPhEPqpKb4LyYCVzJST2mpxwSsUUUQf%2522%257D';

        // --- Rate limiting for the official AliExpress "sync" API ---
        // api-sg.aliexpress.com/sync suspends the app key for a short
        // period if it receives more than ~1 request/second. Every call
        // to that endpoint (from generateApiLinkes and getDataAffiliate,
        // including internal retries) MUST go through _callSyncApi, which
        // serializes calls on a promise queue and guarantees at least
        // `minApiInterval` ms between two consecutive calls — even when
        // they're fired "at the same time" via Promise.all.
        this.minApiInterval = 1000; // ms between two api-sg.aliexpress.com/sync calls
        this._apiQueue = Promise.resolve();
        this._lastApiCallAt = 0;
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

    /**
     * Single choke point for every call to the official AliExpress sync
     * API. Signs the payload, then chains onto a shared promise queue so
     * calls never fire less than `minApiInterval` ms apart, no matter how
     * many callers request one "at once" (e.g. generateApiLinkes and
     * getDataAffiliate running inside the same Promise.all).
     */
    _callSyncApi(payload) {
        const run = this._apiQueue.then(async () => {
            const wait = this.minApiInterval - (Date.now() - this._lastApiCallAt);
            if (this._lastApiCallAt && wait > 0) {
                await new Promise(resolve => setTimeout(resolve, wait));
            }
            this._lastApiCallAt = Date.now();
            const sign = this.signRequest(payload);
            const allParams = { ...payload, sign };
            return axios.post(this.API_URL, new URLSearchParams(allParams));
        });
        // Keep the queue alive even if this particular call fails, so
        // later calls are still throttled correctly.
        this._apiQueue = run.catch(() => {});
        return run;
    }

    /**
     * Single source of truth for "is this product affiliated?".
     * A product is affiliated when aliexpress.affiliate.productdetail.get
     * comes back with resp_code 200 AND at least one product record — that
     * record then has real price/title/store data. Otherwise the product
     * is not affiliated: we can still generate a promotion link for it,
     * but not pull product details from the affiliate API.
     */
    _parseAffiliateProductDetails(response) {
        const respResult = response?.aliexpress_affiliate_productdetail_get_response?.resp_result;
        if (!respResult || respResult.resp_code != 200) {
            return { isAffiliated: false, product: null };
        }
        const count = respResult.result?.current_record_count;
        const product = respResult.result?.products?.product?.[0];
        if (!count || count == 0 || !product) {
            return { isAffiliated: false, product: null };
        }
        return { isAffiliated: true, product };
    }

    _buildInfoFromProduct(product) {
        return {
            title: product.product_title,
            price: product.sale_price,
            store: product.shop_name,
            image: product.product_main_image_url,
            discount: product.discount || '2',
            storeRate: product.evaluate_rate || '0'
        };
    }

    /**
     * Non-affiliated fallback: scrape a basic title/image preview straight
     * from the public product page instead of the affiliate API.
     */
    async _scrapeProductPreview(id) {
        const proxyAgent = new HttpsProxyAgent(this.proxy);
        const config = {
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
            },
            proxy: false,
            httpsAgent: proxyAgent,
            url: `https://vi.aliexpress.com/i/${id}.html`
        };

        try {
            const response = await axios.request(config);
            const $ = cheerio.load(response.data);
            return {
                title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                image: $('meta[property="og:image"]').attr('content') || ''
            };
        } catch (error) {
            return { title: '', image: '' };
        }
    }

    // genmode 1 = direct source values, genmode 2 = star.aliexpress.com redirect URLs
    async generateApiLinkes(id, TrackingId, mode, genmode = 1) {
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
        const source_values = rawUrls
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

        const affresponses = await this._callSyncApi(payload);
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
                if (sourceValue.includes('sourceType=561') || sourceValue.includes('sourceType%3D561')) key = 'limited';
                else if (sourceValue.includes('sourceType=562') || sourceValue.includes('sourceType%3D562')) key = 'super';
                else if (sourceValue.includes('sourceType=680') || sourceValue.includes('sourceType%3D680')) key = 'bigsave';
                else if (sourceValue.includes('sourceType=570') || sourceValue.includes('sourceType%3D570')) key = 'choice';
                else if (sourceValue.includes('sourceType=504') || sourceValue.includes('sourceType%3D504')) key = 'mohtamal';
                else if (sourceValue.includes('BundleDeals2')) key = 'bundel';
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

        try {
            const response = await this._callSyncApi(payload);
            return response.data;
        } catch (error) {
            console.error('Error fetching data from AliExpress API:', error);
            throw error;
        }
    }

    // Ordered [key, targetUrl] pairs — order defines which promotion-link
    // key each of the 8 portal responses maps to.
    _buildCookieUrls(id, genmode) {
        const targetBaseUrl = `https://www.aliexpress.com/i/${id}.html`;
        const wrap = (rawUrl) => genmode === 1
            ? rawUrl
            : `https://star.aliexpress.com/share/share.htm?redirectUrl=${encodeURIComponent(rawUrl)}`;

        return [
            ['points', wrap(`${targetBaseUrl}?sourceType=620&channel=coin`)],
            ['limited', wrap(`${targetBaseUrl}?sourceType=561`)],
            ['super', wrap(`${targetBaseUrl}?sourceType=562`)],
            ['bigsave', wrap(`${targetBaseUrl}?sourceType=680`)],
            ['choice', wrap(`${targetBaseUrl}?sourceType=570&channel=coin`)],
            ['mohtamal', wrap(`${targetBaseUrl}?sourceType=504&channel=coin`)],
            ['pointsNew', wrap(`https://m.aliexpress.com/p/coin-index/index.html?_immersiveMode=true&tabname=configTab_1926001&from=syicon&productIds=${id}`)],
            ['bundel', wrap(`https://www.aliexpress.com/ssr/300000512/BundleDeals2?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&productIds=${id}&afSmartRedirect=y`)],
        ];
    }

    _buildCookieRequestConfig(trackId, targetUrl) {
        const base = `https://portals.aliexpress.com/tools/linkGenerate/generatePromotionLink.htm?trackId=${trackId}&targetUrl=`;
        return {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${base}${encodeURIComponent(targetUrl)}&afSmartRedirect=y`,
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
        // Note: these hit portals.aliexpress.com, not the rate-limited
        // api-sg.aliexpress.com/sync endpoint, so they don't go through
        // _callSyncApi.
    }

    async _generateCookieLinksOnce(id, trackId, genmode) {
        const entries = this._buildCookieUrls(id, genmode);
        const responses = await Promise.all(
            entries.map(([, url]) => axios.request(this._buildCookieRequestConfig(trackId, url)))
        );
        console.log(`cookies genmode ${genmode} responses: `, responses.map(r => r.data));

        const links = {};
        let allValid = true;
        responses.forEach((response, i) => {
            const [key] = entries[i];
            if (response.data.success) {
                links[key] = response.data.data;
            } else {
                allValid = false;
            }
        });
        return { links, allValid };
    }

    /**
     * Tries cookie-based link generation with genmode 1 first. If any of
     * the 8 requests failed, retries the whole batch with genmode 2
     * (star.aliexpress redirect URLs) and uses those results instead.
     */
    async _generateCookieLinks(id, trackId) {
        const first = await this._generateCookieLinksOnce(id, trackId, 1);
        if (first.allValid) return first.links;

        console.log('cookies genmode 1 failed, retrying with genmode 2');
        const second = await this._generateCookieLinksOnce(id, trackId, 2);
        return second.links;
    }

    async getData(id, isMe) {
        let TrackingId;
        if (isMe === this.AdminID) {
            TrackingId = "default";
        }
        else {
            TrackingId = "Rbhcoinbot";
        }
        let affLinks = {};
        let results = {};
        let imgAvailable = false;
        let titleAvailable = false;
        let erroracount = 0;

        try {
            let affiliateResponse;

            if (this.generateMode === "api") {
                console.log(`i am in the api mode and the mode is ${this.generateMode}`);
                const [linkResponse, detailResponse] = await Promise.all([
                    this.generateApiLinkes(id, TrackingId, 1),
                    this.getDataAffiliate(id)
                ]);
                if (linkResponse) affLinks = linkResponse;
                affiliateResponse = detailResponse;
            } else {
                console.log(`i am in the coockies mode and the mod is ${this.generateMode}`);
                const [cookieLinks, detailResponse] = await Promise.all([
                    this._generateCookieLinks(id, TrackingId),
                    this.getDataAffiliate(id)
                ]);
                affLinks = cookieLinks;
                affiliateResponse = detailResponse;
            }

            const { isAffiliated, product } = this._parseAffiliateProductDetails(affiliateResponse);

            if (isAffiliated) {
                imgAvailable = true;
                titleAvailable = true;
                results['info'] = this._buildInfoFromProduct(product);
            } else {
                const preview = await this._scrapeProductPreview(id);
                results['ihtiyat'] = preview;
                imgAvailable = preview.image !== "";
                titleAvailable = preview.title !== "";
            }

            if (!('points' in affLinks)) {
                console.log('API did not return points link, generating with API as fallback');
                affLinks = await this.generateApiLinkes(id, TrackingId, 2);
            }
            affLinks["mode"] = this.generateMode;
        } catch (error) {
            console.error(`error in promise all : ${error.message}`);
            erroracount++;
            if (erroracount === 3) {
                results = { "error": "tafa7a al kayl", "imgAvailable": "True" };
                console.log(id);
                affLinks = await this.generateApiLinkes(id, TrackingId, 2);
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
    getGenerateMode() {
        return this.generateMode;
    }
    SetCookies = (cookies) => {
        console.log("SET:", cookies);
        this.cookies = cookies;
        console.log("the new coockie ", this.cookies);
    }
}
module.exports = AliExpressLibrary;