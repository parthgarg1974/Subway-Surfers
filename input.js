function userinput(miles)
{
  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "ArrowDown":
        // code for "down arrow" key press.
        break;
      case "ArrowUp":
        miles.move_up();
        // code for "up arrow" key press.
        break;
      case "ArrowLeft":
        miles.move_left();
        break;
      case "ArrowRight":
        miles.move_right();
        break;
      case "x":
        grayscale = grayscale ^ 1;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
  }, true);
  // the last option dispatches the event to the listener first,
  // then dispatches event to window
}