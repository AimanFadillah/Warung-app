const buttonModal = document.querySelector("#buttonModal")
const tutupModal = document.querySelector("#tutupModal")
const bodyModal = document.querySelector("#bodyModal")
const containerProduct = document.querySelector("#containerProduct")
const token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
const loading = document.querySelector("#loading");
let id = 1;
let dataKategori = null;
let page = 1;

ReadyPage();

document.addEventListener("click",async (e) => {

  if (e.target.classList.contains("product")) {
    const id = e.target.getAttribute("data-id");
    const productId = e.target.getAttribute("data-product");
    showProduct(id,productId);
  }

  if (e.target.id === "editButton") {
    const id = e.target.getAttribute("data-id")
    const productId = e.target.getAttribute("data-product");
    EditProduct(id,productId);
  }

  if (e.target.id === "deleteButton") {
    const konfirmasi = confirm("Yakin untuk menghapus barang ini?")
    if (konfirmasi) {
      const id = e.target.getAttribute("data-id")
      const productId = e.target.getAttribute("data-product");
      MenghapusProduct(id,productId);
    }
  }

  if (e.target.id === "createButton") {
    CreateProduct();
  }

  if (e.target.id === "tambahVariantButton" || e.target.id === "tambahVariant") {
    AksiButtonCreateVariant(e.target);
  }

  if (e.target.classList.contains("variantCreate")) {
    PindahPengisian(e.target)
  }

  if (e.target.classList.contains("hapusVariant")) {
    if(e.target.getAttribute("data-update")){
      const konfirmasi = confirm("Yakin untuk menghapus variant barang ini?")
      if(konfirmasi){
        MenghapusVariantDatabase(e.target)
      }else{ 
        return false;
      }
    }
    MenghapusVariant(e.target)
  }

})

document.addEventListener("input", (e) => {

  if (e.target.classList.contains("nameCreate")) {
    NamaVariant(e.target)
  }

  if (e.target.getAttribute("name") === "kategori_id[]") {
    KategoriBareng(e.target.value)
  }

})

document.addEventListener("submit",async (e) => {

  if (e.target.id === "formCreate" && e.target.getAttribute("data-type") === "create") {
    e.preventDefault();
    const product = await SubmitFormCreate(e.target);
    if(product){
      tambahProduct(product,true);
    }
  }

  if (e.target.id === "formCreate" && e.target.getAttribute("data-type") === "update") {
    e.preventDefault();
    const product = await SubmitFormCreate(e.target)
    const productId = e.target.getAttribute("data-product");
    if(product){
      MerubahProduct(productId,product)
    }
  }

})

function MerubahProduct (productId,product) {
  const productItem = document.querySelector(`.productke${productId}`)
  const SideAtas = productItem.querySelectorAll("div h4")
  const harga = Number(product.harga)
  SideAtas[0].innerHTML = product.name;
  SideAtas[1].innerHTML = harga.toLocaleString("id-ID",{style:"currency",currency:"IDR"});
  productItem.querySelector("p").innerHTML = product.kategori.name;
}

async function MenghapusVariantDatabase (target) {
  const id = target.getAttribute("data-update");
  const headers = {
    "X-CSRF-TOKEN" : token,
    "X-HTTP-Method-Override" : "DELETE"
  }
  ApiData(`/variant/${id}`,"post",headers);
}

