<?php
	function contextPath($relative = null){
		$dir = __DIR__;
		$doc_context = $_SERVER['CONTEXT_DOCUMENT_ROOT'];
		$prefix = $_SERVER['CONTEXT_PREFIX'];

		$dir = str_replace("\\", "/", $dir);

		if(strpos($dir, $doc_context) === 0){
			$dir = substr($dir, strlen($doc_context));
		}

		return $prefix.$dir.'/'.$relative;
	}

	define('BASEPATH', contextPath());
?>
