import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    WsException,
    ConnectedSocket,
} from '@nestjs/websockets';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';

@ApiTags('comments')
@WebSocketGateway()
export class CommentsGateway {
    private user: User;
    constructor(
        private readonly commentsService: CommentsService,
        private readonly authService: AuthService,
    ) {}
    @WebSocketServer() io: Server;
    private readonly logger = new Logger(CommentsGateway.name);
    afterInit() {
        this.logger.log('Initialized');
    }

    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        try {
            const accessTokenCookie =
                client.handshake.headers.cookie.split(';')[0];
            const accessToken = accessTokenCookie.split('=')[1];
            const user = await this.authService.getUserFromAuthenticationToken(
                accessToken,
            );
            if (!user) {
                throw new Error('Unauthenticated user.');
            }
            this.user = user;
            const { sockets } = this.io.sockets;

            this.logger.log(`Client id: ${client.id} connected`);
            this.logger.debug(`Number of connected clients: ${sockets.size}`);
        } catch (error: any) {
            this.logger.error(error.message);
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client id:${client.id} disconnected`);
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(
        @MessageBody() itemId: number,
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `item-${itemId}`;

        // Join the room associated with the item
        client.join(roomName);

        this.logger.log(`Client id: ${client.id} joined room: ${roomName}`);
    }

    @SubscribeMessage('leaveRoom')
    async leaveRoom(
        @MessageBody() itemId: number,
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `item-${itemId}`;

        // Leave the room associated with the item
        client.leave(roomName);

        this.logger.log(`Client id: ${client.id} left room: ${roomName}`);
    }

    @SubscribeMessage('createComment')
    async create(
        @MessageBody() createCommentDto: CreateCommentDto,
        @ConnectedSocket() client: Socket,
    ) {
        const {item_id} = createCommentDto;
        const newComment = await this.commentsService.create(
            createCommentDto,
            this.user,
        );

        const roomName = `item-${item_id}`;

        // Emit the 'newComment' event to clients in the room associated with the item
        this.io.to(roomName).emit('newComment', newComment);
    }

    @SubscribeMessage('findAllComments')
    async findAll() {
        return this.commentsService.findAll();
    }

    @SubscribeMessage('findOneComment')
    async findOne(@MessageBody() id: number) {
        return this.commentsService.findOne(id);
    }

    @SubscribeMessage('updateComment')
    async update(@MessageBody() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(
            updateCommentDto.id,
            updateCommentDto,
        );
    }

    @SubscribeMessage('removeComment')
    async remove(@MessageBody() id: number) {
        return this.commentsService.remove(id);
    }
}