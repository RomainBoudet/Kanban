const express = require('express');

// importer les controllers
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');

const router = express.Router();

//A la racine on a nos fichiers static !
 /* router.get('/', (req, res) => {
  res.send('On est bien branché sur l\'API :)');
}); */ //on envoi le front désormais via app.use(express.static('public')); présent dans l'index :)

/** Lists */
router.get('/lists', listController.getAllLists);
router.get('/lists/:id', listController.getOneList);
router.post('/lists', listController.createList);
router.patch('/lists/:id', listController.modifyList);
router.put('/lists/:id?', listController.createOrModify);
router.delete('/lists/:id', listController.deleteList);

/* Cards */
router.get('/lists/:id/cards', cardController.getCardsInList);
router.get('/cards/:id', cardController.getOneCard);
router.post('/cards', cardController.createCard);
router.patch('/cards/:id', cardController.modifyCard);
router.put('/cards/:id', cardController.createOrModify);
router.delete('/cards/:id', cardController.deleteCard);

/* Tags */
router.get('/tags', tagController.getAllTags);
router.post('/tags', tagController.createTag);
router.patch('/tags/:id', tagController.modifyTag);
router.put('/tags/:id?', tagController.createOrModify);
router.delete('/tags/:id', tagController.deleteTag);
router.post('/cards/:id/tags', tagController.associateTagToCard);
router.delete('/cards/:cardId/tags/:tagId', tagController.removeTagFromCard);

router.use((req, res) => {
  res.status(404).send('Oups... ce service n\'éxiste pas !');
});

module.exports = router;