import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import $ from "jquery";

//Queries
import {
  changeUserPass,
  checkOldPasswordValid,
} from "../../queries/user_queries";
import { checkValidField, disableInputField } from "../../queries/aux_queries";
import { checkStrength } from "../../queries/passwordStrengthMeter";

//Components
import ShowPassword from "./ShowPassword";
import StrengthPassBars from "./StrengthPassBars";

//static files
import "../../public/css/settings/changePassword.css";

function ChangePassword({ user }) {
  const defaultPicURL = process.env.REACT_APP_FB_DEFAULT_PROF_PIC;
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if (checkPasswords()) {
      await changeUserPass(newPass, user._id, console.log("FIN"));
    }
  };

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeatedNewPass, setRepeatedNewPass] = useState("");
  const [strengthLevel, setStrengthLevel] = useState(-1);

  const handleChangeOldPassword = (e) => {
    setOldPass(e.target.value);
    handleCheckPassStrength(e.target.value);
    //await handleCheckOldPass(e.target.value);
  };

  const handleCheckPassStrength = (val) => {
    if (val.length === 0) {
      setStrengthLevel(-1);
    } else {
      const result = checkStrength(val);
      setStrengthLevel(result);
    }
  };

  const handleChangeNewPassword = async (e) => {
    setNewPass(e.target.value);
  };

  const handleChangeRepeatedNewPassword = async (e) => {
    setRepeatedNewPass(e.target.value);
  };

  const checkPasswords = () => {
    return (
      checkValidField(oldPass) &&
      checkValidField(newPass) &&
      checkValidField(repeatedNewPass) &&
      newPass === repeatedNewPass
    );
  };

  const handleCheckOldPass = async (value) => {
    const result = await checkOldPasswordValid(user._id, value);
    if (result) {
      enableNewPasswordFields();
      $("#oldPassword").css({
        border: "2px solid #54DB5F",
        backgroundColor: "#eafbeb",
      });
      $("#newPassword").focus();
    } else {
      $("#oldPassword").css({
        border: "2px solid #F25D30",
        backgroundColor: "#fdece7",
      });
    }
  };

  const handleShowPassword = (fieldName, enable) => {
    const inputType = enable ? "text" : "password";
    $(`#${fieldName}`).attr("type", inputType);
  };

  const enableNewPasswordFields = () => {
    disableInputField("newPassword", false);
    disableInputField("confirmNewPassword", false);
  };

  useEffect(() => {
    return () => {
      setOldPass("");
      setNewPass("");
      setRepeatedNewPass("");
    };
  }, [user]);

  return (
    <div className="editProfile">
      {/* Edit header */}
      <div className="edit-header">
        <img
          src={
            user.profile_picture === "undefined"
              ? defaultPicURL
              : user.profile_picture
          }
          alt={user.username}
          title={user.username}
        />
        <div className="cont-info-header">
          <h2 className="tx-gray">{user.username}</h2>
        </div>
      </div>
      {/* Edit body */}
      <form className="editBody" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control p-relative">
          <label htmlFor="oldPassword" className="bold-black">
            Contraseña antigua
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            autoFocus
            value={oldPass}
            onChange={handleChangeOldPassword}
            ref={register({ required: true })}
          />
          <ShowPassword
            showPassword={true}
            show={handleShowPassword.bind(this, "oldPassword", true)}
            hide={handleShowPassword.bind(this, "oldPassword", false)}
          />
        </div>
        <StrengthPassBars level={strengthLevel} />
        <div className="form-control p-relative">
          <label htmlFor="newPassword" className="bold-black">
            Contraseña nueva
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPass}
            onChange={handleChangeNewPassword}
            disabled={true}
            ref={register({ required: true })}
          />
          <ShowPassword
            showPassword={true}
            show={handleShowPassword.bind(this, "newPassword", true)}
            hide={handleShowPassword.bind(this, "newPassword", false)}
          />
        </div>
        <div className="form-control p-relative">
          <label htmlFor="confirmNewPassword" className="bold-black">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            id="confirmNewPassword"
            value={repeatedNewPass}
            onChange={handleChangeRepeatedNewPassword}
            disabled={true}
            ref={register({ required: true })}
          />
          <ShowPassword
            showPassword={true}
            show={handleShowPassword.bind(this, "confirmNewPassword", true)}
            hide={handleShowPassword.bind(this, "confirmNewPassword", false)}
          />
        </div>
        <button type="submit">Cambiar contraseña</button>
      </form>
      <Link
        to="/accounts/password/reset"
        className="decoration-none bold text-center l-forgot-password"
      >
        ¿Has olvidado la contraseña?
      </Link>
    </div>
  );
}

export default withRouter(ChangePassword);
