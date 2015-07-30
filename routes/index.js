var express = require('express');
var router = express.Router();

var quiz_controller = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quiz_controller.load); // Autoload :quizId

/* Definición de rutas de Quizes */
router.get('/quizes', quiz_controller.index);
router.get('/quizes/:quizId(\\d+)', quiz_controller.show);
router.get('/quizes/:quizId(\\d+)/answer', quiz_controller.answer);
router.get('/quizes/new', quiz_controller.new);
router.get('/quizes/create', quiz_controller.create);

/* Creditos */
router.get('/author', function (req, res) {
    res.render('author');
});

module.exports = router;
