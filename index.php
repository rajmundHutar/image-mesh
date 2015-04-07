
<style>
    .size{
        width:40px;
    }
</style>    
<?php

ini_set('xdebug.var_display_max_depth', 5);
ini_set('xdebug.var_display_max_children', 256);
ini_set('xdebug.var_display_max_data', 1024);

require_once("Image.Class.php");


$thumbnailWidth = 320;
$thumbnailHeight = 240;
$cols = 2;


if (isset($_POST["makeImage"]) && $_POST["makeImage"]) {
    $images = $_FILES["images"];
    $count = count(array_filter($images["name"]));
    $thumbnailWidth = $_POST["thumbnailWidth"];
    $thumbnailHeight = $_POST["thumbnailHeight"];
    $firstLetter = ord($_POST["firstLetter"]);
    $cols = $_POST["cols"];
    $rows = ceil($count / $cols);

    $result = new Image($cols * $thumbnailWidth + ($cols + 1) * 2, $rows * $thumbnailHeight + ($rows  + 1) * 2 , array(255, 255, 255));
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            $index = $r * $cols + $c;
            if (!empty($images["name"][$index])) {
                $img = new Image($images["tmp_name"][$index]);
                if ($img->get_width() > $img->get_height()){
                    $img->crop_to_ratio($thumbnailWidth / $thumbnailHeight);
                } else {
                    $img->resize($thumbnailWidth , $thumbnailHeight);
                }

                $img->resize($thumbnailWidth, $thumbnailHeight);
                $x = $c * $thumbnailWidth + ($c + 1) * 2 + ($thumbnailWidth - $img->get_width()) / 2;
                $y = $r * $thumbnailHeight + ($r + 1) * 2 + ($thumbnailHeight - $img->get_height()) / 2;
                $result->addImage($img, $x, $y);
                $img->destroy();

                $imgLabel = new Image(30, 30, array(255, 255, 255));
                $imgLabel->set_font("verdana.ttf", 20, array(0, 0, 0));
                $imgLabel->write(chr($index + $firstLetter), 8, 25, 0, 100);
                $x = $c * $thumbnailWidth + ($c + 1) * 2;
                $y = $r * $thumbnailHeight + ($r + 1) * 2;
                $result->addImage($imgLabel, $x, $y);
                $imgLabel->destroy();
            }
        }
    }
    $i = 0;
    $name = "image{$i}.jpg";
    while(is_file($name)){
        $i++;
        $name = "image{$i}.jpg";
    }
    $result->save_jpg($name, 99);
    
    echo "<br><a href='{$name}'><img src='{$name}' width='150'></a><br><br>";
}




$imagesCount = 10;
echo "<form action='' method='post' enctype='multipart/form-data'>";
echo "Number of cols: <input type='text' value='{$cols}' name='cols'><br>";
echo "First letter: <input type='text' value='a' name='firstLetter'><br>";
echo "Subimage size: <input type='text' name='thumbnailWidth' value='{$thumbnailWidth}' class='size'> x <input type='text' name='thumbnailHeight' value='{$thumbnailHeight}' class='size'><br>";

for ($i = 0; $i < $imagesCount; $i++) {
    echo "<input type='file' name='images[]'><input type='text' name='titles[]'><br>";
}
echo "<input type='submit' name='makeImage'>";
echo "</form>";
