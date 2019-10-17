// export the dynamic secret that heroku will create 

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'i told you a secret was being made. muahaha!'
}
