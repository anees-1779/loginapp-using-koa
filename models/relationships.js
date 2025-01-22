import { User } from "./userModel.js";
import { UserProfiles } from "./userProfiles.js";

User.hasOne(UserProfiles, {
  foreignKey: "userID",
  onDelete: "CASCADE"
})

UserProfiles.belongsTo(User, {
  foreignKey: "userID"
})