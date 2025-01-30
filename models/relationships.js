import { User } from "./userModel.js";
import { UserProfiles } from "./userProfiles.js";

const userRelation = () => {User.hasOne(UserProfiles, {
  foreignKey: "userID",
  as: "userProfile",
  onDelete: "CASCADE"
});

UserProfiles.belongsTo(User, {
  foreignKey: "userID",
  as: "user"
});
};

export { userRelation };