import config from "config";

type Seqdb = {
  host: string;
  database: string;
  user: string;
  pass: string;
  port: string | number;
  allowExitOnIdle: boolean;
}

const myConfig: { seqdb: Seqdb } = {
  seqdb: {
    host: config.get<string>("db.host"),
    database: config.get<string>("db.name"),
    user: config.get<string>("db.user"),
    pass: config.get<string>("db.pass"),
    port: config.get<number>("db.port"),
    allowExitOnIdle: true,
  },
};

export default myConfig;
