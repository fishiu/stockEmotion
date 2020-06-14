<?php
$type = $_GET['type'];

$config = parse_ini_file("../config.ini");
$uri = "mongodb://" . $config['username'] . ":" . $config['password'] . "@" . $config['hostname'] . ":" . $config['port'];
$manager = new MongoDB\Driver\Manager($uri);

$resData = null;
$success = 1;
$message = '';

if ($type == 'stock') {
    $stockId = $_GET['queryStr'];
    $stockId = substr($stockId, 2, 6) . '.' . substr($stockId, 0, 2);
    //$stockId = '601939.SH';

    $filter = ['stock_id' => $stockId];
    $options = [
        'projection' => ['time_value' => 1, 'sentiment' => 1],
        'sort' => ['time_value' => 1]
    ];
    $query = new MongoDB\Driver\Query($filter, $options);
    try {
        $cursor = $manager->executeQuery('scrapy_senti.sinanews_senti', $query);
    } catch (\MongoDB\Driver\Exception\Exception $e) {
        $success = 0;
        $message = $e->getMessage();
    }

    foreach ($cursor as $document) {
        $arr_obj = (array)$document;
        $resData[] = [$arr_obj['time_value'] / 1000000, round(10 * $arr_obj['sentiment'], 3)];
    }
} else {
    $industry = $_GET['queryStr'];
    $filter = ['industry' => $industry];
    $options = [
        'projection' => ['time_value' => 1, 'sentiment' => 1],
        'sort' => ['time_value' => 1]
    ];
    $query = new MongoDB\Driver\Query($filter, $options);
    try {
        $cursor = $manager->executeQuery('scrapy_senti.industry_senti', $query);
    } catch (\MongoDB\Driver\Exception\Exception $e) {
        $success = 0;
        $message = $e->getMessage();
    }

    foreach ($cursor as $document) {
        $arr_obj = (array)$document;
        $resData[] = [$arr_obj['time_value'] / 1000000, round(10 * $arr_obj['sentiment'], 3)];
    }
}

echo json_encode([
    "success"=>$success,
    "message"=>$message,
    "sentiData"=>$resData
]);
