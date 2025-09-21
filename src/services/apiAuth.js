import axios from "axios";

export async function sendOtp(email) {
  const { data, error } = await axios.post(
    "http://192.168.1.20:8000/api/v1/shopOwners/send-verification-otp",
    { email }
  );

  if (error) throw new Error(error.message);

  return data;
}

export async function signup({
  fullName,
  email,
  password,
  shopOwnerName,
  shopOwnerPhoto,
  inputOtp,
}) {
  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("shopOwnerName", shopOwnerName);
  formData.append("inputOtp", inputOtp);
  formData.append("shopOwnerPhoto", shopOwnerPhoto[0]); // 👈 Important: add the file itself

  const { data } = await axios.post(
    "http://192.168.1.20:8000/api/v1/shopOwners/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await axios.post(
    "http://192.168.1.20:8000/api/v1/shopOwners/login",
    { email, password },
    {
      withCredentials: true,
    }
  );

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentShopOwner() {
  const { data, error } = await axios.get(
    "http://192.168.1.20:8000/api/v1/shopOwners/current-shopOwner",
    { withCredentials: true }
  );

  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  const { data, error } = await axios.post(
    "http://192.168.1.20:8000/api/v1/shopOwners/logout",
    {},
    { withCredentials: true }
  );

  if (error) throw new Error(error.message);

  return data;
}

// export async function updateCurrentUser({ password, fullName, avatar }) {
//   // 1. Update password OR fullName
//   let updateData;
//   if (password) updateData = { password };
//   if (fullName) updateData = { data: { fullName } };

//   const { data, error } = await supabase.auth.updateUser(updateData);

//   if (error) throw new Error(error.message);
//   if (!avatar) return data;

//   // 2. Upload the avatar image
//   const fileName = `avatar-${data.user.id}-${Math.random()}`;

//   const { error: storageError } = await supabase.storage
//     .from("avatars")
//     .upload(fileName, avatar);

//   if (storageError) throw new Error(storageError.message);

//   // 3. Update avatar in the user
//   const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
//     data: {
//       avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
//     },
//   });

//   if (error2) throw new Error(error2.message);
//   return updatedUser;
// }
