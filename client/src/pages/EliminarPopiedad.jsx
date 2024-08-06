import React from 'react'
import { toast } from 'react-toastify'

export const EliminarPopiedad = () => {

    const deleteProperty = async () => {
            try {
                await axios.delete(`http://localhost:3000/api/products/${id}`)
                toast.success("PROPIEDAD ELIMINADA")
                //VOLVER A CARGAR PRODUCTOS
            } catch (error) {
                toast.error(error)
            }
    }



  return (
    <div>EliminarPopiedad</div>
  )
}
