interface Product {
  productName: string;
  productDescription: string;
  productPrice: number;
  rating: number;
  category: string;
  productMainImage: {
    imageUrl: string;
    publicId: string;
  };
  viewImages: [
    {
      imageUrl: string;
      publicId: string;
    }
  ];
  userId: string;
  shopInfo: object;
}
export const groupByCategory = (products: Product[] = []) => {
  const groupedProducts = products.reduce(
    (acc: Record<string, Product[]>, product: Product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );
  return groupedProducts;
};
