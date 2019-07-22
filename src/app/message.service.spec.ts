import { MessageService } from "./message.service";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

describe('MessageService', () => {
    let service: MessageService;
    beforeEach(() => {

    })

    it('should add one', () => {
        service = new MessageService();
        service.add('one');
        expect(service.messages.length).toBe(1);

    })

    it('should have no message to start', () => {
        service = new MessageService();

        expect(service.messages.length).toBe(0);
    })

    it('should clear the array', () => {
        service = new MessageService();
        service.add('one');
        service.clear();
        expect(service.messages.length).toBe(0);

    })

    it('should add "one"', () => {
        service = new MessageService();
        service.add('one');    
        expect(service.messages.length).toBe(1);
        expect(service.messages[0]).toBe('one');

    })
})
