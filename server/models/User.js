const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) { // 비밀번호가 변경될때만 암호화
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) { // hash = 암호화된 Pw
                if (err) return next(err)
                user.password = hash;
                next()
            })

        })
    } else {
        next()
    }
}) // 저장하기 전 실행

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    //jsonwebtoken 이용해 token 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); // user._id + 'secretToken' = token
    user.token = token;
    user.save(function (err, user) {
        if (err) return err;
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // user._id + '' = token;
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디로 유저 찾고
        // 클라이언트에서 가져온 token과 DB에 보관된 token 일치 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        });

    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };