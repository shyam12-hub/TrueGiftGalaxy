"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

import { Loader2 } from "lucide-react";
import { fetchProducts } from "@/helper/fetechAllproducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, ShoppingBag } from "lucide-react";
import AddProduct from "../../AddProduct";
import { groupByCategory } from "@/helper/GroupByCategory";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
function page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Define async function within useEffect
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const result = await fetchProducts();
        setProducts(result); // Assuming result contains the products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData(); // Call the async function
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center h-screen text-rose-600">
          {" "}
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <div className="mb-6 text-center flex justify-start items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AddProduct />
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {products.length === 0 ? (
            <div className="text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-rose-300 mb-4" />
              <p className="text-xl text-gray-600 mb-4">
                No products added yet
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupByCategory(products)).map(
                ([category, categoryProducts]) => (
                  <div key={category}>
                    <h2
                      className="text-2xl font-semibold mb-4 text-rose-600"
                      style={{ fontFamily: "Copperplate Gothic, serif" }}
                    >
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => {
                        return (
                          <Card
                            key={product?._id}
                            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                          >
                            <CardContent className="p-0">
                              <img
                                src={product.productMainImage.imageUrl}
                                alt={product.productMainImage.imageUrl}
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                  {product.productName}
                                </h3>
                                <p className="text-rose-600 font-bold">
                                  ₹{product.productPrice.toFixed(2)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default page;
