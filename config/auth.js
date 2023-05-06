require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = function(){
    const generateTokens = payload => {
        // Vì payload không muốn lấy key refreshToken
        const { id, username } = payload
    
        const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5m'
        })
    
        const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1h'
        })
    
        return {
            accessToken,
            refreshToken
        }
    }
    
    const updateRefreshToken = (username, refreshToken) => {
        users = users.map(user => {
            if(user.username === username) return {
                ...user,
                refreshToken
            }
    
            return user
        })
    }
}
