import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "../../ui/Form.jsx";
import Input from "../../ui/Input.jsx";
import { useSignup } from "./useSignup.js";
import Button from "../../ui/Button.jsx";
import FormRow from "../../ui/FormRow.jsx";
import { useSendOtp } from "./useSendOtp.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";

function SignupForm() {
  const { signup, isLoading } = useSignup();

  const { register, formState, getValues, handleSubmit, reset, watch } =
    useForm();
  const email = watch("email");
  const { errors } = formState;
  const { mutate: sendOtp, isLoading: isSendingOtp } = useSendOtp();

  const [retryActive, setRetryActive] = useState(false);
  const [countdown, setCountdown] = useState(0); // in seconds

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  function onSubmit({
    fullName,
    email,
    password,
    shopOwnerPhoto,
    shopOwnerName,
    inputOtp,
  }) {
    signup(
      { fullName, email, password, shopOwnerPhoto, inputOtp, shopOwnerName },
      {
        onSettled: () => reset(),
      }
    );
  }

  const handleSendOtp = () => {
    if (email && /^\S+@\S+\.\S+$/.test(email)) {
      setRetryActive(false);
      sendOtp(email, {
        onSuccess: () => {
          if (countdown > 0) {
            setInterval(() => {
              setCountdown((prev) => prev - 1);
            }, 1000);
          } else {
            setRetryActive(true);
          }
        },
      });
      setCountdown(5 * 60); // 5 minutes
    } else {
      console.log("Invalid or empty email");
    }
  };

  function handleGoogleLogin() {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

    window.location.href = googleAuthUrl;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Store Name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Shop Owner name" error={errors?.shopOwnerName?.message}>
        <Input
          type="text"
          id="shopOwnerName"
          disabled={isLoading}
          {...register("shopOwnerName")}
        />
      </FormRow>

      <FormRow label="Shop Owner Photo" error={errors?.shopOwnerPhoto?.message}>
        <Input
          type="file"
          id="shopOwnerPhoto"
          accept="image/*" // Accept only image files (e.g., jpeg, png, etc.)
          disabled={isLoading}
          {...register("shopOwnerPhoto", {
            required: "This field is required",
            validate: {
              isImage: (fileList) =>
                fileList?.[0]?.type.startsWith("image/") ||
                "Only image files are allowed",
              maxSize: (fileList) =>
                fileList?.[0]?.size < 2 * 1024 * 1024 || "Max file size is 2MB", // Optional: limit file size to 2MB
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>
      <Button disabled={retryActive} onClick={handleSendOtp} type="button">
        {isSendingOtp ? (
          <SpinnerMini />
        ) : retryActive ? (
          `Retry in ${formatTime(countdown)}`
        ) : (
          "Send Verification OTP"
        )}
      </Button>
      <FormRow label="Enter OTP" error={errors?.inputOtp?.message}>
        <Input
          type="number"
          id="inputOtp"
          disabled={isLoading}
          {...register("inputOtp", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          Create new user
        </Button>
      </FormRow>

      <FormRow>
        or
        <Button onClick={handleGoogleLogin} type="button">
          Sign in With Google
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
