chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startDownload") {
      const downloadUrl = message.downloadUrl;
      chrome.downloads.download({ url: downloadUrl }, downloadId => {
        // Monitor download progress
        chrome.downloads.onChanged.addListener(downloadDelta => {
          if (downloadDelta.id === downloadId && downloadDelta.state && downloadDelta.state.current === "complete") {
            chrome.tabs.sendMessage(sender.tab.id, { action: "downloadComplete" });
          }
        });
      });
    }
  });
  