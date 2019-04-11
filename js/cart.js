var cart = {}, content = {};
/* TODO:

 */
$(function(){

  if (localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'));

  $.getJSON('content.json', function(json){
    content = json;
    showCart(content,true);
    showContent(content);
  });

  $('#checkout-form').hide(); // Need to enable slow appear after button click

  $('#checkout-btn').click(function(){
    $('#checkout-form').removeClass('d-none');
    $('#checkout-form').show("slow");
    $('#checkout-btn').hide();
  });

});

window.addEventListener('load', function() {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      else {
        event.preventDefault();
        var cartData = $('#checkout-form').serialize();
        $.ajax({
          url: "submit.php",
          type: "POST",
          dataType: 'text',
          data: {data : cartData,
                  cart : cart},
          beforeSend: function(){
            $('#submit-spinner').removeClass('d-none');
            $('#submit-btn').hide();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            //console.log('Ошибка: ' + textStatus + ' | ' + errorThrown);
            $('#submit-spinner').hide();
            $('#submit-spinner').hide();
            $('#submit-msg').html('<div class="alert alert-warning" role="alert">\
                <h4>Упс! :(</h4>\
                К сожалению, что-то пошло не так и при отправке произошла ошибка. \
                Попробуйте повторить позднее.</div>');
          },
          success: function(log){
            $('#submit-spinner').hide();
            document.checkout-form.reset();
            $('#checkout-form').hide();
            $('#submit-msg').html('<div class="alert alert-success" role="alert">\
                <h4>Спасибо за заказ!</h4>\
                Ваш заказ был успешно принят в обработку. В скором времени мы свяжемся с вами\
                для уточнения деталей.</div>');
          }
        });
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);

function addToCart(){
  var id = $(this).data('id');
  if (cart[id] == undefined){
    cart[id] = {id: id, amount: 1};
  }
  else {
    cart[id].amount++;
  }
  showCart(content,true);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function showCart(json, btns){
    var cartHtml = '';
    var items_cnt = 0;
    totalPrice = 0;
    for (var itemId in cart) {
      amount = cart[itemId].amount;
      cartHtml += `<li class=\"list-group-item d-flex justify-content-between lh-condensed\">\
                      <div class='d-flex flex-column'>\
                          <h6 class=\"my-0\">${json[itemId].title}</h6>\
                        <div class='mt-2'>\
                          <small class=\"text-muted\">Количество: ${amount}</small>\
                        </div>\
                      </div>\
                      <div class=\"d-flex flex-column\">\
                        <div>\
                          <span class=\"text-muted\">${amount*json[itemId].cost} р</span>\
                        </div>\
                        <div class='d-flex'>\
                          <button data-id='${itemId}' type=\"button\"\
                            class=\"btn btn-outline-secondary btn-sm btn-increment\">+</button>\
                          <button data-id='${itemId}' type=\"button\"\
                            class=\"btn btn-outline-secondary btn-sm btn-decrement\">-</button>\
                        </div>\
                      </div>\
                    </li>`;
      items_cnt += amount;
      totalPrice += amount*json[itemId].cost;
    }
    $('#cart-list').html(cartHtml);
    if (cart === {}) totalPrice=0;
    if (cartHtml) {
      cartFooter = "  <li class=\"list-group-item d-flex justify-content-between\">\
                        <span>Итог: </span>\
                        <strong>"+totalPrice+" р</strong>\
                      </li>";
      $('#cart-list').append(cartFooter);
    }
    $('#cart-loading-spinner').addClass('d-none');
    $('#total-count').html(items_cnt);

    $('.btn-increment').click(function(btns){
      var id = $(this).data('id');
      cart[id].amount++;
      localStorage.setItem('cart', JSON.stringify(cart));
      if (btns) showCart(content, false);
    });
    $('.btn-decrement').click(function(btns){
      var id = $(this).data('id');
      cart[id].amount--;
      if (cart[id].amount == 0){
        delete cart[id];
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      if (btns) showCart(content, false);
    });
}

function showContent(json){
    var html = '';
    for (var item in json){
      html += `<li class="p-2 mt-2 rounded border bg-light media">
                <img src=\"img/${json[item].src}\" class=\"mr-3 img-responsive-list\" alt=\"...\">
                <div class=\"media-body\">
                  <h4 class=\"mt-0 mb-1\">${json[item].title}</h4>
                  <p class=\"text-md-left\">${json[item].description}</p>
                  <div class=\"row\">
                    <h5 class=\"m-3\">Цена: ${json[item].cost} р</h5>
                    <button type=\"button\" class=\"ml-3 btn btn-success btn-lg buy\" data-id="${json[item].id}">Купить</button>
                  </div>\
                </div>\
              </li>`;
    }
    $('#content-loading-spinner').hide();
    $('#content-list').html(html);
    $('.buy').on('click', addToCart);
}


