module.exports = {
 db:'mongodb://admin:4w7Jy93WAWb8@'+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/portfolio',
    privateKey: 'prod-private-key',
    tmp:'/var/lib/openshift/5689ff2389f5cfb35400001f/app-root/repo/tmp',
    upload:'/var/lib/openshift/5689ff2389f5cfb35400001f/app-root/repo/uploads'
};

