import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const OrderCart = ({userOrder}) => {
    const navigate = useNavigate()
  return (
    <div className=" w-full flex flex-col gap-3">
      <div className="w-full  p-3 sm:p-5">
        <div className="flex items-center gap-3 mb-5">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl  sm:text-2xl font-bold">Orders</h1>
        </div>
        {userOrder?.length === 0 ? (
          <p className="text-gray-800  text-lg sm:text-xl">
            No Orders found for this user
          </p>
        ) : (
          <div className="space-y-5 w-full">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-xl p-3 sm:p-5 border border-gray-200"
              >
                {/*order header  */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                  <h2 className="text-sm sm:text-lg font-semibold break-words">

                    order ID: <span className="text-gray-600">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order.amount?.toFixed(2)}
                    </span>
                  </p>
                </div>

                {/*user info */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">

                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.FirstName || "Unknown"}{" "}
                      {order.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      Email:{order.user?.email || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`text-white px-2 py-1 rounded-lg text-xs sm:text-sm w-fit ${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                          ? "bg-red-800"
                          : "bg-orange-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/*products */}
                <div>
                  <h3 className="font-medium mb-2">Products</h3>
                  <ul className="space-y-2">
                    {order.products?.map((product, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg overflow-hidden"
                      >
                        <img
                          onClick={() =>
                            navigate(`/products/${product?.productId?._id}`)
                          }
                           className="w-12 h-12 sm:w-16 sm:h-16 object-cover cursor-pointer"

                          src={product.productId?.productImg?.[0]?.url}
                          alt=""
                        />
                        <span className="text-sm  sm:flex-1 break-words">
                          {product.productId?.productName}{" "}
                        </span>
                        <span className="text-xs text-gray-400 break-all hidden sm:block">

                            {product?.productId?._id}</span>
                        <span className="text-xs text-gray-500">

                          ₹{product.productId?.productPrice} *{" "}
                          {product.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCart;
