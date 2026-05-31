import Image from "next/image";
import "./style.css";
import posterImage from "./poster.jpeg";
import Link from "next/link";
import ProductGrid from "./components/products_page/products";

export default function Home() {
  return (
    <div className="main">
      <header>
        <div className="title"><img className="logo" src="https://cdn-icons-png.flaticon.com/128/2662/2662503.png" alt="" /><h1>ShopEasy</h1></div>
        <nav>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
          <a href="#aboutus">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="icons">
          <a href=""><img  className="icon" src="https://cdn-icons-png.flaticon.com/128/622/622669.png" alt="" /></a>
          <a href="/login_route"><img className="icon" src="https://cdn-icons-png.flaticon.com/128/456/456212.png" alt="" /></a>
          <Link href="/cart_route">
            <img className="icon" src="https://cdn-icons-png.flaticon.com/128/3144/3144456.png" alt="cart" />
          </Link>
        </div>
      </header>
      <div className="main-img"><Image className="noob" src={posterImage} alt="" /></div>
      <div className="section">
        <a href="#men"> <div className="combo" ><img className="cat-img" src="https://cdn-icons-png.flaticon.com/512/2331/2331716.png" alt="" /><p>Men</p></div> </a>
        <a href="#women"> <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/4378/4378432.png" alt="" /><p>Women</p></div></a>
        <a href="#shoes">  <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/2742/2742687.png" alt="" /><p>Shoes</p></div></a>
        <a href="#accessories">  <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/9413/9413719.png" alt="" /><p>Accessories</p></div></a>
        <a href="Home & Living">  <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/5564/5564849.png" alt="" /><p>Home & Living</p></div></a>
        <a href="Beauty"> <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/1655/1655722.png" alt="" /><p>Beauty</p></div></a>
        <a href="Electronics"> <div className="combo"><img className="cat-img" src="https://cdn-icons-png.flaticon.com/128/808/808439.png" alt="" /><p>Electronics</p></div></a>

      </div>
      <ProductGrid />

      <div className="hello">

        {/* <Link href="/products_route">Product</Link>
        <Link href="/todo">TODO</Link> */}

      </div>

    </div>

  );
}
