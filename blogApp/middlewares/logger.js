const { transports, createLogger, format} = require("winston");
const { combine, timestamp, prettyPrint} = format;
const PostgresTransport = require('winston-postgres-transport');
const options = {
    // level: 'error',
    name: 'Postgres',
    // postgresOptions: {
    //     // Is called with (connection, query, params)
    //     debug: console.log,
    // },
    postgresUrl: 'postgres://blogapp_user:193745045+Bd.@vps1.inadayapp.com:5432/blogdb',
    tableName: 'app_logs',
};

const winstonLogger = createLogger({
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.File({filename:'logs/logs.log', level:'info', maxFiles:'3d'}),
        new transports.File({filename:'logs/exceptions.log', level:'error', maxFiles:'3d'}), //handleExceptions: true, handleRejections: true
        new PostgresTransport(options)
    ]
});

const winstonLogger2 = createLogger({
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss"
        })
    ),
    transports: [new PostgresTransport(options)]
});

process.on("uncaughtException", (err) => {
    console.log(err);
    winstonLogger.error(err.message);
    // winstonLogger2.error(err.message);

    const options = {
        fields: ['message'],
        from: new Date() - 2 * 60 * 60 * 1000,
        until: new Date(),
        limit: 10,
        order: 'ASC',
      };
      winstonLogger.query(options, (err, results) => {
        if (err) {
        //   throw err;
            console.log("bulunamadı");
        }
        process.exit(1);
      });
});

process.on("unhandledRejection", (err) => {
    console.log(err);
    winstonLogger.error(err.message);
    winstonLogger2.error(err.message);

    const options = {
        fields: ['message'],
        from: new Date() - 2 * 60 * 60 * 1000,
        until: new Date(),
        limit: 10,
        order: 'ASC',
      };
      winstonLogger2.query(options, (err, results) => {
        if (err) {
        //   throw err;
            console.log("bulunamadı");
        }
        process.exit(1);
      });
});

module.exports = { winstonLogger, winstonLogger2};