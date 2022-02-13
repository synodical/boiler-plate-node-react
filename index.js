const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const config = require('./config/key');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB is connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world gg'));

app.post('/register', (req, res) => {
    const user = new User(req.body);  // 상단에서 require로 가져온 User 스키마에 req.body를 담아 user라는 인스턴스로 만든다.
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        })
    });
})
app.post('/login', (req, res) => {
    // 요청된 이메일이 db에 있는지 탐색
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // db에 있다면 비밀번호 일치 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            }
            // 비밀번호도 같다면 token 생성
            user.generateToken((err, user) => {

            })
        })
    })
})
app.listen(port, () => console.log(`listening on port ${port}`));


