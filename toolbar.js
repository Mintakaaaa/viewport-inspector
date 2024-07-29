document.addEventListener("DOMContentLoaded", () => {
  window.viewportMode = 1; // 1 = computer, 2 = tablet, 3 = phone
  window.toolbarOpen = false;

  const toolbarMainContainer = document.querySelector(".toolbar-main-container");
  const toolbarButtonContainer = toolbarMainContainer.querySelector(".toolbar-button-container");
  const toolbarOpenerContainer = toolbarMainContainer.querySelector(".toolbar-opener-container");

  toolbarMainContainer.style.right = (-toolbarButtonContainer.scrollWidth - 1) + "px"; // one off manual event; positioning toolbar so that only the opener shows.

  /**
   * Enable/disable toolbar buttons on click events.
   * @param {Node} activeButton // The viewport-setting button that was just clicked
   */
  const updateButtons = (activeButton) => {
    document.querySelectorAll('.toolbar-button-container i').forEach(btn => {
      btn.classList.toggle('disabled', btn === activeButton);
      btn.classList.toggle('enabled', btn !== activeButton);
    });
  };

  /**
   * Set the iframe width, update slider position, and text of iframe width
   * @param {Float} width Width of the iframe
   * @param {Boolean} fullscreen Whether the iframe is fullscreen
   */
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

  /**
   * Get the width of the iframe
   * @returns A number representing the width of the iframe
   */
  const getIframeMaxWidth = () => {
    const iframe = document.getElementById('resizable-iframe');
    const parent = iframe.parentElement;
    const parentStyles = window.getComputedStyle(parent);
    return Math.min(parent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight), window.innerWidth);
  };

  /**
   * Calls updateIframeAndSlider function
   * @param {Float} width Width of the iframe
   * @param {Boolean} fullscreen Whether the iframe is in fullscreen mode
   */
  const resizeIframe = (width, fullscreen) => {
    updateIframeAndSlider(width, fullscreen);
  };

  /**
   * Shift the toolbar to the right to hide the controls & remove box-shadow
   */
  const closeToolbar = () => {
    toolbarMainContainer.style.right = `-${(toolbarButtonContainer.scrollWidth + 1)}px`;
    toolbarButtonContainer.style.boxShadow = "none";
    window.toolbarOpen = false;
  };

  /**
   * Shift the toolbar to the left to show the controls & apply box-shadow
   */
  const openToolbar = () => {
    toolbarMainContainer.style.right = "0";
    toolbarButtonContainer.style.boxShadow = "0 0 10px 2px rgb(71, 71, 71)";
    window.toolbarOpen = true;
  };

  toolbarOpenerContainer.addEventListener("click", () => {
    window.toolbarOpen ? closeToolbar() : openToolbar();
  });

  /**
   * Resize the iframe depending on which button was pressed and enable/disable toolbar buttons.
   * @param {Int} width Width of the iframe
   * @param {Int} mode Which mode the window is in (mobile, desktop, tablet)
   * @returns 
   */
  const onButtonClick = (width, mode) => (event) => {
    const button = event.currentTarget;
    resizeIframe(width, false);
    window.viewportMode = mode;
    updateButtons(button);
  };

  updateWidthPixelsText(getIframeMaxWidth());

  document.querySelector(".fa-mobile-button").addEventListener("click", onButtonClick(375, 3));
  document.querySelector(".fa-tablet-button").addEventListener("click", onButtonClick(768, 2));
  // below is a slight variation of the onButtonClick function
  document.querySelector(".fa-desktop").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const maxWidth = getIframeMaxWidth();
    resizeIframe(maxWidth, true);
    window.viewportMode = 1;
    updateButtons(button);
  });

  const minViewportWidth = 320; // minimum viewport width; change it to your liking.
  const toolbarScrollTimeline = document.querySelector("#toolbar-scroll-timeline");
  const toolbarScrubber = document.querySelector("#toolbar-scrubber");

  toolbarScrubber.style.left = `${toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth}px`;

  toolbarScrubber.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    let offsetX = e.clientX - toolbarScrubber.offsetLeft;

    const mouseMoveHandler = (e) => {
      // while moving the mouse and scrubbing,
      // set the scrubber position to where the mouse is currently located
      // and resize the iframe accordingly.
      
      let newLeft = e.clientX - offsetX;
      const maxLeft = toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      toolbarScrubber.style.left = `${newLeft}px`; // set the scrubber position to where the scrubber got scrubbed to.

      const maxViewportWidth = getIframeMaxWidth();
      const sliderPosition = newLeft / maxLeft;
      const viewportWidth = minViewportWidth + sliderPosition * (maxViewportWidth - minViewportWidth);
      resizeIframe(viewportWidth, false); // resize iframe depending on the location of the scrubber
    };

    const mouseUpHandler = () => { // when you stop scrubbing, remove the mouse move and mouse up listeners
      document.body.style.cursor = 'default';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    // when you press on the scrubber, start listening for mousemove and mouseup events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  toolbarScrollTimeline.addEventListener('click', (e) => {
    // position the scrubber on where the user clicked, and
    // resize the iframe accordingly
    const rect = toolbarScrollTimeline.getBoundingClientRect();
    let xPos = e.clientX - rect.left - (toolbarScrubber.offsetWidth / 2);

    xPos = Math.max(0, Math.min(xPos, toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth));
    toolbarScrubber.style.left = `${xPos}px`;

    const maxViewportWidth = getIframeMaxWidth();
    const sliderPosition = xPos / (toolbarScrollTimeline.offsetWidth - toolbarScrubber.offsetWidth);
    const viewportWidth = minViewportWidth + sliderPosition * (maxViewportWidth - minViewportWidth);
    resizeIframe(viewportWidth, false); // resize iframe depending on where the timeline was clicked
    updateButtons(null); // Enable all buttons after clicking on the slider
  });
});


/**
 * 
 * @param {Float} viewportWidth Current width of iframe/resizable website
 */
function updateWidthPixelsText(viewportWidth) {
  document.querySelector("#width-pixels-text").textContent = `${Math.round(viewportWidth)}px`;
}