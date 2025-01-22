module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a column called userId to UserProfiles
    await queryInterface.addColumn('userProfiles', 'userId', {
      type: Sequelize.INTEGER, // Type of data (integer)
      allowNull: false, // Make sure userId cannot be null
      references: {
        model: 'Users', // Link this to the Users table
        key: 'id', // The 'id' column in the Users table
      },
      onDelete: 'CASCADE', // If the user is deleted, delete the profile too
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to undo the migration, remove the userId column
    await queryInterface.removeColumn('UserProfiles', 'userId');
  },
};
