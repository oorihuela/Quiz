var models = require('../models/models.js');

// Posibles temas a elegir para cada pregunta

var temas = ["Otro", "Humanidades", "Ocio", "Ciencia", "Tecnología" ]; 


// Autoload - Factoriza el código si ruta incluye :quizId

exports.load = function (req, res, next, quizId) {
    models.Quiz.find({
            where: { id: Number(quizId) },
            include: [{ model: models.Comment }]
        }).then(function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        }
        else {
            next(new Error('No existe quizId=' + quizId)) }
      }
    ).catch(function(error) { next(error) });
    /*models.Quiz.findById(quizId).then(
    function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        }
        else {
            next(new Error('No existe quizId=' + quizId));}
    }
    ).catch(function(error) { next(error); });*/
};


/* GET quizes */

exports.index = function (req, res) {
    if(req.query.search!="") {

        var criterio = (req.query.search).replace(" ","%");

        models.Quiz.findAll( { where:['pregunta like ?','%'+criterio+'%'], order:'pregunta ASC'}).then(function (quizes) {
             res.render('quizes/index',{ quizes:quizes, errors: [] });
        }).catch(function(error) {next(error); });

    } else{ 

        models.Quiz.findAll().then(function (quizes) {
            res.render('quizes/index', { quizes: quizes, errors: [] });
        }).catch(function(error) { next(error); });
    }
};


/* GET quizes/:id */

exports.show = function (req, res) {
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        res.render('quizes/show', { quiz: req.quiz, errors: [] });
    })
};


/* GET quizes/:id/answer */

exports.answer = function (req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase())
    {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};


/* GET quizes/new */

exports.new = function (req, res) {
    var quiz = models.Quiz.build( // crea objeto Quiz
        { pregunta: "", respuesta: "", tema: "" }
    );
    res.render('quizes/new', { quiz: quiz, errors: [], temas: temas });
};


/* POST quizes/create */

exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz
    .validate()
    .then(
        function(err) {
            if(err) {
                res.render('quizes/new', { quiz: quiz, errors: err.errors, temas: temas });
            } else {
                // Guarda en DB los campos pregunta y respuesta de quiz
    
                quiz
                .save({ fields: ["pregunta", "respuesta", "tema"] })
                .then(function() { res.redirect("/quizes") }) // Redirección HTTP (URL relativo) lista de preguntas
            }
        }
    );
};


/* GET quizes/:id/edit  */

exports.edit = function (req, res) {
    var quiz = req.quiz; // autoload de instancia de quiz
        
    res.render('quizes/edit', { quiz: quiz, errors: [], temas: temas });
};


/* PUT quizes/:id */

exports.update = function (req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz
    .validate()
    .then(
        function(err) {
            if(err) {
                res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
            } else {
                
                req.quiz  // Guarda campos pregunta y respuesta en DB
                .save({ fields: ["pregunta", "respuesta", "tema"] })
                .then(function() { res.redirect("/quizes") }) // Redirección HTTP (URL relativo) lista de preguntas
            }
        }
    );
};


/* DELETE quizes/:id  */

exports.destroy = function (req, res) {
    req.quiz.destroy().then(function () {
        res.redirect('/quizes');
    }).catch(function(err) { next(error) });
};
