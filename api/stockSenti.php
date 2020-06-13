<?php
$stockId = $_GET['stockId'];
$stockId = substr($stockId, 2, 6) . '.' . substr($stockId, 0, 2);
//$stockId = '601939.SH';

$manager = new MongoDB\Driver\Manager("mongodb://psz:heart39100@47.101.35.25:27017");

$filter = ['stock_id' => $stockId];
$options = [
    'projection' => ['time_value' => 1, 'sentiment'=>1],
    'sort' => ['time_value' => 1]
];
$query = new MongoDB\Driver\Query($filter, $options);
$cursor = $manager->executeQuery('scrapy_senti.sinanews_senti', $query);

$res = null;
foreach ($cursor as $document) {
    $arr_obj = (array)$document;
    $res[] = [$arr_obj['time_value']/1000000, $arr_obj['sentiment']];
}
echo json_encode($res);