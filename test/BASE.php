<?php
	function contextPath(){
		$dir = __DIR__;
		$doc_context = $_SERVER['CONTEXT_DOCUMENT_ROOT'];
		$prefix = $_SERVER['CONTEXT_PREFIX'];

		if(strpos($dir, $doc_context) === 0){
			$dir = substr($dir, strlen($doc_context));
		}

		return $prefix.$dir;
	}

	define('BASEPATH', contextPath().'/');
?>
