<?php 

namespace App\Traits;

Trait Pesan {
    public function pesanError ($msg) {
        $pesan["status"] = "danger";
        $pesan["msg"] = isset($msg->validator) ? $msg->validator->errors()->first() : $msg;
        return $pesan;
    }
    
    public function pesanSuccess ($msg = "Not Massage"){
        $pesan["status"] = "success";
        $pesan["msg"] = $msg;
        return $pesan;
    }

    public function makeNomor ($data) {
        $nomor = 1;
        foreach($data as $dt){
            $dt["nomor"] = $nomor++;
            $nomor++;
        }
        return $data;
    }
}