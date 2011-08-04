<?

$myDb = mysql_connect("localhost", "ds", "mypass") or die('Could not connect: ' . mysql_error());;
mysql_select_db("testdb", $myDb);

mysql_set_charset("utf8", $myDb) or die("Problem setting charset:".mysql_error());
?>
