<?php
// Create image instances
$dest = imagecreatefromjpeg('a.jpg');
$src = imagecreatefromjpeg('b.jpg');

// Copy and merge
imagecopymerge($dest, $src, 10, 10, 0, 0, 100, 47, 75);

// Output and free from memory
header('Content-Type: image/jpg');
imagejpeg($dest);

imagedestroy($dest);
imagedestroy($src);

//require_once("Image.Class.php");

