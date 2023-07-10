function appStore(onStoreUpdate) {
    let storeItems = [];

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace !== "local") return;
        if (!changes?.storeItems) return;

        storeItems = changes.storeItems.newValue;
        onStoreUpdate(storeItems);
    });

    async function getItems() {
        try {
            const storeResult = await chrome.storage.local.get(["storeItems"]);
            storeItems = storeResult["storeItems"];
            return storeItems;
        } catch (e) {
            console.log("🐶 ~ could not get items from extension store:", e);
        }
    }

    async function addItem(newItem) {
        try {
            let lastId = getLastId();
            newItem.id = ++lastId;

            storeItems.push(newItem);

            return new Promise((resolve) => {
                chrome.storage.local.set(
                    { storeItems: [...storeItems, newItem] },
                    function () {
                        resolve();
                    }
                );
            });
        } catch (e) {
            console.log("🐶 ~ could not add items to extension store:", e);
        }
    }

    async function removeItems(idsToRemove) {
        try {
            await chrome.storage.local.set({
                storeItems: storeItems.filter(({ id }) => !idsToRemove.includes(id)),
            });
        } catch (e) {
            console.log("🐶 ~ could not delete items from extension store:", e);
        }
    }

    function getLastId() {
        return [...storeItems].sort((a, b) => a.id - b.id).slice(-1)[0]?.id || 0;
    }

    return {
        addItem,
        removeItems,
        getItems,
    };
}
