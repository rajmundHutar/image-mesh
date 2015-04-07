<?php
class Image
{
    // tady je obrazek ulozeny
    protected $img;

    protected $font_face;
    protected $font_size;
    protected $font_color;

    public function __construct($a, $b=0, $bg=0)
    {
        // vytvoreni noveho obrazku
        if (is_numeric($a)) {
            $this->img = imagecreatetruecolor($a, $b);

            // vyplneni barevnym pozadim
            if ($bg != 0)
                imagefill($this->img, 0, 0, imagecolorallocate($this->img, $bg["0"], $bg["1"], $bg["2"]));
        }
        // nacteni obrazku ze souboru
        else if (@imagesx($a)==false) {
            $info = getimagesize($a);
            switch ($info[2]):
                case "1": //GIF
                    $this->img = imagecreatefromgif($a);
                    break;
                case "2": //JPG
                    $this->img = imagecreatefromjpeg($a); 
                    break;
                case "3": //PNG
                    $this->img = imagecreatefrompng($a);
                    break;
                case false: $this->img=false;
            endswitch;
        }
        // prevzeti obrazku z venci
        else
            $this->img=$a;
    }
    
    public function getImg(){
        return $this->img;
    }

    // uvolneni obrazku
    public function destroy()
    {
        @imagedestroy($this->img);
    }

    // ulozit/zobrazit obrazek jako jpg
    public function save_jpg($dest, $quality=95)
    {
        return imagejpeg($this->img,$dest,$quality);
    }

    public function out_jpg($quality=95)
    {
        header ("Content-type: image/jpeg");
        imagejpeg($this->img,NULL,$quality);
    }

    // ulozit/zobrazit obrazek jako png
    public function save_png($dest)
    {
        return imagepng($this->img,$dest);
    }

    public function out_png()
    {
        header ("Content-type: image/png");
        imagepng($this->img);
    }

    // ulozit/zobrazit obrazek jako gif
    public function save_gif($dest)
    {
        return imagegif($this->img,$dest);
    }

    public function out_gif()
    {
        header ("Content-type: image/gif");
        imagegif($this->img);
    }

    // ziskat sirku aktualniho obrazku
    public function get_width()
    {
        return imagesx($this->img);
    }

    // ziskat vysku aktualniho obrazku
    public function get_height()
    {
        return imagesy($this->img);
    }

    // zmenit velikost obrazku na sirku $width a vysku $height, $aspect_ratio 
    // ovlivni, zda bude zachovan pomer stran, $force=true vynuti zmenu 
    // velikosti za kazdou cenu, i kdyby melo dojit ke ztrate kvality
    public function resize($width, $height, $aspect_ratio=true, $force=false)
    {
        // $force=false zaruci, ze obrazky mensi nez zadane rozliseni nebudou 
        // zvetsovany
        if ($width>$this->get_width()&&$height>$this->get_height()&&!$force)
            return $this;

        if ($width==0) $width=$this->get_width();
        if ($height==0) $height=$this->get_height();

        // spocitam nove rozemry
        if ($aspect_ratio) {
            $widthRatio=$this->get_width()/$width;
            $heightRatio=$this->get_height()/$height;
            $aspectRatio = $this->get_width()/$this->get_height();

            if ($widthRatio>$heightRatio)
                $height = $width / $aspectRatio;
            else
                $width = $height * $aspectRatio;
        }

        // zmenim velikost
        $img=imagecreatetruecolor($width,$height);
        if (!@imagecopyresampled($img,$this->img,0,0,0,0,$width,$height,$this->get_width(),$this->get_height())) return false;
        else {
            $this->img = $img;
            return true;
        }
    }

    // otocit doleva
    public function rotate_left()
    {
        $this->img = imagerotate($this->img, 90, 0);
        return true;
    }
    // otocit doprava
    public function rotate_right()
    {
        $this->img = imagerotate($this->img, -90, 0);
        return true;
    }

    // pridat ramecek o barve $color (Array(r,g,b)) a tloustce $size pixelu
    public function border($color,$size)
    {
        $new = imagecreatetruecolor($this->get_width()+(2*$size),$this->get_height()+(2*$size));
        $bg = imagecolorallocate($new,$color["0"],$color["1"],$color["2"]);
        imagefill($new,0,0,$bg);
        
        if (imagecopy($new, $this->img, $size, $size, 0, 0, $this->get_width(), $this->get_height())) {
            $this->img = $new; 
            return true;
        }
        else 
            return false;
    }

