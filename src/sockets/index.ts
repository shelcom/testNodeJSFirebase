import {Server as SocketIOServer, Socket} from 'socket.io';
import {Server} from 'http';
import {OnEventType} from './eventType';
import {ChatSocketServer} from './chatSocketServer';
import {container, injectable} from 'tsyringe';
import {SocketAuthMiddleware} from 'middleware';
import {LocationSocketServer} from './locationSocketServer';

enum RouteType {
  chats = '/api/chats',
  locations = '/api/locations',
}

const instanceForRouteType = (routeType: RouteType, socket: Socket) => {
  switch (routeType) {
    case RouteType.chats:
      const chatSocketServerInstance = container.resolve(ChatSocketServer);
      chatSocketServerInstance.configure(socket);
      break;

    case RouteType.locations:
      const locationSocketServerInstance =
        container.resolve(LocationSocketServer);
      locationSocketServerInstance.configure(socket);
      break;
  }
};

@injectable()
export class SocketServer {
  private timer = null;

  configure = (httpServer: Server) => {
    const io = new SocketIOServer(httpServer);

    const routeTypes = Object.values(RouteType);
    routeTypes.forEach((type) => {
      io.of(type)
        .use(SocketAuthMiddleware)
        .on(OnEventType.connection, this.onConnection(type));
    });
  };

  private onConnection = (routeType: RouteType) => {
    return (socket: Socket) => {
      instanceForRouteType(routeType, socket);

      this.setTimer(socket);
      socket.on(OnEventType.disconnect, this.onDisconnect);
    };
  };

  private onDisconnect = () => {
    console.log('disconnect');
    clearTimeout(this.timer);
  };

  private setTimer = (socket: Socket) => {
    const expiresIn = (socket.data.user.exp - Date.now() / 1000) * 1000;
    console.log(expiresIn / 1000 / 60);
    this.timer = setTimeout(() => socket.disconnect(true), expiresIn);
  };
}
