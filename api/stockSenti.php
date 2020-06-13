<?php
$stockId = $_GET['stockId'];
$stockId = substr($stockId, 2, 6) . '.' . substr($stockId, 0, 2);
//$stockId = '601939.SH';

$config = parse_ini_file("../config.ini");
$uri = "mongodb://" . $config['username'] . ":" . $config['password'] . "@" . $config['hostname'] . ":" . $config['port'];
$manager = new MongoDB\Driver\Manager($uri);
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
    $res[] = [$arr_obj['time_value']/1000000, round(10 * $arr_obj['sentiment'],3)];
}
echo json_encode($res);