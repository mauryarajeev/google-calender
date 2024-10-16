/* 
    Rutas de usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { createUser, LoginUser, renewJWT } = require('../controllers/auth');
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();


router.post('/new',
    [   //middleware
        check('name', 'The name is obligatory').not().isEmpty(),
        check('email', 'The email is obligatory').isEmail(),
        check('password', 'Password is required, must have at most or equal 6 strings').isLength({ min: 6 }),
        validateFields,

    ],
    createUser);

router.post("/",
    [ //Middleware
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 6 }),
        validateFields,
    ],

    LoginUser);

router.get("/renew", validateJWT, renewJWT);


module.exports = router;