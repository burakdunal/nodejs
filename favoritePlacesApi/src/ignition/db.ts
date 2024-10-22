import dbConn from "../data/database";
import dummyData from "../data/dummy-data";

// Async IIFE
const initializeDatabase = async () => {
  try {
    await dbConn.sync(); // { force: true }
    // await dummyData();
  } catch (error) {
    console.error("Database sync error:", error);
  }
};

export default initializeDatabase; // Fonksiyonu dışa aktar
