

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')
  Route.get('validate-token', 'AuthController.validateToken')
  Route.post('getTokenLog','AuthController.getTokenLog')
  Route.post('deleteTokenLog', 'AuthController.deleteTokenLog')
  Route.post('findUserIdByToken', 'AuthController.findUserIdByToken')
  Route.post('register', 'AuthController.register')


  
  Route.put('changePassword', 'UserController.changePassword')
  Route.put('deleteAccount', 'UserController.deleteAccount')

  Route.post('newTravel', 'TravelController.newTravel')
  Route.get('getAllTravels', 'TravelController.getAllTravels');
  Route.post('travelAccept', 'TravelController.travelAccept');
  Route.get('getTravelById', 'TravelController.getTravelById');
  Route.post('deleteTravel', 'TravelController.deleteTravel');
}).prefix('api')
