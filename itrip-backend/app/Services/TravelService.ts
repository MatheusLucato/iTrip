
import Travel from 'App/Models/Travel';

export default class TravelService {
  public async createTravel(originlat,
    originlng,
    destinationlat,
    destinationlng,
    departuredate,
    departuretime,
    useridrequest,
    accepted,
    useriddriver): Promise<Travel> {

    const travel = await Travel.create({
      originlat,
      originlng,
      destinationlat,
      destinationlng,
      departuredate,
      departuretime,
      useridrequest,
      accepted,
      useriddriver
    })



    return travel;
  }

  public async getAllPendingTravels(): Promise<Travel[]> {
    try {
      const travels = await Travel.query().where('accepted', false);
      return travels;
    } catch (error) {
      console.error('Failed to retrieve travels', error);
      throw new Error('Failed to retrieve travel requests');
    }
  }

  public async travelAccept(auth, idTravel: number, idUser: number): Promise<any> {
    try {
      const travel = await Travel.find(idTravel);

      if (!travel) {
        console.error('No travel found with the given ID');
        throw new Error('No travel request found');
      }

      travel.accepted = true;
      travel.useriddriver = idUser;

      await travel.save();

      return travel;
    } catch (error) {
      console.error('Failed to accept travel request', error);
      throw new Error('Failed to accept travel request');
    }
  }

  public async getTravelsById(auth, idUser: number): Promise<Travel[]> {
    try {
      const travels = await Travel.query().where('useridrequest', idUser);

      return travels;
    } catch (error) {
      console.error('Failed to retrieve travels', error);
      throw new Error('Failed to retrieve travel requests');
    }
  }

  public async deleteTravel(auth, id: number, response): Promise<any> {
    try {
      const travel = await Travel.find(id)

      await travel?.delete()

      return response.ok();
    } catch (error) {
      console.error('Failed to retrieve travels', error);
      throw new Error('Failed to retrieve travel requests');
    }
  }

}
