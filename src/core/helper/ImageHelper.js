import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  const imageurl = product
    ? `${API}/product/photo/${product._id}`
    : `https://images.pexels.com/photos/4530802/pexels-photo-4530802.jpeg?cs=srgb&dl=pexels-sorapong-chaipanya-4530802.jpg&fm=jpg`;
  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageurl}
        alt="product_photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
    </div>
  );
};

export default ImageHelper;
