<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        Configuration::instance([
            'cloud'=>[
                'cloud_name'=>env('CLOUDINARY_CLOUD_NAME'),
                'api_key'=>env('CLOUDINARY_API_KEY'),
                'api_secret'=>env('CLOUDINARY_API_SECRET'),
            ],
            'url'=>['secure'=>true],
        ]);
        $this->cloudinary=new Cloudinary();
    }

    //upload image service
    public function upload($file, string $folder = 'trek-sathi'): string
    {
        $result=$this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'folder'=>$folder,
                'resource_type'=>'image',
                'transformation'=>[
                    ['quality'=>'auto', 'fetch_format'=>'auto'],
                ],
            ]
        );

        return $result['secure_url'];
    }

    //delete image from cloudinary
    public function delete(string $imageUrl): void
    {
        //extract pub id /trek-sathi/abc123.jpg into /trek-sathi/abc123
        $pattern = '/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i';
        if(preg_match($pattern, $imageUrl, $matches)){
            $publicId=$matches[1];
            try{
                $this->cloudinary->uploadApi()->destroy($publicId);
            }catch(\Exception $e){
                //log the error
                \Log::warning("Cloudinary delete failed for: {publicId} -".$e->getMessage());
            }
        }
    }
}
