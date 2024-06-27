import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Sockets')
@Controller('ws://localhost:3000')
export class SocketController {
	constructor() {}

	@ApiOperation({
		summary: 'WebSocket Events ws://localhost:3000',
		description: `
            ### События WebSocket:

            #### \`createChat\`

                Событие, отправляемое клиентом при создании чата.
                ример использования:

                
                const createChatObject = {
                    name: 'Test Chat', // Название чата, который будет создан
                    addedUsers: ['dd834c8a-b67d-4326-905a-101115ebfb3b'] // массив id пользователей, приглашаемых в чат, который будет создан
                };
                socket.emit('createChat', createChatObject);
            
            #### \`.\`

            #### \`createChatResponse\`

                Событие, которое должно прослушиваться клиентом при создании чата
                Пример использования:

                socket.on('createChatResponse', (data) => {
                    console.log('Chat created:', data.result);
                });




            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`
            #### \`.\`




            #### \`newMessage\`

                Событие, отправляемое при получении нового сообщения в чате.

            #### \`userJoined\`

                Событие, отправляемое при присоединении нового пользователя к чату.
    `,
	})
	@Get('events')
	async getWebSocketEvents(): Promise<string> {
		return 'List of WebSocket events';
	}
}
