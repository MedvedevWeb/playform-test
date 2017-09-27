<?php
header('Content-Type: application/json');
$res = [
    'res' => true,
    'giftId' => mt_rand(1, 5),
];
echo json_encode($res);