document.addEventListener("DOMContentLoaded", () => {
  window.viewportMode = 1; // 1 = computer, 2 = tablet, 3 = phone
  window.toolbarOpen = false;

  const toolbarMainContainer = document.querySelector(".toolbar-main-container");
  const toolbarButtonContainer = toolbarMainContainer.querySelector(".toolbar-button-container");
  const toolbarOpenerContainer = toolbarMainContainer.querySelector(".toolbar-opener-container");

  toolbarMainContainer.style.right = (-toolbarButtonContainer.scrollWidth - 1) + "px"; // one off manual event; positioning toolbar so that only the opener shows.

  const updateButtons = (activeButton) => {
    document.querySelectorAll('.toolbar-button-container i').forEach(btn => {
      btn.classList.toggle('disabled', btn === activeButton);
      btn.classList.toggle('enabled', btn !== activeButton);
    });
  };

  const updateIframeAndSlider = (width, fullscreen) => {
    document.getElementById('resizable-iframe').style.width = fullscreen ? "100%" : `${width}px`;

    const maxViewportWidth = getIframeMaxWidth();
    const minViewportWidth = 320;
    const sliderPosition = (width - minViewportWidth) / (maxViewportWidth - minViewportWidth);
    const toolbarScrollTimeline = document.querySelector("#toolbar-scroll-timeline");
    const toolbarScrubber = document.querySelector("#toolbar-scrubber");
    const newLeft = Math.max(0, Math.min(sliderPosition * (toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth), toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth));

    toolbarScrubber.style.left = `${newLeft}px`;
    updateWidthPixelsText(width);
  };

  const getIframeMaxWidth = () => {
    const iframe = document.getElementById('resizable-iframe');
    const parent = iframe.parentElement;
    const parentStyles = window.getComputedStyle(parent);
    return Math.min(parent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight), window.innerWidth);
  };

  const resizeIframe = (width, fullscreen) => {
    updateIframeAndSlider(width, fullscreen);
  };

  const closeToolbar = () => {
    toolbarMainContainer.style.right = `-${(toolbarButtonContainer.scrollWidth + 1)}px`;
    toolbarButtonContainer.style.boxShadow = "none";
    window.toolbarOpen = false;
  };

  const openToolbar = () => {
    toolbarMainContainer.style.right = "0";
    toolbarButtonContainer.style.boxShadow = "0 0 10px 2px rgb(71, 71, 71)";
    window.toolbarOpen = true;
  };

  toolbarOpenerContainer.addEventListener("click", () => {
    window.toolbarOpen ? closeToolbar() : openToolbar();
  });

  const onButtonClick = (width, mode) => (event) => {
    const button = event.currentTarget;
    resizeIframe(width, false);
    window.viewportMode = mode;
    updateButtons(button);
  };

  updateWidthPixelsText(getIframeMaxWidth());

  document.querySelector(".fa-mobile-button").addEventListener("click", onButtonClick(375, 3));
  document.querySelector(".fa-tablet-button").addEventListener("click", onButtonClick(768, 2));
  document.querySelector(".fa-desktop").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const maxWidth = getIframeMaxWidth();
    resizeIframe(maxWidth, true);
    window.viewportMode = 1;
    updateButtons(button);
  });

  const minViewportWidth = 320;
  const toolbarScrollTimeline = document.querySelector("#toolbar-scroll-timeline");
  const toolbarScrubber = document.querySelector("#toolbar-scrubber");

  toolbarScrubber.style.left = `${toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth}px`;

  toolbarScrubber.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    let offsetX = e.clientX - toolbarScrubber.offsetLeft;

    const mouseMoveHandler = (e) => {
      let newLeft = e.clientX - offsetX;
      const maxLeft = toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      toolbarScrubber.style.left = `${newLeft}px`;

      const maxViewportWidth = getIframeMaxWidth();
      const sliderPosition = newLeft / maxLeft;
      const viewportWidth = minViewportWidth + sliderPosition * (maxViewportWidth - minViewportWidth);
      resizeIframe(viewportWidth, false);
    };

    const mouseUpHandler = () => {
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  toolbarScrollTimeline.addEventListener('click', (e) => {
    const rect = toolbarScrollTimeline.getBoundingClientRect();
    let xPos = e.clientX - rect.left - (toolbarScrubber.offsetWidth / 2);

    xPos = Math.max(0, Math.min(xPos, toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth));
    toolbarScrubber.style.left = `${xPos}px`;

    const maxViewportWidth = getIframeMaxWidth();
    const sliderPosition = xPos / (toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth);
    const viewportWidth = minViewportWidth + sliderPosition * (maxViewportWidth - minViewportWidth);
    resizeIframe(viewportWidth, false);
    updateButtons(null); // Enable all buttons after clicking on the slider
  });
});

function updateWidthPixelsText(viewportWidth) {
  document.querySelector("#width-pixels-text").textContent = `${Math.round(viewportWidth)}px`;
}