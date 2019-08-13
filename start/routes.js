'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|__________________________________________________________________________
|
|+++++++++++++++++++++++++++DB Configuration+++++++++++++++++++++++++++++++
|==========================================================================
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|  DBUSER:mantu_1234
|  DBPASSWORD:abc123xyz
|  SERVER:mongodb://mantu_mean_db:@ds115198.mlab.com
|  PORT:15198
|  DB:schedule
|    
|
|    HOST=127.0.0.1
|    PORT=3333
|    NODE_ENV=development
|    APP_URL=http://${HOST}:${PORT}
|    CACHE_VIEWS=false
|    APP_KEY=CavET6tdWVTpzcDHiInvGd35w4WIEQNI
|    DB_CONNECTION=mongodb
|    DB_HOST=ds129939.mlab.com
|    DB_PORT=29939
|    DB_USER=mantu
|    DB_PASSWORD=adonis
|    DB_DATABASE=schedule
|    SESSION_DRIVER=cookie
|
|========================================================================
| *************************** mlab configuration*************************
|========================================================================
| user name- mantu_1234
| password - m@ntup@ni123
|------------------------------------------------------------------------
    db name - test_db
    db user - test_mantu
    db password - testmantu123
    mongodb://test_mantu:testmantu123@ds353457.mlab.com:53457/test_db



*/
use('require-all')(`${use('Helpers').appRoot()}/app/Routes/`)