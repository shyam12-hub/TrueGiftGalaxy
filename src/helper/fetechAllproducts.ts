import axios from "axios";
export const fetchData = async (api: string) => {
  try {
    const response = await axios.get(api);
    return response.data.data;
  } catch (e: any) {
    console.log("could not able to get Products ", e.message);
    throw e;
  }
};
