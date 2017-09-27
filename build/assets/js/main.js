'use strict';

$(function () {
  popupGift();
});

function popupGift() {
  var giftConfSubmit = false,
      bodyScroll = 0;
  var $body = $('body'),
      $page = $('.page'),
      $pageContent = $page.find('.page_content'),
      $popup = $('.popup-gift'),
      $popupOkButton = $popup.find('.popup-gift_button-ok');
  var $item = $popup.find('.popup-gift_block-item');

  init();

  function open() {
    bodyScroll = $(document).scrollTop();

    $pageContent.css({ top: -bodyScroll });
    $body.addClass('popup-opened');

    $(document).scrollTop(0);

    $item.addClass('show');

    setTimeout(function () {
      $body.removeClass('popup-opened').addClass('popup-open');
    }, 300);
  }

  function close() {
    $body.removeClass('popup-open').addClass('popup-opened');

    setTimeout(function () {
      $body.removeClass('popup-opened').scrollTop(bodyScroll);
      $pageContent.removeAttr('style');
    }, 300);
  }

  function showGift(id) {
    var $content = $popup.find('.popup-gift_block-content');

    $item = $content.find('.popup-gift_block-item');

    $item.removeClass('show');

    setTimeout(function () {
      $item = $('<div class="popup-gift_block-item" />');

      $item.append('\n        <div class="popup-gift_image">\n          <img src="assets/img/gifts/image-' + id + '.png" alt="" class="popup-gift_image-item">\n        </div>\n        <p class="popup-gift_text">\u0422\u0435\u043F\u0435\u0440\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0432\u0430\u0448!</p>\n        <button class="popup-gift_button-close button">\u0421\u043F\u0430\u0441\u0438\u0431\u043E</button>\n      ');

      $item.remove();
      $content.html($item);

      setTimeout(function () {
        $item.addClass('show');
      }, 0);
    }, 300);
  }

  function getGift() {
    if (!giftConfSubmit) {
      giftConfSubmit = true;

      fetch('model/gift.php').then(function (response) {
        if (response.status === 200) return response.json();else giftConfSubmit = false;
      }).then(function (json) {
        if (json.res) showGift(json.giftId);
      });
    }
  }

  function init() {
    open();

    $popupOkButton.on('click', getGift);
    $(document).on('click', '.popup-gift_button-close', close);
  }
}