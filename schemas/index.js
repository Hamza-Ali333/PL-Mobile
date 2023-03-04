import * as Yup from "yup";

export const signUpSchema = Yup.object({
  username: Yup.string().min(2).max(25).required("Please enter user name."),
  firstname: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter your first name."),
  lastname: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter your last name."),
  email: Yup.string().email("Invalid Email").required("Please enter email"),
  password: Yup.string().min(8).required("Please enter your password."),
  confirmPassword: Yup.string()
    .required("Please enter confrim password.")
    .oneOf([Yup.ref("password"), null], "Password must be same."),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().required("Please Enter Email").email(),
});
