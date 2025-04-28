import UserModel from "../Model/Auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const RegisterRoles = async (req, res) => {
  try {
    const { username, password, role, firstname, lastname } = req.body;

    if (!username || !password) {
      return res.status(400).json("Username and Password are required");
    }

    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      return res.status(401).json("UserName Already exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        username: username,
        password: hashedPassword,
        role: role,
        firstname: firstname,
        lastname: lastname,
      });
      return res.status(200).json("Added Successfully");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

const Login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) return res.status(404).json({ message: "username not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credential" });
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      accessToken,
      Role: user.role,
      UserId: user._id,
      User: user ? user?.firstname + " " + user?.lastname : "",
    });
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};

export default { RegisterRoles, Login };