    // oriznout -> vyriznu z obrazku obdelnik s levym hornim rohem na 
    // souradnicich $x, $y a rozmerech $width, $height
    public function crop($x, $y, $width, $height)
    {
        $copy=imagecreatetruecolor($width,$height);
        if (imagecopy($copy, $this->img, 0, 0, $x, $y, $width, $height)) {
            $this->img=$copy;
            return true;
        }

        return false;
    }

    // oriznout obrazek do pomeru stran $dest_ratio, $offset nabyva ohdnot 0 az 1 
    // a urcuje umisteni vyrezu, pricemz pokud obrazek s pomerem 3:4 (na vysku) 
    // orezavame do pomeru 4:3 (na sirku), tak $offset=0 znamena, ze se vezme 
    // horni cast puvodniho obrazku, 0.5 presne prostredni cast a 1 spodni cast 
    public function crop_to_ratio($dest_ratio=0, $offset=0.5)
    {
        if ($dest_ratio==0) $dest_ratio=(4/3);

        $width=$this->get_width();
        $height=$this->get_height();
        $img_ratio=$width/$height;

        if ($img_ratio==$dest_ratio) return $this;

        $widthRatio=$width/1;
        $heightRatio=$height/(1/$dest_ratio);

        if ($widthRatio>$heightRatio) {
            //vyska zustane puvodni
            $width=$dest_ratio*$height;
            return $this->crop(($this->get_width()-$width)*$offset, 0, $width, $height);
        }
        else {
            //sirka zustane puvodni
            $height=$width/$dest_ratio;
            return $this->crop(0, ($this->get_height()-$height)*$offset, $width, $height);
        }
    }

    // zmeni velikost a orizne do rozmeru $width x $height, $offset funguje 
    // stejne jako u crop_to_ratio()
    public function resize_crop($width, $height, $offset=0.5)
    {
        $widthRatio=$this->get_width()/$width;
        $heightRatio=$this->get_height()/$height;

        if ($widthRatio<$heightRatio)
            $this->resize($width, 0);
        else 
            $this->resize(0, $height);

        return $this->crop_to_ratio(($width/$height), $offset);
    }

    // nastavi pismo, $face je nazev ttf souboru s pismem, $size velikost (v 
    // bodech) a $color barva (Array(r,g,b))
    public function set_font($face, $size, $color)
    {
        $this->font_face = $face;
        $this->font_size = $size;
        $this->font_color = $color;
        return true;
    }

    // zapise text $text, s levym spodnim rohem na souradnich $x, $y, pod uhlem 
    // $angle a s vyditelnosti $alpha (0-100, 0 - neviditelne, 50 - pruhledne, 
    // 100 - viditelne
    public function write($text, $x=0, $y=0, $angle=0, $alpha = 100)
    {
        // create font color
        $color = imagecolorallocate($this->img, $this->font_color[0], $this->font_color[1], $this->font_color[2]);

        // no transparency
        if ($alpha == 100)
            // write text to the original image
            imagettftext($this->img, $this->font_size, $angle, $x, $y, $color, $this->font_face, $text);
        // transparency
        else {
            // create temporary image
            $tmp = imagecreatetruecolor($this->get_width(),$this->get_height());

            // choose transparent color
            $transparent = (Array(0,0,0) != $this->font_color) ? Array(0,0,0) : Array(255,255,255);

            // fill with transparent color
            imagefill($tmp, 0, 0, imagecolorallocate($tmp, $transparent["0"], $transparent["1"], $transparent["2"]));

            // set this color to transparent
            imagecolortransparent($tmp, imagecolorallocate($tmp, $transparent["0"], $transparent["1"], $transparent["2"]));

            // write text to the temporary image
            imagettftext($tmp, $this->font_size, $angle, $x, $y, $color, $this->font_face, $text);

            // merge original image and temporary image with alpha (pct)
            imagecopymerge($this->img, $tmp, 0, 0, 0, 0, $this->get_width(), $this->get_height(), $alpha);
        }
    }
    
    public function addImage(Image $src, $x, $y){
        imagecopymerge($this->img, $src->getImg(), $x, $y, 0, 0, $src->get_width(), $src->get_height(), 100);
    }

    // automaticky uvolni pamet po skonceni scriptu
    public function __destruct()
    {
        // free memory
        $this->destroy();
    }

}
