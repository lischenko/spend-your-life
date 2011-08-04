<?
class Section {
	var $name;
	var $file;
	var $meta;
	var $desc;
	var $inMenu;
	/** Associative array of key/values*/
	var $extraArgs = array();
	
	function Section($name, $file, $inMenu=false, $meta = "", $desc = "") {
		$this->name = $name;
		$this->file = $file;
		$this->meta = $meta;
		$this->desc = $desc;
		$this->inMenu = $inMenu;
	}
}

$sectionMain = new Section(
	"Главная", "main.php", true
);

$sectionCalc = new Section(
	"Калькулятор", "calc.html", true
);

$_sections = array(
	NULL => $sectionMain,
	"calc" => $sectionCalc
);

function getSections() {
	global $_sections;
	return $_sections;
}

/** Links to section and allows to pass extra parameters */
function linkToSectionParameterized($secId, $linkName=NULL, $evenMoreArgs=NULL) {
	global $_sections;
	if ($linkName == NULL) {
		$linkName = $_sections[$secId]->name;
	}
		
	$url = "index.php?s=$secId";
	
	if ( !empty($_sections[$secId]->extraArgs) ) {
		foreach ($_sections[$secId]->extraArgs as $a=>$v) {
			$url .= "&amp;$a=$v";
		}
	}
        if ( !empty($evenMoreArgs) ) {
                foreach ($evenMoreArgs as $a=>$v) {
                        $url .= "&amp;$a=$v";
                }
        }

	return "<a href=\"$url\">$linkName</a>";
}

function linkToSection($secId, $linkName=NULL) {
	return linkToSectionParameterized($secId, $linkName, NULL);
}

?>
