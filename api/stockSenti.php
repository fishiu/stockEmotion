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
        $cursor = $manager->executeQuery('scrapy_senti2.sinanews_senti', $query);
    } catch (\MongoDB\Driver\Exception\Exception $e) {
        $success = 0;
        $message = $e->getMessage();
    }

    $sinaData = null;
    foreach ($cursor as $document) {
        $arr_obj = (array)$document;
        $sinaData[] = [$arr_obj['time_value'] / 1000000, round(10 * $arr_obj['sentiment'], 3)];
    }

    try {
        $cursor = $manager->executeQuery('scrapy_senti2.xqdis_senti', $query);
    } catch (\MongoDB\Driver\Exception\Exception $e) {
        $success = 0;
        $message = $e->getMessage();
    }

    $xqData = null;
    foreach ($cursor as $document) {
        $arr_obj = (array)$document;
        $xqData[] = [$arr_obj['time_value'] / 1000000, round(10 * $arr_obj['sentiment'], 3)];
    }

    $sinaPtr = 0;
    $xqPtr = 0;
    $ptr = 0;
//    var_dump($sinaData);
//    var_dump($xqData);
    while ($ptr < sizeof($sinaData) + sizeof($xqData)) {
        if ((isset($xqData[$xqPtr]) && $xqData[$xqPtr][0] < $sinaData[$sinaPtr][0]) || !isset($sinaData[$sinaPtr])) {
            $resData[$ptr] = $xqData[$xqPtr];
            $xqPtr++;
        } else {
            $resData[$ptr] = $sinaData[$sinaPtr];
            $sinaPtr++;
        }
        $ptr++;
    }
//    var_dump($resData);
} else {
    $industry = $_GET['queryStr'];
    $filter = ['industry' => $industry];
    $options = [
        'projection' => ['time_value' => 1, 'sentiment' => 1],
        'sort' => ['time_value' => 1]
    ];
    $query = new MongoDB\Driver\Query($filter, $options);
    try {
        $cursor = $manager->executeQuery('scrapy_senti2.industry_senti', $query);
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
    "success" => $success,
    "message" => $message,
    "sentiData" => $resData
]);
