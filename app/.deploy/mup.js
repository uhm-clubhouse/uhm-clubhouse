module.exports = {
  servers: {
    one: {
      host: 'uhm-clubhouse.xyz',
      username: 'root',
      password: 'uhm808Club'
    }
  },
  proxy: {
    domains: 'uhm-clubhouse.xyz',
    ssl: {
      letsEncryptEmail: 'chadv2@hawaii.edu',
      forceSSL: true
    }
  },
  app: {
    // if you edit the app 'name' field, be sure to run 'mup stop' if the app is already running.
    // otherwise you will have two apps deployed at once, with unpredictable results.
    name: 'uhm-clubhouse',
    path: '../',
    servers: { one: {}, },
    buildOptions: { serverOnly: true },
    env: {
      ROOT_URL: 'http://uhm-clubhouse.xyz',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },
    docker: { image: 'zodern/meteor:latest' },
    enableUploadProgressBar: true
  },
  mongo: { version: '5.0', servers: { one: {} }
  },
};
