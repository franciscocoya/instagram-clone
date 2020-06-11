import $ from "jquery";

/**
 * Prevent select text when user click on a button or otheer
 * component that accept this type of event.
 */
export function preventSelection() {
  $("body").mousedown((e) => {
    e.preventDefault();
  });
}

/**
 * Fix nav when user scroll
 */
export function navFixed() {
  let heigthNav = $(".navBar").outerHeight(true);
  $(window).scroll((e) => {
    if ($(window).scrollTop() >= heigthNav) {
      $(".navBar").css({
        position: "fixed",
        zIndex: "5",
      });
    } else {
      $(".navBar").css({
        position: "relative",
        zIndex: "1",
      });
    }
  });
}

/**
 * Stylize the App search
 * When user clicks on the input field, clear search displays
 * and search icon reduces the padding.
 * On input blur, clear icon disapear.
 */
export function styleSearch() {
  let searchInput = $("#mainSearch");
  let spriteSearch = $(".coreSpriteSearchIcon");
  let spriteClearSearch = $(".coreSpriteSearchClear");

  $(document).click((e) => {
    var componentClicked = $(e.target)[0];
    if (componentClicked !== searchInput[0]) {
      spriteClearSearch.fadeOut();
      spriteSearch.css({
        top: "9px",
        left: "70px",
      });

      searchInput.css({
        paddingLeft: "0",
      });
    } else {
      spriteClearSearch.css({
        display: "block",
        top: "5px",
        right: "2px",
      });
      spriteSearch.css({
        top: "9px",
        left: "7px",
      });

      searchInput.css({
        paddingLeft: "1.2em",
      });
    }
  });
}
