<?php
    // config
    $title = "SECTION → Titre";
    $description = "";
    $section="SECTION";
    $subsection="SUBSECTION";
    $subsubsection="SUBSUBSECTION";
    $nav = "/web/snippets/ressources/SECTION.php"; // specific subnav
    $mdfile = "./FILE.md";
    $custom_css = "custom.css"; // relative or absolute file URL
    $custom_js = "custom.js"; // relative or absolute file URL

    // includes
    include_once $_SERVER["DOCUMENT_ROOT"] . '/web/_inc/Parsedown.php';
    include_once $_SERVER["DOCUMENT_ROOT"] . '/web/_inc/ParsedownExtra.php';
    include_once $_SERVER["DOCUMENT_ROOT"] . "/web/snippets/header.php";
    include_once $_SERVER["DOCUMENT_ROOT"] . "/web/snippets/nav.php";

    // nav snippet
    if(isset($nav)) include_once $_SERVER["DOCUMENT_ROOT"] . $nav;

    // markdown!
    $Parsedown = new ParsedownExtra();

?>

    <main class="pane active" id="content">
        <?= $Parsedown->text( file_get_contents( $mdfile ) ); ?>
        <?php include($_SERVER["DOCUMENT_ROOT"] . "/web/snippets/date.php"); ?>
    </main>

<?php include($_SERVER["DOCUMENT_ROOT"] . "/web/snippets/footer.php"); ?>
