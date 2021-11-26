const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeTitle = require('string-capitalize-title');

const Notice = require('../models/notice');

// limitar as solicitações de postagem 
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000,
  max: 100, 
  delayMs: 0, 
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `Você fez muitos pedidos. Por favor tente novamente depois ${minutes} minutos.` });
  }
});

// ler 1
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `Este utilizador não existe.` });
    });
});

// ler todos
router.get('/', (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Algo deu errado. ${err}` });
    });
});

// criar
router.post('/', postLimiter, (req, res) => {


  let newNotice = new Notice({
    title: sanitizeTitle(req.body.title),
    content: sanitizeContent(req.body.content),
    date: sanitizeDate(req.body.date)
  });

  newNotice.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Sucesso registro adicionado!`,
        result: {
          _id: result._id,
          title: result.title,
          content: result.content,
          date: result.date
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.title) {
          res.status(400).json({ success: false, msg: err.errors.title.message });
          return;
        }
        if (err.errors.content) {
          res.status(400).json({ success: false, msg: err.errors.content.message });
          return;
        }
        if (err.errors.date) {
          res.status(400).json({ success: false, msg: err.errors.date.message });
          return;
        }
        
        // Mostrar erro 
        res.status(500).json({ success: false, msg: `Algo deu errado. ${err}` });
      }
    });
});

// atualiza
router.put('/:id', (req, res) => {

  
  let updatedNotice = {
    title: sanitizeTitle(req.body.title),
    content: sanitizeEmail(req.body.content),
    date: sanitizeDate(req.body.date)
  };

  Notice.findOneAndUpdate({ _id: req.params.id }, updatedNotice, { runValidators: true, context: 'query' })
    .then((oldResult) => {
      User.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Sucesso atualizado!`,
            result: {
              _id: newResult._id,
              title: newResult.title,
              content: newResult.content,
              date: newResult.date
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: `Algo deu errado. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.name) {
          res.status(400).json({ success: false, msg: err.errors.name.message });
          return;
        }
        if (err.errors.email) {
          res.status(400).json({ success: false, msg: err.errors.email.message });
          return;
        }
        if (err.errors.age) {
          res.status(400).json({ success: false, msg: err.errors.age.message });
          return;
        }
        if (err.errors.gender) {
          res.status(400).json({ success: false, msg: err.errors.gender.message });
          return;
        }
        // Mostrar erro 
        res.status(500).json({ success: false, msg: `Algo deu errado. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  Notice.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `Registro deletado.`,
        result: {
          _id: result._id,
          title: result.title,
          content: result.content,
          date: result.date
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'nao foi deletado.' });
    });
});

module.exports = router;

// Limpeza secundária a ser invocada antes de chegar ao banco de dados
sanitizeTitle = (title) => {
  return stringCapitalizeTitle(title);
}
sanitizeContent = (content) => {
  return stringCapitalizeTitle(content);
}

sanitizeDate = (date) => {
  return stringCapitalizeDate(date);
}