async function AksiButtonCreateVariant (target) {
  if(target.getAttribute("data-type") === "create"){
    const variantCreate = document.querySelectorAll(".variantCreate");
    const nameInput = document.querySelector("input[name='name[]']")
    if (variantCreate.length === 0) { CreateVariant(nameInput.value || "product", false, false) }
    CreateVariant("product");
  }else if(target.getAttribute("data-type") === "update" ){
    const id = target.getAttribute("data-id");
    const tambahVariant = document.querySelector("#tambahVariant");
    const BeforeTambahVariant = tambahVariant.innerHTML
    tambahVariant.innerHTML = `Variant <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    tambahVariant.removeAttribute("id");
    const headers = {
      "X-CSRF-TOKEN" : token,
    }
    const request = await ApiData(`/home/${id}`,"post",headers);
    tambahVariant.setAttribute("id","tambahVariant");
    tambahVariant.innerHTML = BeforeTambahVariant;
    const variant = request.msg;
    CreateVariant(variant.name,true,true, variant,true)
  }
}

async function showProduct(id,productId) {
  buttonModal.click()
  ModalLoad()
  const product = await ApiData(`/api/product?find=${id}`)
  bodyModal.innerHTML = `
        <div class="d-flex justify-content-between">
          <h4 style="color: #090580"  >${product.name}</h4>
          <div class="d-flex ">
          <button style="border:none;background:none;color: #090580"  ><i  id="editButton"  data-id="${product.id}" data-product="${productId}" class="bi bi-pencil-square"></i></button>
          <button style="border:none;background:none;color: #090580"  ><i id="deleteButton" data-id="${product.id}" data-product="${productId}" class="bi bi-trash3"></i></button>
          </div>
        </div>
        <div id="containerTable">
       
        </div>
        <div class="d-flex mt-2" style="flex-wrap: wrap" id="containerVariant" >
        
        </div>
        <div class="border p-1 text-light" style="background-color: #090580">
          <p>${product.deskripsi}</p>
        </div>
        `
  for (variant of product.variant) {
    variant["kategori"] = product.kategori.name
    CreateVariant(variant.name, true, false, variant);
  }
}

async function EditProduct(id,productId) {
  ModalLoad()
  const product = await ApiData(`/api/product?find=${id}`)
  bodyModal.innerHTML = `
        <form method="post" action="/home/${id}/" id="formCreate" data-type="update" data-product="${productId}" >
          <input type="hidden" name="_token" value="${token}" >
          <input type="hidden" name="_method" value="PUT" >
          <div class="d-flex justify-content-between align-items-center mb-2" >
            <h4 style="color:#090580">Edit Product</h4>
            <button id="submitButton" style="border:none;background:none" class="p-0"><h6 class="p-2" style="color:white;background:#090580;"  >Save</h6></button>
          </div>
          <div id="containerTable">
             
          </div>
          <div class="d-flex mt-2" style="flex-wrap: wrap" id="containerVariant">
            <div id="tambahVariant" data-type="update" data-id="${product.id}" class="me-1 px-1 mb-1 text-light fw-bold" style="background-color: #090580;border:none;cursor:pointer" >Variant <i id="tambahVariantButton" data-type="update" data-id="${product.id}" class="bi bi-plus-circle"></i></div>
          </div>
         
          <div class="border p-1 text-light" style="background-color: #090580">
            <textarea placeholder="Deskripsi Product" style="background-color: #090580;border:none;width:100%;height:100px;color:white" name="deskripsi">${product.deskripsi}</textarea>
          </div>
        </form>
        `
  for (variant of product.variant) {
    variant["kategori"] = product.kategori.name
    CreateVariant(variant.name, true,true, variant,true)
  }
}

function CreateVariant(product, tambahTable = true, tambahDelete = true, view = null,data = false) {
  const containerTable = document.querySelector("#containerTable");
  const checkPanjang = containerTable.querySelectorAll(".tableModal");
  if (tambahTable) {
    const table = document.createElement("table");
    checkPanjang.length === 0 ? table.setAttribute("style", "width: 100%") : table.setAttribute("style", "width: 100%;display:none")
    checkPanjang.length === 0 ? table.setAttribute("id", "showTable") : undefined;
    table.setAttribute('data-id', id)
    table.setAttribute("class", `tableke${id} tableModal`)
    if (view !== null && data === false) {
      const Dataproduct = view;
      const harga = Number(Dataproduct.harga);
      table.innerHTML = `
      <tr>
        <td><strong>Harga</strong></td>
        <td  style="color: #090580" >: ${harga.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
      </tr>
      <tr>
        <td><strong>Barcode</strong></td>
        <td  style="color: #090580" >: ${Dataproduct.barcode}</td>
      </tr>
      <tr>
        <td><strong>Ketagori</strong></td>
        <td  style="color: #090580">: ${Dataproduct.kategori}</td>
      </tr>
      `
      containerTable.appendChild(table);
    } else if (view !== null && data === true){
      const Dataproduct = view;
      table.innerHTML = `
      <input type="hidden" name="idVariant[]" value="${Dataproduct.id}" >
      <tr>
        <td><strong>Nama</strong></td>
        <td>: <input type="text" name="name[]" value="${Dataproduct.name}" maxlength="20" data-id="${id}" class="nameCreate" placeholder="Nama Product" style="border: #090580 1px solid" ></td>
      </tr>
      <tr>
        <td><strong>Harga</strong></td>
        <td>: <input type="number" name="harga[]" value="${Dataproduct.harga}" placeholder="Harga Product" style="border: #090580 1px solid" ></td>
      </tr>
      <tr>
        <td><strong>Barcode</strong></td>
        <td>: <input type="number" name="barcode[]" value="${Dataproduct.barcode}" placeholder="Barcode Product" style="border: #090580 1px solid" ></td>
      </tr>
      <tr>
        <td><strong>Ketagori</strong></td>
        <td>: 
          <select name="kategori_id[]" style="width: 187px;border: #090580 1px solid" class="kategoriInput">
            
          </select>
        </td>
      </tr>
      `
      containerTable.appendChild(table);
      KategoriBareng()
      isiKategoriInput(id);
    } else {
      table.innerHTML = `
      <tr>
      <td><strong>Nama</strong></td>
      <td>: <input type="text" name="name[]" maxlength="20" data-id="${id}" class="nameCreate" placeholder="Nama Product" style="border: #090580 1px solid" ></td>
    </tr>
    <tr>
      <td><strong>Harga</strong></td>
      <td>: <input type="number" name="harga[]" placeholder="Harga Product" style="border: #090580 1px solid" ></td>
    </tr>
    <tr>
      <td><strong>Barcode</strong></td>
      <td>: <input type="number" name="barcode[]" placeholder="Barcode Product" style="border: #090580 1px solid" ></td>
    </tr>
    <tr>
      <td><strong>Ketagori</strong></td>
      <td>: 
        <select name="kategori_id[]" style="width: 187px;border: #090580 1px solid" class="kategoriInput">
          
        </select>
      </td>
    </tr>
    `
      containerTable.appendChild(table);
      KategoriBareng()
      isiKategoriInput(id);
    }
  }
  const containerVariant = document.querySelector("#containerVariant");
  const div = document.createElement("div");
  div.setAttribute("class", "variantCreate me-1 px-1 mb-1 text-light fw-bold")
  div.setAttribute("id", `variantke${id}`)
  div.setAttribute("data-id", id)
  div.setAttribute("style", "background-color:#090580;border:none;cursor:pointer")
  if(checkPanjang.length === 0 || !tambahDelete){
    div.innerHTML = product
  }else{
    div.innerHTML = `${product} <i data-id="${id}" ${view !== null ? `data-update='${view.id}'` : "" } class="hapusVariant bi bi-x-circle-fill"></i>`
  }
  !tambahDelete ? div.classList.add("noDelete") : undefined;
  containerVariant.appendChild(div)
  id++
}

async function SubmitFormCreate(target) {
  const form = target;
  const submitButton = document.querySelector("#submitButton");
  const inputs = form.getElementsByTagName("input");
  const textarea = form.getElementsByTagName("textarea")[0];
  const variantCreate = document.querySelectorAll(".variantCreate");
  for (input of inputs) {
    if (input.value === "") {
      variantCreate.length <= 1 ? alert(`${input.getAttribute("placeholder")} Belum terisi`) : alert(`Sepertinya ${input.getAttribute("placeholder")} Belum terisi Semua`)
      return false;
    }
  }
  if (textarea.value === "") {
    alert(`${textarea.getAttribute("placeholder")} Belum terisi`)
    return false
  }
  submitButton.disabled = true;
  const textButton = submitButton.getElementsByTagName("h6")[0].innerHTML;
  submitButton.innerHTML = `
  <h6 class="p-2" style="color:white;background:#090580;"  >${textButton} <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></h6>
  `
  const response = await fetch(form.getAttribute("action"), {
    method: "post",
    body: new FormData(form)
  })
  const data = await response.json();
  if (data.status === "danger") {
    alert(data.msg);
    submitButton.disabled = false;
    submitButton.innerHTML = `
    <h6 class="p-2" style="color:white;background:#090580;"  >${textButton}</h6>
    `
    return false;
  }
  ofModal();
  return data.msg
}

function MenghapusProduct(id,productId) {
  const headers = {
    "X-CSRF-TOKEN": token,
    "X-HTTP-Method-Override": "DELETE",
  }
  ApiData(`/home/${id}`, "POST", headers);
  const product = containerProduct.querySelector(`.productke${productId}`)
  containerProduct.removeChild(product)
  if(product.getAttribute("id")){
    const productItem = containerProduct.querySelector(".product-item");
    productItem ? productItem.setAttribute("id","productPertama") : ""; 
  }
  ofModal();
}

function ModalLoad() {
  bodyModal.innerHTML = `
  <div class="d-flex justify-content-center align-items-center" style="height: 200px" >
    <div class="spinner-border" role="status" style="color: #090580" ></div>
  </div>
  `
}

async function isiProduct() {
  const products = await ApiData("/api/product?find=all")
  for (product of products.data) {
    tambahProduct(product)
  }
}

function tambahProduct (product,palingAtas = false) {
  const harga = Number(product.harga)
  const productItem = containerProduct.querySelectorAll(".product-item");
  const div = document.createElement("div");
  const productPertama = document.querySelector("#productPertama");
  div.setAttribute("class",`product-item productke${id}`)
  if(palingAtas){
    div.setAttribute("id","productPertama")
  }else if (productItem.length === 0){
    div.setAttribute("id","productPertama")
  }
  div.innerHTML = `
  <div class="d-flex justify-content-between">
  <h4 class="product" data-id="${product.id}" data-product="${id}" >${product.name}</h4>
  <h4>${harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h4>
  </div>
  <p>${product.kategori.name}</p>
  `
  if(palingAtas){
    containerProduct.insertBefore(div,productPertama);
    productPertama ? productPertama.removeAttribute("id") : "";
  }else{
    containerProduct.appendChild(div);
  }
  id++
}

async function ReadyPage() {
  LoadingOn();
  dataKategori = await ApiData("/api/kategori")
  isiProduct();
  LoadingOff();
}

function ofModal() {
  tutupModal.click();
}

function LoadingOn() {
  loading.classList.remove("hide");
}

function LoadingOff() {
  loading.classList.add("hide");
}

async function ApiData(link, method = "post", Kepala) {
  const response = await fetch(link, {
    method: method,
    headers: Kepala,
  });
  const data = await response.json();
  return data;
}

function isiKategoriInput(id) {
  const table = document.querySelector(`.tableke${id}`)
  const input = table.querySelector(".kategoriInput");
  for (data of dataKategori) {
    input.innerHTML += `<option value="${data.id}" >${data.name}</option>`
  }
}

function PindahPengisian(target) {
  const id = target.getAttribute("data-id");
  const variant = target;
  const showTable = document.querySelector("#showTable");
  const table = document.querySelector(`.tableke${id}`)
  if (showTable) {
    showTable.style.display = "none"
    showTable.removeAttribute("id")
    const variantke = document.querySelector(`#variantke${showTable.getAttribute("data-id")}`);
    variantke.setAttribute("style", "background-color:#090580;border:none;cursor:pointer;")
  }
  variant.setAttribute("style", "background-color:#090580;border:1px solid black;cursor:pointer;")
  table.setAttribute("id", "showTable");
  table.removeAttribute("style");
  table.setAttribute("style", "width:100%")
}

function MenghapusVariant(target) {
  const id = target.getAttribute("data-id");
  const table = document.querySelector(`.tableke${id}`)
  if (table.id) {
    alert("Kamu Sedang Mengisi ini jadi tidak bisa menghapusnya")
    return
  }
  const containerVariant = document.querySelector("#containerVariant");
  const childVariant = document.querySelector(`#variantke${id}`)
  const containerTable = document.querySelector("#containerTable");
  const childTable = document.querySelector(`.tableke${id}`)
  containerVariant.removeChild(childVariant);
  containerTable.removeChild(childTable)
}

function NamaVariant(target) {
  const id = target.getAttribute("data-id");
  const variant = document.querySelector(`#variantke${id}`);
  if (variant) {
    variant.innerHTML = variant.classList.contains("noDelete") ? `${target.value !== "" ? target.value : "Product"}` : `${target.value !== "" ? target.value : "Product"} <i data-id="${id}" class="hapusVariant bi bi-x-circle-fill"></i>`;
  }
}

function KategoriBareng(value) {
  const kategoriFirst = document.querySelector(".kategoriInput");
  const kategoris = document.querySelectorAll(".kategoriInput")
  const data = value ? value : kategoriFirst.value;
  for (kategori of kategoris) {
    kategori.value = data;
  }
}



function CreateProduct() {
  buttonModal.click();
  bodyModal.innerHTML = `
        <form method="post" action="/home" id="formCreate" data-type="create" >
          <input type="hidden" name="_token" value="${token}" >
          <div class="d-flex justify-content-between align-items-center mb-2" >
            <h4 style="color:#090580">Create Product</h4>
            <button id="submitButton" style="border:none;background:none" class="p-0"><h6 class="p-2" style="color:white;background:#090580;"  >Create</h6></button>
          </div>
          <div id="containerTable">
            <table style="width: 100%" id="showTable" data-id="${id}" class="tableke${id} tableModal" >
              <tr>
                <td><strong>Nama</strong></td>
                <td>: <input type="text" name="name[]" maxlength="20" data-id="${id}" class="nameCreate" placeholder="Nama Product" style="border: #090580 1px solid" ></td>
              </tr>
              <tr>
                <td><strong>Harga</strong></td>
                <td>: <input type="number" name="harga[]" placeholder="Harga Product" style="border: #090580 1px solid" ></td>
              </tr>
              <tr>
                <td><strong>Barcode</strong></td>
                <td>: <input type="number" name="barcode[]" placeholder="Barcode Product" style="border: #090580 1px solid" ></td>
              </tr>
              <tr>
                <td><strong>Ketagori</strong></td>
                <td>: 
                  <select name="kategori_id[]" style="width: 187px;border: #090580 1px solid" class="kategoriInput">
                    
                  </select>
                </td>
              </tr>
            </table>
          </div>
          <div class="d-flex mt-2" style="flex-wrap: wrap" id="containerVariant">
            <div id="tambahVariant" data-type="create" class="me-1 px-1 mb-1 text-light fw-bold" style="background-color: #090580;border:none;cursor:pointer" >Variant <i id="tambahVariantButton" data-type="create" class="bi bi-plus-circle"></i></div>
          </div>
         
          <div class="border p-1 text-light" style="background-color: #090580">
            <textarea placeholder="Deskripsi Product" style="background-color: #090580;border:none;width:100%;height:100px;color:white" name="deskripsi"></textarea>
          </div>
        </form>
        `
  isiKategoriInput(id);
}



