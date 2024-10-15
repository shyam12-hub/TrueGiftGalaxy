import axios from "axios";
export const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/getproducts");
    return response.data.data;
  } catch (e: any) {
    console.log("could not able to get Products ", e.message);
  }
};
