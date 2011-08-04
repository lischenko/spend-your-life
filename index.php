<?
	require_once("sections.php");
	$secs = getSections();
	
	$secKey = $_GET['s'];
	$sec = $secs[$secKey];
	if (empty($sec)) {
		header($_SERVER["SERVER_PROTOCOL"]." 403 Forbidden");
		exit;
	}

?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<title>MD</title>
	  <?
	    $metas = $sec->extraArgs['metaArray']; 
	  	if (is_array($metas)) {
	  	foreach($metas as $k=>$v) {
	  	?>
			<meta name="<?=$k?>" content="<?=$v?>"/>
	    <?	}
	  }?>
	
	<meta name="keywords" content="<?=$sec->meta?>"/>
	<meta name="description" content="<?=$sec->desc?>"/>
	<link rel="stylesheet" type="text/css" href="ds.css">
	  <?
	    $scripts = $sec->extraArgs['scripts']; 
	  	if (is_array($scripts)) {
	  	foreach($scripts as $k=>$v) {
	  	?>
	  		  <script src="<?=$v?>" type="text/javascript"></script>
	    <?	}
	  }?>
</head>
<body onload="applyToAllSections(initTable)">
<!--    <div id="titleBlock"><a href="index.php"><img src="img/th.png" alt="md"></a></div> -->

	<div id="sectionsList">
<?
	//navigation
	$titles = array();
	foreach($secs as $k=>$v) {
		if ( $v->inMenu) { 
			array_push( $titles, linkToSection($k) );
		}
	}

	echo implode( "&nbsp;&nbsp;", $titles );
?>
	</div>
	
	<table width="100%">
		<tr>
			<td width="25%"></td>
			<td width="*">
				<? include( $sec->file ); ?>
			</td>
			<td valign="top" width="25%">
			</td>
		</tr>
	</table>
	
	<? 
	/* Google Analytics */
	if ( $_SERVER["SERVER_ADMIN"] != "vit@macmini" ) { /* dont enable it for development host */ ?>
	<? } ?>
</body>
</html>
