import axios from "axios";
import ACCESS_TOKEN from "../../constants";

export async function getCustomers() {
  const { data, error } = await axios.get(
    "http://192.168.1.20:8000/api/v1/shopOwners/customers/customers-list",
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  if (error) {
    console.error(error);
    throw new Error("Customers list cannot be loaded");
  }

  return data;
}

export async function addCustomer(customer) {
  const { data, error } = await axios.post(
    `http://192.168.1.20:8000/api/v1/shopOwners/customers/add-customer`,
    customer,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Customer cannot be added");
  }
  return data;
}
