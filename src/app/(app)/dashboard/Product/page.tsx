"use client";

import DashboardLayout from "../../DashboardLayout";

import { Loader2 } from "lucide-react";
import { fetchData } from "@/helper/fetechAllproducts";
import AddProduct from "../../AddProduct";
import { ShoppingBag } from "lucide-react";

import { groupByCategory } from "@/helper/GroupByCategory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useSwr, { mutate } from "swr";

function page() {
  const { data, error, isValidating } = useSwr("/api/getproducts", fetchData);

  if (error) {
    return <h1>Error Happen</h1>;
  }

  return (
    <DashboardLayout>
      {isValidating ? (
        <div className="flex justify-center items-center h-screen text-rose-600">
          {" "}
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <AddProduct onProductAdded={() => mutate("/api/getproducts")} />
          {data?.length === 0 ? (
            <div className="text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-rose-300 mb-4" />
              <p className="text-xl text-gray-600 mb-4">
                No products added yet
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupByCategory(data)).map(
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
                            key={product.productMainImage.imageUrl}
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
