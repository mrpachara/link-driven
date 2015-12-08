<?php
	header("Content-Type: application/json; charset=utf-8");

	if($_SERVER['REQUEST_METHOD'] === 'GET'){
		echo json_encode([
			'uri' => 'http://localhost/link-driven/test/data.php',
			'links' => [
				[
					'rel' => 'service',
					'method' => 'put',
					'href' => 'http://localhost/link-driven/test/data.php/{{ id }}',
					'alias' => 'update',
				],
			],
			'item' => [
				'id' => '123',
				'data' => 'abcd',
			],
		]);
	} else{
		echo json_encode([
			'uri' => $_SERVER['REQUEST_URI'],
			'item' => json_decode(file_get_contents("php://input"), true),
		]);
	}
?>
