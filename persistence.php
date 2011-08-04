<?php
require_once("mysql.php");

class Persistence {
	var $myDb;
	
	function Persistence() {
		global $myDb;
		$this->myDb = $myDb;
	}
}	
