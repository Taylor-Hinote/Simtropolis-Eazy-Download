// contentScript.js
const parentElements = document.querySelectorAll('li.ipsDataItem');

parentElements.forEach(parentElement => {
  const downloadLink = parentElement.querySelector('.ipsType_break a');
  if (downloadLink) {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.className = 'download-button';
    downloadButton.style.margin='0 auto';
    downloadButton.style.display='block';
    downloadButton.style.padding='5px 10px';
    downloadButton.style.border='1px solid #ccc';
    downloadButton.style.borderRadius='5px';
    downloadButton.style.cursor='pointer';
    downloadButton.style.backgroundColor='#ff69b4';
    downloadButton.style.color='#fff';
    downloadButton.style.fontWeight='bold';
    downloadButton.style.fontSize='14px';
    downloadButton.style.textAlign='center';
    downloadButton.style.textDecoration='none';
    downloadButton.style.outline='none';
    downloadButton.style.boxShadow='none';
    downloadButton.style.width='100%';

    // // Disable all download buttons initially
    // downloadButton.disabled = true;

    // Add click event listener to change color on click and initiate download
    downloadButton.addEventListener('click', () => {
      downloadButton.style.backgroundColor='#3a3a3a'; // Change color on click
      downloadButton.textContent = 'Downloading...';

      // Initiate the download by opening the URL
      // window.open(downloadLink.href + '?do=download', '_blank');
    });

    const downloadLinkWrapper = document.createElement('a');
    downloadLinkWrapper.href = downloadLink.href + '?do=download';
    // downloadLinkWrapper.download = ''; // This triggers the download behavior
    downloadLinkWrapper.appendChild(downloadButton);

    const submittedInfo = parentElement.querySelector('.ipsType_medium strong');
    if (submittedInfo) {
      submittedInfo.appendChild(downloadLinkWrapper);
    }
  }
});
