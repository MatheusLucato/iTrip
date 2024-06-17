export interface TravelRequest {
    originAddress: string;
    destinationAddress: string;
    id: number;
    uuid: string;
    useridrequest: number;
    originlat: string;
    originlng: string;
    destinationlat: string;
    destinationlng: string;
    departuretime: string;
    departuredate: string;
    accepted: boolean;
}
