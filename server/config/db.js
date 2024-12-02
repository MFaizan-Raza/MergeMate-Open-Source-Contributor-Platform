import mongoose from "mongoose"; // Import mongoose using ES module syntax

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://muhdtlha3:talhatalha@mergemate.9h5oy.mongodb.net/"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; // Export using ES module syntax
