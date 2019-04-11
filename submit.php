<?php
if(isset($_POST['data']))
{
	$content = json_decode(file_get_contents("./content.json"));
	parse_str($_POST['data'],$formData);

  // Mailing to corporative address
  $textCart = '';
  foreach ($_POST['cart'] as $item)
  { 
  	$textCart .= '    '.$content[$item['id']]->title.' - в количестве '.$item['amount'].' шт.\r\n';
  }
	$to      = 'evgening@mail.ru';
	$subject = 'Поступление нового заказа';
	$message = 'Новый заказ от '.htmlspecialchars($formData['firstName']).' '.
							htmlspecialchars($formData['lastName']).
							'\r\nEmail: '.htmlspecialchars($formData['email']).
							'\r\nТелефон: '.htmlspecialchars($formData['tel']).
							'\r\nВ заказе: \r\n'.$textCart;
	$headers = array(
	    'From' => 'noreply@pdainternational.ru',
	    'Reply-To' => 'noreply@pdainternational.ru',
	    'X-Mailer' => 'PHP/' . phpversion()
	);
	echo $message;
	//if (mail($to, $subject, $message, $headers)) echo "Письмо отправлено менеджеру";
	//else echo "Ошибка при отправке письма менджеру";

	// Mailing to client
	$to      = htmlspecialchars($formData['email']);
	$subject = 'Подтверждение заказа в PDA International';
	$message = 'Ваш заказ в PDA International принят в обработку. Вскоре мы свяжемся '.
							'с вами для подтверждения заказа и уточнения способа доставки и оплаты.';
	$headers = array(
	    'From' => 'noreply@pdainternational.ru',
	    'Reply-To' => 'noreply@pdainternational.ru',
	    'X-Mailer' => 'PHP/' . phpversion()
	);
	echo $message;
	//if (mail($to, $subject, $message, $headers)) echo "Письмо отправлено клиенту";
	//else echo "Ошибка при отправке письма клиенту";
}
?>