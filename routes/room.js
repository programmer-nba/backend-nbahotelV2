var express = require('express');
var router = express.Router();
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth');

const AirType = require('../controllers/aircondition.controller');
const BedType = require('../controllers/room.bedtype.controller');
const BathType = require('../controllers/room.bathtype.controller');
const FurnitureType = require('../controllers/room.furnituretype.controller');
const RoomAmenities = require('../controllers/room.amenities.controller');
const RoomEntertainment = require('../controllers/room.entertainment.controller');
const RoomStatus = require('../controllers/room.status.controller');
const RoomView = require('../controllers/room.view.controller');
const RoomService = require('../controllers/room.service.controller');
const RoomType = require('../controllers/room.type.controller');
const RoomSecurity = require('../controllers/room.security.controller');
const Room = require('../controllers/room.controller');

const Upload = require('../controllers/room.picture.controller');


// room standard infomation
//air condition
router.get('/aircondition',AirType.GetAll);
router.post('/aircondition',adminAuth,AirType.Create);
router.patch('/aircondition/:id',adminAuth,AirType.Update);
router.delete('/aircondition/:id',adminAuth,AirType.Delete);
//bed
router.get('/bedtype',BedType.GetAll);
router.post('/bedtype',adminAuth,BedType.Create);
router.patch('/bedtype/:id',adminAuth,BedType.Update);
router.delete('/bedtype/:id',adminAuth,BedType.Delete);

//bath
router.get('/bathtype',BathType.GetAll);
router.post('/bathtype',adminAuth,BathType.Create);
router.patch('/bathtype/:id',adminAuth,BathType.Update);
router.delete('/bathtype/:id',adminAuth,BathType.Delete);

//furniture
router.get('/furnituretype',FurnitureType.GetAll);
router.post('/furnituretype',adminAuth,FurnitureType.Create);
router.patch('/furnituretype/:id',adminAuth,FurnitureType.Update);
router.delete('/furnituretype/:id',adminAuth,FurnitureType.Delete);

//amenities
router.get('/amenities',RoomAmenities.GetAll);
router.post('/amenities',adminAuth,RoomAmenities.Create);
router.patch('/amenities/:id',adminAuth,RoomAmenities.Update);
router.delete('/amenities/:id',adminAuth,RoomAmenities.Delete);

//entertainments
router.get('/entertainment',RoomEntertainment.GetAll);
router.post('/entertainment',adminAuth,RoomEntertainment.Create);
router.patch('/entertainment/:id',adminAuth,RoomEntertainment.Update);
router.delete('/entertainment/:id',adminAuth,RoomEntertainment.Delete);

//room status
router.get('/status',RoomStatus.GetAll);
router.post('/status',adminAuth,RoomStatus.Create);
router.patch('/status/:id',adminAuth,RoomStatus.Update);
router.delete('/status/:id',adminAuth,RoomStatus.Delete);

//room view
router.get('/view',RoomView.GetAll);
router.post('/view',adminAuth,RoomView.Create);
router.patch('/view/:id',adminAuth,RoomView.Update);
router.delete('/view/:id',adminAuth,RoomView.Delete);

//room services
router.get('/service',RoomService.GetAll);
router.post('/service',adminAuth,RoomService.Create);
router.patch('/service/:id',adminAuth,RoomService.Update);
router.delete('/service/:id',adminAuth,RoomService.Delete);

//room type
router.get('/type',RoomType.GetAll);
router.post('/type',adminAuth,RoomType.Create);
router.patch('/type/:id',adminAuth,RoomType.Update);
router.delete('/type/:id',adminAuth,RoomType.Delete);

//room security
router.get('/security',RoomSecurity.GetAll);
router.post('/security',adminAuth,RoomSecurity.Create);
router.patch('/security/:id',adminAuth,RoomSecurity.Update);
router.delete('/security/:id',adminAuth,RoomSecurity.Delete);

// main room routes
router.get('/',adminAuth,Room.GetAll);
router.get('/:id',adminAuth,Room.GetById);
router.get('/hotel/:id',partnerAuth,Room.GetHotelRoom);
router.get('/hotel/:id/:roomId',partnerAuth,Room.GetById);
router.post('/hotel/:id',partnerAuth,Room.Create);
router.patch('/hotel/:id/:roomId/update',partnerAuth,Room.Update);
router.patch('/hotel/:id/changestatus/:roomId',partnerAuth,Room.ChangeStatus);
router.delete('/:id',adminAuth,Room.Delete);

//picture management routes
router.post('/hotel/:id/:roomId/picture',partnerAuth,Upload.Create);
router.delete('/hotel/:id/:roomId/picture/:pictureid',partnerAuth,Upload.Delete);

module.exports = router;