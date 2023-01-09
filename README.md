# Users
nomard Youtube Code Challenge 8

```
(1) 미들웨어
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    세션에 로그인한 것이 참이면 로컬 로그인도 참이 되도록 작성합니다.
    res.locals.loggedInUser = req.session.user
    퍼그 템플릿에서 사용할 수 있도록, 세션의 유저 정보를 로컬의 로그인된 유저에 추가합니다.

(2) User 모델
    import bcrypt from "bcrypt"
    bcrypt는 비밀번호 해싱을 도와줍니다. 유저 모델 파일에 bcrypt를 불러옵니다.
    유저 스키마를 작성할 때 username을 고유하게 하기 위해 unique: true를 작성하면 됩니다.
    UserSchema.pre("save", async function () {this.password = await bcrypt.hash(this.password, 5);})
    위의 코드처럼 작성하면 비밀번호를 5번 해싱 하여 DB에 저장합니다.
    bcrypt를 사용하여 비밀번호를 해싱 하면, 해싱 된 비밀번호가 DB에 저장되기 때문에 보안을 강화할 수 있습니다.

(3) 컨트롤러 (3-1) home 컨트롤러
    세션에 로그인이 되어 있으면(req.session.loggedIn) 유저의 프로필을 보이게 하고, 로그아웃 상태면 로그인 페이지로 redirect 하면 됩니다.
    따라서 home.pug에 loggedInUser를 사용하여 로그인한 사용자의 name과 username을 표시하면 됩니다.

(3-2) postJoin 컨트롤러
    const { name, username, password, password2 } = req.body
    먼저 req.body로 사용자가 form에 입력한 데이터를 받아옵니다.
    가입 시 입력한 두 비밀번호가 일치하지 않거나 username이 이미 존재할 경우 에러를 표시해야 합니다.
    res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match." }); }
    password !== password2인 경우, 비밀번호가 일치하지 않는다는 오류를 보내기 위해 join 페이지를 렌더 할 때 status(400)을 함께 보내어 
    오류가 발생했음을 알리고 에러 메시지를 함께 보내면 됩니다.
    const exists = await User.exists({ username })
    사용자가 입력한 username이 이미 있는 username인지 단순히 확인하기 위해서 Model.exists() 메서드를 사용합니다.
    이미 사용하고 있는 username이라면 join 페이지를 렌더 할 때 status(400)을 함께 보내어 오류가 발생했음을 알리고 에러 메시지를 함께 보내면 됩니다.
    User.create({name,username,password})
    이미 사용하고 있는 username이 아니라면 Model.create() 메서드를 사용하여 새로운 User를 생성하고, /login 으로 redirect 하면 됩니다. 
    이때 혹시 모를 오류를 대비하여 try catch 구문을 사용합니다.

(3-3) postLogin
    const { username, password } = req.body
    먼저 req.body로 사용자가 form에 입력한 데이터를 받아옵니다.
    const user = await User.findOne({ username })
    username으로 유저를 찾아서 로그인을 구현하기 위해 Model.findOne() 메서드를 사용합니다.
    유저가 없으면(!user) status(400)과 함께 에러 메시지를 login 페이지로 렌더 합니다.
    const ok = await bcrypt.compare(password, user.password)
    비밀번호가 일치하는지 확인하기 위해 bcrypt를 사용합니다.
    비밀번호가 틀리면(!ok) status(400)과 함께 에러 메시지를 login 페이지로 렌더 합니다.
    req.session.loggedIn = true
    문제가 없으면, 세션 로그인이 참이 되게 합니다.
    req.session.user = user
    그리고 세션에 유저 정보를 넣고 / 로 redirect하면 됩니다.
