'use strict';

$(() => {
  popupGift();
});

function popupGift() {
  let giftConfSubmit = false,
    bodyScroll = 0;
  const $body = $('body'),
    $page = $('.page'),
    $pageContent = $page.find('.page_content'),
    $popup = $('.popup-gift'),
    $popupOkButton = $popup.find('.popup-gift_button-ok');
  let $item = $popup.find('.popup-gift_block-item');

  init();

  function open() {
    bodyScroll = $(document).scrollTop();

    $pageContent.css({ top: -bodyScroll });
    $body.addClass('popup-opened');

    $(document).scrollTop(0);
    
    $item.addClass('show');

    setTimeout(() => {
      $body
        .removeClass('popup-opened')
        .addClass('popup-open');
    }, 300);
  }

  function close() {
    $body
        .removeClass('popup-open')
        .addClass('popup-opened');

    setTimeout(() => {
      $body
        .removeClass('popup-opened')
        .scrollTop(bodyScroll);
      $pageContent.removeAttr('style');
    }, 300);
  }

  function showGift( id ) {
    const $content = $popup.find('.popup-gift_block-content');
    
    $item = $content.find('.popup-gift_block-item');

    $item.removeClass('show');

    setTimeout(() => {
      $item = $('<div class="popup-gift_block-item" />')

      $item.append(`
        <div class="popup-gift_image">
          <img src="assets/img/gifts/image-${id}.png" alt="" class="popup-gift_image-item">
        </div>
        <p class="popup-gift_text">Теперь подарок ваш!</p>
        <button class="popup-gift_button-close button">Спасибо</button>
      `)

      $item.remove();
      $content.html($item);

      setTimeout(() => { $item.addClass('show'); }, 0);
    }, 300)
  }

  function getGift() {
    if(!giftConfSubmit) {
      giftConfSubmit = true;

      fetch('model/gift.php')
        .then(response => {
          if(response.status === 200) return response.json();
          else giftConfSubmit = false;
        })
      .then(json => {
        if(json.res) showGift(json.giftId);
      });
    }
  }

  function init() {
    open();

    $popupOkButton.on('click', getGift);
    $(document).on('click', '.popup-gift_button-close', close);
  }
}