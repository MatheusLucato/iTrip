
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import TravelService from 'App/Services/TravelService';

export default class TravelController {
  public async newTravel({ request, auth, response }: HttpContextContract) {

    const travelService = new TravelService();
    try {
      
      const travel = await travelService.createTravel(
        request.input('originLat'),
        request.input('originLng'),
        request.input('destinationLat'),
        request.input('destinationLng'),
        request.input('departureDate'),
        request.input('departureTime'),
        request.input('userIdRequest'),
        request.input('accepted'),
        request.input('userIdDriver')
      );

      return response.ok(travel);
    } catch (error) {
      console.error(error);
      return response.internalServerError('Unable to create travel request');
    }
  }

  public async getAllTravels({ auth, response }: HttpContextContract) {
    const travelService = new TravelService();
    try {
      const travels = await travelService.getAllPendingTravels();
      return response.ok(travels);
    } catch (error) {
      console.error('Error fetching all travels', error);
      return response.internalServerError('Unable to fetch travel requests');
    }
  }



  public async travelAccept({ auth, request, response }: HttpContextContract) {
    const travelService = new TravelService();
    try {
      const travels = await travelService.travelAccept(auth, request.input('id'), request.input('idUser'));
      return response.ok(travels);
    } catch (error) {
      console.error('Error accepting travels', error);
      return response.internalServerError('Unable to accept travel requests');
    }
  }

  public async getTravelById({ auth, request, response }: HttpContextContract) {
    const travelService = new TravelService();
    try {
      const travels = await travelService.getTravelsById(auth, request.input('userId'));
      return response.ok(travels);
    } catch (error) {
      console.error('Error accepting travels', error);
      return response.internalServerError('Unable to accept travel requests');
    }
  }

  public async deleteTravel({ auth, request, response }: HttpContextContract) {
    const travelService = new TravelService();
    try {
      const travels = await travelService.deleteTravel(auth, request.input('id'), response);
      return response.ok(travels);
    } catch (error) {
      console.error('Error deleting travel', error);
      return response.internalServerError('Unable to delete travel');
    }
  }
}
