<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Traits\Pesan;

class WarungController extends Controller
{
    use Pesan;

    public function index (Request $request) {
        return view("home");
    }

    public function store (Request $request) {
        try{
            $validatedData = $request->validate([
                "name.*" => "required",
                "harga.*" => "required|numeric|min:1",
                "barcode.*" => "required|numeric|min:1",
                "deskripsi" => "required",
                "kategori_id.*" => "required|numeric|min:1",
            ]);
        }catch(ValidationException $e){
            return response()->json($this->pesanError($e));
        }   

        
        $product = Product::create([
            "name" => $validatedData["name"][0],
            "harga" => $validatedData["harga"][0],
            "deskripsi" => $validatedData["deskripsi"],
            "kategori_id" => $validatedData["kategori_id"][0],
        ]);

        for($i = 0;$i < count($validatedData["name"]);$i++){
            Variant::create([
                "product_id" => $product->id,
                "name" => $validatedData["name"][$i],
                "harga" => $validatedData["harga"][$i],
                "barcode" => $validatedData["barcode"][$i],
            ]);
        }

        $product["kategori"]["name"] = $product->Kategori->name;

        return response()->json($this->pesanSuccess($product));
    }

    public function update (Request $request,Product $Product){
        try{
            $validatedData = $request->validate([
                "name.*" => "required",
                "harga.*" => "required|numeric|min:1",
                "barcode.*" => "required|numeric|min:1",
                "deskripsi" => "required",
                "kategori_id.*" => "required|numeric|min:1",
                "idVariant.*" => "required|numeric|min:1",
            ]);
        }catch(ValidationException $e){
            return response()->json($this->pesanError($e));
        }   

        
        Product::where("id",$Product->id)->update([
            "name" => $validatedData["name"][0],
            "harga" => $validatedData["harga"][0],
            "deskripsi" => $validatedData["deskripsi"],
            "kategori_id" => $validatedData["kategori_id"][0],
        ]);

        for($i = 0;$i < count($validatedData["name"]);$i++){
            Variant::where("id",$validatedData["idVariant"][$i])->update([
                "name" => $validatedData["name"][$i],
                "harga" => $validatedData["harga"][$i],
                "barcode" => $validatedData["barcode"][$i],
            ]);
        }

        $kategori = Kategori::find($validatedData["kategori_id"][0]);

        $data = [
            "name" => $validatedData["name"][0],
            "harga" => $validatedData["harga"][0],
            "kategori" => [
                "name" => $kategori->name,
            ]
        ];

        return response()->json($this->pesanSuccess($data));
    }

    public function destroy (Product $Product) {
        Product::destroy($Product->id);
        $dataVariant = Variant::where("product_id",$Product->id)->get();
        foreach($dataVariant as $variant){
            Variant::destroy($variant->id);
        }

        return response()->json($this->pesanSuccess());
    }

    public function storeVariant (Product $Product){
        $variant = Variant::create([
            "product_id" => $Product->id,
            "name" => "Product",
            "harga" => "1000",
            "barcode" => "1234",
        ]);

        return response()->json($this->pesanSuccess($variant));
    }

    public function destroyVariant (Variant $Variant){
        Variant::destroy($Variant->id);
        return response()->json($this->pesanSuccess());
    }

}
