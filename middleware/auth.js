const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 클라이언트 쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth;

    // 토큰 복호화 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next(); // middleware에 갇히지 않게!
    });
    // 유저가 있으면 인증 완료
    // 없으면 인증 안됨
}

module.exports = { auth };