@extends('component.index')

@section('main')    
  <div class="container mt-4">

    <div class="row justify-content-between ">
        <div class="col-md-5">
            <h2 class="text-light">Daftar Produk <i id="createButton" class="bi bi-plus-circle"></i></h2>
        </div>
        <div class="col-md-5">
            <div class="input-group mt-1 ">
                <input type="text" style="border-radius: 0px;border:1px solid #fff" class="form-control" placeholder="Cari Barang" >
                <button class="buttonCari btn text-light" style="border-radius:0px;border:1px solid #fff" type="button" id="button-addon2">Cari</button>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-12" >
            <div class="product-list" id="containerProduct" > 
              {{-- <div class="product-item">
                <div class=" d-flex justify-content-between">
                  <h4 class="product" >Produk 1</h4>
                  <h4>Rp 1.000,00</h4>
                </div>
                <p>Makanan</p>
              </div>
              <div class="product-item">
                <div class=" d-flex justify-content-between">
                  <h4 class="product" >Produk 1</h4>
                  <h4>Rp 1.000,00</h4>
                </div>
                <p>Makanan</p>
              </div>
              <div class="product-item">
                <div class=" d-flex justify-content-between">
                  <h4 class="product" >Produk 1</h4>
                  <h4>Rp 1.000,00</h4>
                </div>
                <p>Makanan</p>
              </div> --}}
            </div>
          </div>
    </div>
  </div>
  <!-- Button trigger modal Show -->
<button type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#modalShow" id="buttonModal" ></button>

<!-- Modal -->
<div class="modal fade" id="modalShow" tabindex="-1"   aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered"  >
    <div class="modal-content" style="border-radius: 0px;border:none">
      <div class="modal-body" id="bodyModal" >
      </div>
      <button type="button" class="btn btn-secondary d-none" data-bs-dismiss="modal" id="tutupModal" >Close</button>
    </div>
  </div>
</div>
<script src="js/home.js" ></script>

@endsection


