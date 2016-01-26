// # Ghost Configuration
// Setup your Ghost install for various [environments](http://support.ghost.org/config/#about-environments).
// Ghost runs in `development` mode by default. Full documentation can be found at http://support.ghost.org/config/
var path = require('path'),
    config;

var DRIVE_STORAGE_KEY = new Buffer(process.env.DRIVE_STORAGE_KEY.split('\\n').join(require('os').EOL), 'ASCII').toString('ASCII');
var postgresRegex = /^(postgres:\/\/)([^:]+):([^@]+)@([^:]+):([^\/]+)\/([^/]+)$/;
var parsedPostgres = postgresRegex.exec(process.env.DATABASE_URL);
var postgresInfo = {
    user: parsedPostgres[2],
    password: parsedPostgres[3],
    host: parsedPostgres[4],
    port: parsedPostgres[5],
    database: parsedPostgres[6]
};

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment.
    // Configure your URL and mail settings here
    production: {
        url: process.env.SITE_URL,
        mail: {
            from: process.env.EMAIL_ADDRESS,
            transport: 'SMTP',
            options: {
                service: 'Mailgun',
                auth: {
                    user: process.env.EMAIL_USER, // mailgun username
                    pass: process.env.EMAIL_PASSWORD // mailgun password
                }
            }
        },
        database: {
            client: 'postgres',
            connection: {
                host: postgresInfo.host,
                user: postgresInfo.user,
                password: postgresInfo.password,
                database: postgresInfo.database,
                port: postgresInfo.port
            },
            debug: false
        },

        server: {
            host: '0.0.0.0',
            port: process.env.PORT || '2368'
        },
        storage: {
            active: 'ghost-google-drive',
            'ghost-google-drive': {
                key: {
                    private_key_id: process.env.DRIVE_STORAGE_KEY_ID,
                    private_key: DRIVE_STORAGE_KEY,
                    client_email: process.env.DRIVE_STORAGE_EMAIL,
                    client_id: process.env.DRIVE_STORAGE_CLIENT_ID
                }
            }
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your Ghost blog's published URL.
        url: 'http://localhost:2368',

        // Example mail config
        // Visit http://support.ghost.org/mail for instructions
        // ```
        //  mail: {
        //      transport: 'SMTP',
        //      options: {
        //          service: 'Mailgun',
        //          auth: {
        //              user: '', // mailgun username
        //              pass: ''  // mailgun password
        //          }
        //      }
        //  },
        // ```

        // #### Database
        // Ghost supports sqlite3 (default), MySQL & PostgreSQL
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-dev.db')
            },
            debug: false
        },
        // #### Server
        // Can be host & port (default), or socket
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '2368'
        },
        // #### Paths
        // Specify where your content directory lives
        paths: {
            contentPath: path.join(__dirname, '/content/')
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-test.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing MySQL
    // Used by Travis - Automated testing run through GitHub
    'testing-mysql': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: 'root',
                password: '',
                database: 'ghost_testing',
                charset: 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing pg
    // Used by Travis - Automated testing run through GitHub
    'testing-pg': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'pg',
            connection: {
                host: '127.0.0.1',
                user: 'postgres',
                password: '',
                database: 'ghost_testing',
                charset: 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    }
};

module.exports = config;
