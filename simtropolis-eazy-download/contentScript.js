// contentScript.js

// Keep track of all download buttons and their disabled state
const downloadButtons = [];
const downloadTimestamps = []; // Store timestamps of downloads

// Send a message to initiate the download when the button is clicked
const startDownload = (downloadUrl, button) => {
  const now = Date.now();
  const lastDownloadTimestamp = downloadTimestamps[downloadTimestamps.length - 1];

  // Check if last download was made within the past 30 seconds
  if (lastDownloadTimestamp && now - lastDownloadTimestamp < 30000) {
    // Apply waiting logic for 10 seconds
    setTimeout(() => {
      initiateDownload(downloadUrl, button);
    }, 10000);
  } else {
    initiateDownload(downloadUrl, button);
  }
};

// Initiate the download
const initiateDownload = (downloadUrl, button) => {
  chrome.runtime.sendMessage({ action: "startDownload", downloadUrl });
  disableAllButtons();
  button.disabled = true;
  button.style.backgroundColor = '#ccc'; // Change color when disabled
  downloadTimestamps.push(Date.now());
};

// Disable all download buttons
const disableAllButtons = () => {
  downloadButtons.forEach(button => {
    button.disabled = true;
    button.style.backgroundColor = '#ccc'; // Change color when disabled
  });
};

const parentElements = document.querySelectorAll('li.ipsDataItem');

parentElements.forEach(parentElement => {
  const downloadLink = parentElement.querySelector('.ipsType_break a');
  if (downloadLink) {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.className = 'download-button';
    downloadButton.style.margin = '0 auto';
    downloadButton.style.display = 'block';
    downloadButton.style.padding = '5px 10px';
    downloadButton.style.border = '1px solid #ccc';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.backgroundColor = '#ff69b4';
    downloadButton.style.color = '#fff';
    downloadButton.style.fontWeight = 'bold';
    downloadButton.style.fontSize = '14px';
    downloadButton.style.textAlign = 'center';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.outline = 'none';
    downloadButton.style.boxShadow = 'none';
    downloadButton.style.width = '100%';

    // Add hover effect and transition
    downloadButton.style.transition = 'all 0.2s ease-in-out';
    downloadButton.style.opacity = '1'; // Initial opacity

    downloadButton.addEventListener('mouseenter', () => {
      downloadButton.style.opacity = '0.75';
      downloadButton.style.border = '3px solid #ff69b4';
    });

    downloadButton.addEventListener('mouseleave', () => {
      downloadButton.style.opacity = '1';
      downloadButton.style.border = '1px solid #ccc';
    });

    downloadButton.addEventListener('click', () => {
      startDownload(downloadLink.href + '?do=download', downloadButton);
    });

    // Store the button in the array
    downloadButtons.push(downloadButton);

    const downloadLinkWrapper = document.createElement('a');
    downloadLinkWrapper.href = '#'; // Just to make the button clickable
    downloadLinkWrapper.download = ''; // This triggers the download behavior
    downloadLinkWrapper.appendChild(downloadButton);

    const submittedInfo = parentElement.querySelector('.ipsType_medium strong');
    if (submittedInfo) {
      submittedInfo.appendChild(downloadLinkWrapper);
    }
  }
});

// Listen for download completion message from background script
chrome.runtime.onMessage.addListener(message => {
    if (message.action === "downloadComplete") {
      // Re-enable all buttons and reset color
      downloadButtons.forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = '#ff69b4'; // Revert to original color
      });
    }
  });
