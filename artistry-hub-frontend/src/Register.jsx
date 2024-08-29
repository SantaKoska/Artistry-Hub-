import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { AiOutlineUnlock } from "react-icons/ai";
import validator from "validator";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "",
    additionalData: {
      artForm: "",
      specialisation: "",
      expertise: "",
      ownerName: "",
      location: {
        address: "",
        district: "",
        state: "",
        country: "",
        postalCode: "",
      },
      universityAffiliation: "",
      registrationID: "",
    },
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialisation: "",
    ownerName: "",
    universityAffiliation: "",
    expertise: "",
  });

  // Function to fetch location data based on postal code
  const fetchLocationData = async (postalCode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${postalCode}`
      );
      if (
        response.data &&
        response.data[0] &&
        response.data[0].Status === "Success"
      ) {
        const place = response.data[0].PostOffice[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          additionalData: {
            ...prevFormData.additionalData,
            location: {
              ...prevFormData.additionalData.location,
              district: place.District,
              state: place.State,
              country: "India",
            },
          },
        }));
      } else {
        console.error("Error fetching data: ", response.data[0].Message);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Validation functions
  const validateUsername = (userName) =>
    validator.isAlpha(userName.replace(/\s/g, ""));

  const validateEmail = (email) => validator.isEmail(email);

  const validatePassword = (password) =>
    validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

  const validateSpecialisation = (specialisation) =>
    validator.isAlpha(specialisation.replace(/\s/g, ""));

  const validateOwnerName = (ownerName) =>
    validator.isAlpha(ownerName.replace(/\s/g, ""));

  const validateUniversityAffiliation = (universityAffiliation) =>
    validator.isAlpha(universityAffiliation.replace(/\s/g, ""));

  const validateExpertise = (expertise) =>
    validator.isAlpha(expertise.replace(/\s/g, ""));

  // Handle input changes
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // check if the input field is related to location
    if (name.startsWith("additionalData.location.")) {
      const locationField = name.replace("additionalData.location.", "");

      // update location fields in formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        additionalData: {
          ...prevFormData.additionalData,
          location: {
            ...prevFormData.additionalData.location,
            [locationField]: value,
          },
        },
      }));

      // If the postal code is being changed, fetch the corresponding location data
      if (locationField === "postalCode" && value.length === 6) {
        await fetchLocationData(value);
      }
    } else if (name.startsWith("additionalData.")) {
      // handle other additionalData fields
      const fieldName = name.replace("additionalData.", "");
      setFormData((prevFormData) => ({
        ...prevFormData,
        additionalData: {
          ...prevFormData.additionalData,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Perform validation if necessary
    let errorMsg = "";

    switch (name) {
      case "userName":
        errorMsg = validateUsername(value)
          ? ""
          : "Username should only contain letters and spaces.";
        break;
      case "email":
        errorMsg = validateEmail(value) ? "" : "Invalid email address.";
        break;
      case "password":
        errorMsg = validatePassword(value)
          ? ""
          : `Password must have at least 8 characters,
           including one uppercase letter, one lowercase letter,
           one number, and one special character.`;
        break;
      case "confirmPassword":
        errorMsg = value === formData.password ? "" : "Passwords do not match.";
        break;
      case "specialisation":
        errorMsg = validateSpecialisation(value)
          ? ""
          : "Specialisation should only contain letters and spaces.";
        break;
      case "ownerName":
        errorMsg = validateOwnerName(value)
          ? ""
          : "Owner name should only contain letters and spaces.";
        break;
      case "universityAffiliation":
        errorMsg = validateUniversityAffiliation(value)
          ? ""
          : "University Affiliation should only contain letters and spaces.";
        break;
      case "expertise":
        errorMsg = validateExpertise(value)
          ? ""
          : "Expertise should only contain letters and spaces.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  // Handle role change
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: selectedRole,
      additionalData: {
        ...prevFormData.additionalData,
        artForm: "",
        specialisation: "",
        expertise: "",
        ownerName: "",
        universityAffiliation: "",
        registrationID: "",
        location: {
          address: "",
          district: "",
          state: "",
          country: "",
          postalCode: "",
        },
      },
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      specialisation: "",
      ownerName: "",
    }));
  };

  // Determine required fields based on role
  const requiredFields = (role) => {
    switch (role) {
      case "Artist":
        return ["additionalData.artForm", "additionalData.specialisation"];
      case "Viewer/Student":
        return ["additionalData.artForm"];
      case "Institution":
        return [
          "additionalData.universityAffiliation",
          "additionalData.registrationID",
          "additionalData.location.postalCode",
          "additionalData.location.district",
          "additionalData.location.state",
          "additionalData.location.country",
        ];
      case "Service Provider":
        return [
          "additionalData.ownerName",
          "additionalData.expertise",
          "additionalData.location.address",
          "additionalData.location.postalCode",
          "additionalData.location.district",
          "additionalData.location.state",
          "additionalData.location.country",
        ];
      default:
        return [];
    }
  };

  // Validate form
  const formvalidate = () => {
    const requiredFieldsArray = [
      "userName",
      "email",
      "password",
      "role",
      ...requiredFields(formData.role),
    ];

    return (
      requiredFieldsArray.every((field) =>
        field.includes("additionalData")
          ? formData.additionalData.location[field.split(".")[1]]?.trim() !==
              "" && formData.additionalData[field.split(".")[1]]?.trim() !== ""
          : formData[field]?.trim() !== "" && formData.role?.trim() !== ""
      ) && Object.values(errors).every((error) => error === "")
    );
  };

  return (
    <div className=" bg-slate-800 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-md bg-opacity-30 relative">
      <div>
        <h1 className="text-4xl font-semibold text-white text-center mb-6">
          Register
        </h1>

        {/* form starting username , password , confirm password and email */}
        <form action="">
          <div className="relative my-4 mb-8">
            <input
              type="text"
              name="userName"
              className={`block w-96 py-2.4 px-0 text-base text-white font-semibold  border-0 border-b-2 ${
                errors.userName ? "border-red-500" : "border-emerald-900"
              } bg-transparent appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
              placeholder=" "
              value={formData.userName}
              onChange={handleInputChange}
            />
            <label
              htmlFor="userName"
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              User Name
            </label>
            <BiUser className="absolute top-0 right-4 peer-focus:text-yellow-500" />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          <div className="relative my-4 mb-8">
            <input
              type="email"
              name="email"
              className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                errors.email ? "border-red-500" : "border-emerald-900"
              } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
              placeholder=" "
              value={formData.email}
              onChange={handleInputChange}
            />
            <label
              htmlFor="email"
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Email
            </label>
            <BiUser className="absolute top-0 right-4 peer-focus:text-yellow-500" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative my-4 mt-8">
            <input
              type="password"
              name="password"
              className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                errors.password ? "border-red-500" : "border-emerald-900"
              } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
              placeholder=" "
              value={formData.password}
              onChange={handleInputChange}
            />
            <label
              htmlFor="password"
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Password
            </label>
            <AiOutlineUnlock className="absolute top-0 right-4 peer-focus:text-yellow-500" />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 whitespace-pre-line">
                {errors.password}
              </p>
            )}
          </div>

          <div className="relative my-4 mt-8">
            <input
              type="password"
              name="confirmPassword"
              className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                errors.confirmPassword ? "border-red-500" : "border-emerald-900"
              } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Your Password
            </label>
            <AiOutlineUnlock className="absolute top-0 right-4 peer-focus:text-yellow-500" />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* roles choice code  */}

          <div className="relative my-4 mt-8">
            <select
              className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
              value={formData.role}
              onChange={handleRoleChange}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="Artist">Artist</option>
              <option value="Viewer/Student">Viewer/Student</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Institution">Institution</option>
            </select>
            <label className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6">
              Role
            </label>
          </div>

          {/* if the role is a Artist */}

          {formData.role === "Artist" && (
            <>
              <div className="relative my-4 mt-8">
                <select
                  name="additionalData.artForm"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  value={formData.additionalData.artForm}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select your artform
                  </option>
                  <option value="Painting">Painting</option>
                  <option value="Sculpturet">Sculpture</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Literature">Literature</option>
                  <option value="Cinema">Cinema</option>
                  <option value="Theater">Theater</option>
                  <option value="Music">Music</option>
                </select>
                <label
                  htmlFor="additionalData.artForm"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Known Art Form
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.specialisation"
                  className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                    errors.specialisation
                      ? "border-red-500"
                      : "border-emerald-900"
                  } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
                  placeholder=" "
                  value={formData.additionalData.specialisation}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.specialisation"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  What is your specialisation these artform?
                </label>
                {errors.specialisation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specialisation}
                  </p>
                )}
              </div>
            </>
          )}

          {/* if viewer/students is selected */}
          {formData.role === "Viewer/Student" && (
            <div className="relative my-4 mt-8">
              <select
                name="additionalData.artForm"
                className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                value={formData.additionalData.artForm}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select your artform
                </option>
                <option value="Painting">Painting</option>
                <option value="Sculpturet">Sculpture</option>
                <option value="Architecture">Architecture</option>
                <option value="Literature">Literature</option>
                <option value="Cinema">Cinema</option>
                <option value="Theater">Theater</option>
                <option value="Music">Music</option>
              </select>
              <label
                htmlFor="additionalData.artForm"
                className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Favourite Art Form
              </label>
            </div>
          )}

          {/* if service provider is selected */}
          {formData.role === "Service Provider" && (
            <>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.ownerName"
                  className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                    errors.ownerName ? "border-red-500" : "border-emerald-900"
                  } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
                  placeholder=" "
                  value={formData.additionalData.ownerName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.ownerName"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Owner Name
                </label>
                {errors.ownerName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ownerName}
                  </p>
                )}
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.expertise"
                  className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                    errors.expertise ? "border-red-500" : "border-emerald-900"
                  } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
                  placeholder=" "
                  value={formData.additionalData.expertise}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.expertise"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Expertise
                </label>
                {errors.expertise && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expertise}
                  </p>
                )}
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.address"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.address}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.address"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Address
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.location.postalCode"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.postalCode}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.location.postalCode"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  PinCode
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.district"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.district}
                  readOnly
                />
                <label
                  htmlFor="additionalData.district"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  District
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.state"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.state}
                  readOnly
                />
                <label
                  htmlFor="additionalData.state"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  State
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.country"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.country}
                  readOnly
                />
                <label
                  htmlFor="additionalData.country"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Country
                </label>
              </div>
            </>
          )}

          {/* if selected Institution */}
          {formData.role === "Institution" && (
            <>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.universityAffiliation"
                  className={`block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 ${
                    errors.universityAffiliation
                      ? "border-red-500"
                      : "border-emerald-900"
                  } appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer`}
                  placeholder=" "
                  value={formData.additionalData.universityAffiliation}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.universityAffiliation"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  University Affiliation (Optional)
                </label>
                {errors.universityAffiliation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.universityAffiliation}
                  </p>
                )}
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.registrationID"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.registrationID}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.registrationID"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Registration ID
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.postalCode"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.postalCode}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.postalcode"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  PinCode
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.district"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.district}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.district"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  district
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.state"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.state}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.state"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  State
                </label>
              </div>
              <div className="relative my-4 mt-8">
                <input
                  type="text"
                  name="additionalData.country"
                  className="block w-96 py-2.4 px-0 text-base text-white font-semibold bg-transparent border-0 border-b-2 border-emerald-900 appearance-none focus:outline-none focus:ring-0 focus:text-black focus:border-yellow-500 peer"
                  placeholder=" "
                  value={formData.additionalData.location.country}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="additionalData.country"
                  className="absolute text-white text-lg duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:text-yellow-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Country
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full mb-4 text-[18px] font-semibold mt-6 rounded-full py-2 transition-colors duration-400 ${
              formvalidate()
                ? "bg-white text-black hover:bg-emerald-900 hover:text-white"
                : "bg-white text-black opacity-50 cursor-not-allowed"
            }`}
            disabled={!formvalidate()}
          >
            Register
          </button>

          <div>
            <span>
              Already have an account?{" "}
              <Link className="text-yellow-400" to="/login">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
