import io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
export class SocketService {

    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;
    public init (): SocketService {
        this.socket = io('codefusion.online:3000');
        return this;
    }

    public added (message: any): void {
        this.socket.emit('added', message);
    }

    public deleted (message: any): void {
        this.socket.emit('deleted', message);
    }

    public edited (message: any): void {
        this.socket.emit('edited', message);
    }

    public onAdd (): Observable<any> {
        return fromEvent(this.socket, 'added');
    }

    public onDelete (): Observable<any> {
        return fromEvent(this.socket, 'deleted');
    }

}
