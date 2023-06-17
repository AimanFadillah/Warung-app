<!DOCTYPE html>
<html>
<head>
  <title>Daftar Produk</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <style>
    body {
      background-color: #090580;
    }

    .sidebar {
      background-color: #090580;
      color: #fff;
      padding: 10px;
    }

    .product-list {
      margin-top: 20px;
    }

    .product-item {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #fff;
      color: #090580;
    }

    input:focus ,textarea:focus ,select:focus {
       outline: none;
    }

    textarea::placeholder {
      color: white
    }

    .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #090580;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  .loading.hide {
    opacity: 0;
    pointer-events: none;
  }

  .loading-spinner {
    border: 4px solid #fff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  </style>
</head>
<body>
  <div id="loading" class="loading hide">
    <div class="loading-spinner"></div>
  </div>
  

    @include('component.navbar')

    @yield('main')
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
</body>
</body>
</html>
