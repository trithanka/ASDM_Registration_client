const connection = require("../DATABASE/mysqlConnection");
const logger = require("./logger");

class supportDatabase {
  struct = {
    mysqlConn: null,
    data: {
      data: null,
      errorCode: null,
      isError: true,
    },
  };
  constructor() {}

  //check mysql connection
  async checkConnection() {
    try {
      this.struct.mysqlConn = await connection.getDB();
      this.struct.data.isError = false;
    } catch (error) {
      this.struct.data.errorCode = "MS-SQL-1";
      this.struct.data.isError = true;
      this.struct.data.statusCode = 501;
      this.struct.data.message = "Mysql connection error";
    }
    return this;
  }

  //   execute database query
  async executeQuery(query = null, queryParams = [], type = null) {
    if (!this.struct.data.isError) {
      try {
        this.struct.data.data = await connection.query(
          this.struct.mysqlConn,
          query,
          queryParams
        );
      } catch (error) {
        logger.error(error);
        this.struct.data.errorCode = `MS-${type}-1`;
        this.struct.data.isError = true;
      } finally {
        if (
          this.struct.mysqlConn &&
          typeof this.struct.mysqlConn.release === "function"
        ) {
          this.struct.mysqlConn.release();
        }
      }
    }
    return this;
  }
}

//check mysql connection
const checkConnection = async () => {
  let data={
    isError:false
  }
  try {
    data.mysqlConn = await connection.getDB();
  } catch (error) {
    data.errorCode = "MS-SQL-1";
    data.isError = true;
    data.statusCode = 501;
    data.message = "Mysql connection error";
  }
  return data;
};

module.exports = { checkConnection };
