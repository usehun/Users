import User from "./models/User";
import bcrypt from "bcrypt";

export const home = async (req, res) => {
  if (req.session.loggedIn) {
    return res.render("home", { pageTitle: "Home" });
  }
  return res.redirect("/login");
};

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, password, password2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match."
    });
  }
  const exists = await User.exists({ username });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username is already taken"
    });
  }
  try {
    await User.create({
      name,
      username,
      password
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message
    });
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This username does not exist."
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  res.status(404).render("404", { pageTitle: "Not Found" });
};
