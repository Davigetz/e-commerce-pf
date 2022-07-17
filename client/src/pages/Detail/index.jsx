import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer , toast } from "react-toastify";
import {
  Main,
  Div,
  ImageContainer,
  Image,
  InfoContainer,
  H2,
  P,
  Stars,
  SizeInfo,
  Description,
  Size,
  Button,
  Review,
} from "./styles";
import { getProduct , clearProduct } from "../../redux/actions/product";
import {addToCart, setLocalStorage} from "../../redux/actions/cart"
import Loading from "../../components/Loader";
import estilos from "./detail.module.css";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

const ProductDetail = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);

  const [size , setSize] = useState('');
  const [stock , setStock] = useState(0);
  const [isLoading , setIsLoading] = useState(true);

  const stars = Array(5).fill(0);


  const handleClick = (value) => {
    setCurrentValue(value);
  };
  
  const defineSize = (event)=>{
    setSize(event.target.innerHTML)
  }

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  let dispatch = useDispatch();
  let [cart , product , error] = useSelector ( state => [ state.cart , state.product.product , state.product.error])
  // let product = useSelector((state) => state.product.product);
  // let error = useSelector((state) => state.product.error);
  let { productId } = useParams();

  useEffect(()=>{
    window.scrollTo(0,0); 
    if (!Object.keys(product).length){
      dispatch(getProduct(productId))
    }
    else {
      setTimeout(()=>{
        setIsLoading(false)
      },1000)
    }
  },[product])
  useEffect(()=>{
    return ()=>{
      dispatch(setLocalStorage(cart))
      dispatch(clearProduct())
    }
  }, []);

  const checkStock = async (cantidad = 1) =>{
    let talle = size
    const product = await axios.get(`http://localhost:3001/product/${productId}`);
    if (talle==='Sin talle'){
      if (product.data.talles[0].producto_talle.stock >= cantidad ) return true
      else return false
    }
    else{
      const index = await product.data.talles.findIndex(p=> p.talle === talle) 
      if (product.data.talles[index].producto_talle.stock >= cantidad ) return true
      else return false
    }
  }

  useEffect(()=>{
    if (Object.keys(product).length){
      if (product.categorium.nombre === 'Accesorios'){
        setSize("Sin talle")
        setStock(product.talles[0].producto_talle.stock)
      } 
    }
  },[product])

  useEffect(()=>{
    if (Object.keys(product).length && product.categorium.nombre !== 'Accesorios' && size){
      let index = product.talles.findIndex(p=>p.talle === size)
      setStock(product.talles[index].producto_talle.stock)
    }    
  },[size])

  const addCart = async ()=>{
    if(product.categorium?.nombre ==="Accesorios"){
      setSize("Sin talle");
    };
    let order = {
      ...product,
      talle:size,
      cantidad:1
    };
    if (order.talle){
      const check = await checkStock()
      if (check){
        dispatch(addToCart(order));
        toast.success("Agregado al carrito");
      } else{
        toast.error(`No hay stock `)
      }
    }
    else toast.error("Seleccione un talle");
  }

  if (error) return <div>Error! {error.message}</div>;
  if (isLoading)
    return (
      <div>
        <Loading alto={"1000px"}/>
      </div>
    );

  const formatPrice = new Intl.NumberFormat("es-AR").format(product.precio);
  console.log(product);
  return (
    <Main>
      <ToastContainer position= "top-center"
          autoClose= {5000}
          hideProgressBar= {false}
          closeOnClick
          pauseOnHover
          draggable
          progress= {undefined}
          />
      <Div>
        <ImageContainer>
          <Image src={product?.imagen} />
        </ImageContainer>
        <InfoContainer>
          <H2>{product?.nombre}</H2>
          {
            size ? ( <P stock={stock}>Precio: $ {formatPrice}</P> ) : null
          }
          
          {/* <Stars>
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={20}
                  onClick={() => handleClick(index + 1)}
                  onMouseOver={() => handleMouseOver(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  color={
                    (hoverValue || currentValue) > index
                      ? colors.orange
                      : colors.grey
                  }
                  style={{
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </Stars> */}
          <SizeInfo>
            {product.categorium?.nombre !== "Accesorios" &&
              product.talles?.map((talle) => {
                return <Size onClick={defineSize} key={talle.id} 
                            className={size === talle.talle ? estilos.sizeSelected : ""}>{talle.talle}</Size>;
              })}
          </SizeInfo>
          <Description>{product.descripcion}</Description>
          <Button onClick={addCart}>Add to cart</Button>
          {/* <Review placeholder="Enter a review of the product"></Review> */}
          {/* <Button>Send review</Button> */}
        </InfoContainer>
      </Div>
    </Main>
  );
};

export default ProductDetail;
