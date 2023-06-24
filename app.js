document.addEventListener("DOMContentLoaded", function () {
  addListenersToButtons();
  accessLocalStorage();
});

function copyFnc(e) {
  console.log("🚀 ~ e:", e);
}

function addListenersToButtons() {
  document.getElementById("copyButton").addEventListener("click", copyFnc);
}

async function accessLocalStorage() {
  try {
    const key = "codeNavOpen";
    console.log("🚀 ~ //document.addEventListener ~ key:", key);

    // Get the current tab
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tab = tabs[0];
    console.log("🚀 ~ //document.addEventListener ~ tab:", tab);

    // Execute script in the current tab
    const fromPageLocalStore = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: insideExecution,
    });
    console.log(
      "🚀 ~ accessLocalStorage ~ fromPageLocalStore:",
      fromPageLocalStore
    );

    // Store the result
    //await chrome.storage.local.set({ [key]: fromPageLocalStore[0] });
    //document.getElementById("demo").innerHTML = fromPageLocalStore[0];
  } catch (err) {
    console.log("🚀 ~ //document.addEventListener ~ err:", err);
    // Log exceptions
  }
}

function insideExecution() {
  const cat = window.localStorage.getItem('se:fkey');
  console.log("🚀 ~ insideExecution ~ cat:", cat);
}
