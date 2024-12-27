import axios from "axios";

export async function getCustomers() {
  const { data, error } = await axios.get(
    "http://192.168.1.20:8000/api/v1/shopOwners/customers/customers-list",
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzVmMWQ4ODc3NzVkMTA2OTZhYmI1MWYiLCJlbWFpbCI6InF1cmVzaGlhbmFzNDcxQGdtYWlsLmNvbSIsInNob3BPd25lck5hbWUiOiJhbmFzIHF1cmVzaGkiLCJpYXQiOjE3MzUzMTQxMDksImV4cCI6MTczNTQwMDUwOX0.ygEf6Z-nQFA67cY_whaWsugHva8E1xaRvMh7sAbojeo`,
      },
    }
  );
  if (error) {
    console.error(error);
    throw new Error("Customers list cannot be loaded");
  }

  return data;
}
