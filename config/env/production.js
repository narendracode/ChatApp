module.exports = {
    db:'mongodb://admin:3Y5Rk86tpdbL@'+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/nodejs',
    privateKey: 'prod-private-key',
    tmp:'/var/lib/openshift/56a0a81f0c1e6647f80001e5/app-root/repo/tmp',
    upload:'/var/lib/openshift/56a0a81f0c1e6647f80001e5/app-root/repo/uploads'
};

