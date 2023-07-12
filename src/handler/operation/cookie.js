function cookie(tab) {
    async function getCookie(cookieStoreItems) {
        const cookies = await chrome.cookies.getAll({ url: tabToStringUrl(tab) });
        const cookieStoreItemsKeys = cookieStoreItems.map(({ key }) => key);

        const matchCookies = cookies
            .filter(({ name }) => cookieStoreItemsKeys.includes(name))
            .map(({ name, value }) => ({ name, value, type: TYPES.COOKIE }));

        return cookieStoreItems.map((item) => {
            item.value =
                matchCookies.find(({ name }) => name === item.key)?.value || undefined;
            if (item.subKey) {
                try {
                    item.value = JSON.parse(value)[item.subKey];
                } catch {
                    item.value = undefined;
                }
            }
            return item;
        });
    }

    async function saveCookieValue(key, subKey, value) {
        const url = tabToStringUrl(tab);
        const domain = tabToStringDomain(tab);
        let details = await chrome.cookies.get({
            name: key,
            url,
        });
        if (details === null) {
            details = { name: key };
        }

        let newValue = value;

        if (subKey) {
            const originalValue = details.value;
            if (details.value !== undefined)
                try {
                    newValue = JSON.parse(originalValue);
                } catch (e) {
                    newValue = {};
                }
            else newValue = {};

            newValue[subKey] = value;
        }

        const stringifiedValue =
            newValue instanceof Object ? JSON.stringify(newValue) : newValue;

        details.value = stringifiedValue;

        delete details.hostOnly;
        delete details.session;

        return new Promise((resolve) => {
            chrome.cookies.set({ ...details, url, domain }, function (cookie) {
                if (cookie) resolve();
                else reject();
            });
        });
    }

    function tabToStringUrl(tab) {
        const url = new URL(tab.url);
        return `${url.protocol}//${url.hostname}`;
    }

    function tabToStringDomain(tab) {
        const url = new URL(tab.url);
        return "." + url.hostname;
    }

    return { getCookie, saveCookieValue };
}
