import axios from "axios";
import {
  APROBAR_PEDIDO,
  CHECKOUT, CREAR_PEDIDO, GET_FACTURA, GUARDAR_DATOS_COMPRADOR, GET_PEDIDOS, GET_USUARIOS,
} from "./actionTypes";

const URL_SERVER = "http://localhost:3001";

// Handle HTTP errors since fetch won't.
export const checkout = (checkoutData) => async dispatch => {
    const {data} = await axios.post(`${URL_SERVER}/create_preference`, checkoutData);
    return dispatch({
        type: CHECKOUT,
        payload: data
    })
} 

export const guardarDatosComprador = (checkoutData) => async dispatch => {
  const {data} = await axios.post(`${URL_SERVER}/factura/crear`, checkoutData);
  return dispatch({
      type: GUARDAR_DATOS_COMPRADOR,
      payload: data
  })
} 

export const crearPedido = (pedido) => async dispatch => {
  const {data} = await axios.post(`${URL_SERVER}/pedido/crear`, pedido, { withCredentials: true });
  console.log(data)
  return dispatch ({
    type: CREAR_PEDIDO,
    payload: data
  })
}

export const getFactura = (idPedido) => async dispatch => {
  const {data} = await axios.get(`${URL_SERVER}/pedido/${idPedido}`);
  // console.log(data)
  return dispatch ({
    type: GET_FACTURA,
    payload: data
  })
}

export const aprobarPedido = (datos) => async dispatch => {
  const {data} = await axios.put(`${URL_SERVER}/factura/edit`, datos);
  return dispatch({
    type: APROBAR_PEDIDO,
    payload: data
  })

export function getPedidos(){
  return async function(dispatch){
      try {
      var json = await axios.get(`${URL_SERVER}/pedidos/`,{});
      return dispatch({
          type: GET_PEDIDOS,
          payload: json.data
      });
  } catch (error) {
      console.log(error)
  }
  }
}

export function getUsuarios(){
  return async function(dispatch){
      try {
      var json = await axios.get(`${URL_SERVER}/usuarios/`,{});
      return dispatch({
          type: GET_USUARIOS,
          payload: json.data
      });
  } catch (error) {
      console.log(error)
  }
  }
}

export function updateUser(payload) {
  return async function () {
    try {
      const response = await axios.put(`${URL_SERVER}/admin/usuario/`, payload);
      return response;
    } catch (e) {
      console.log(e);
    }
  };
}