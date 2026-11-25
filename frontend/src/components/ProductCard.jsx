import { memo } from "react";
function ProductCard({name,price}){
    console.log("ProductCard rendered:", name);
    return(
        <div>
            <h3>
                {name}
            </h3>
            <p>Product:Rs.{price}</p>
        </div>
    );
}
export default memo(ProductCard)