

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
}).prefix('api')
