import { Address } from "../../domain/entities/Address";
import { EventCategory } from "../../domain/entities/Event";
import { Participant } from "../../domain/entities/Participant";
import { EventView } from "../../presenter/views/viewsEntities/eventViewEntities";


export class EventDTO {
    Address: Address = new Address();
    addressId?: number = 0;
    category: EventCategory | string = EventCategory.CATEGORY_1;
    description: string = '';
    end: Date | string = new Date();
    image: string | File = '';
    participantsMin: number = 0;
    start: Date | string = new Date();
    title: string = '';
    userId?: number = 0;
    Participants?: Participant[];

    constructor(init?: Partial<EventDTO>) {
        if (init) {
            Object.keys(init).forEach(key => {
                if (key in this) {
                    (this as any)[key] = init[key as keyof EventDTO];
                }
            });
        }
    }
}

export class EventUpdateDTO implements Partial<EventDTO> { }


export type EventPage = { events: Event[], count: number };

export type EventViewPage = { events: EventView[], count: number };
