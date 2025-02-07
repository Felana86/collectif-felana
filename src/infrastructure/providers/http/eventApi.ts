
import { Event, EventPage } from "../../../domain/entities/Event";
import { AddressDTO } from "../../DTOs/AddressDTO";
import { EventDTO } from "../../DTOs/Event";

import { ApiServiceI, ApiService } from "./apiService";

export class EventApi {
    private readonly dataType: string = 'events';

    private readonly api: ApiServiceI;
    constructor() { this.api = new ApiService(); }

    async getEvents(page?: number, filter?: string, category?: string): Promise<EventPage> {
        const pageR = page ? `?page=${page}` : '';
        const filterR = filter ? `&filter=${filter}` : '';
        const categoryR = category ? `&category=${category}` : '';
        return this.api.get(`${this.dataType}${pageR}${filterR}${categoryR}`);
    }

    async getEventById(id: number): Promise<Event> {
        return this.api.get(`${this.dataType}/${id}`);
    }

    async postEvent(event: EventDTO, address: AddressDTO): Promise<Event> {
        const formData = this.api.createFormData(event, address);
        return this.api.post(this.dataType, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async updateEvent(id: number, event: EventDTO, address: AddressDTO): Promise<Event> {
        const formData = this.api.createFormData(event, address);
        return this.api.patch(`${this.dataType}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async deleteEvent(id: number): Promise<Event> {
        return this.api.delete(`${this.dataType}/${id}`);
    }
}