const { Client, LocalAuth } = require('whatsapp-web.js');
const LeadModel = require('../models/lead');

// Função para enviar mensagem para um lead
const sendMessage = (chatId, message) => {
  client.sendMessage(chatId, message);
};

// Criação do cliente do WhatsApp
const client = new Client({
  puppeteer: {
    headless: false,
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--shm-size=3gb',
    ],
  },
  authStrategy: new LocalAuth(),
  // ... outras opções do cliente
});

// Evento para receber o código QR para autenticação
client.on('qr', (qr) => {
  // Imprima o código QR e escaneie-o com seu telefone
  console.log('QR RECEIVED', qr);
});





// Evento de autenticação bem-sucedida
client.on('authenticated', (session) => {
  console.log('AUTHENTICATED');
  // Salve a sessão para reutilização posterior
  // Por exemplo: session.saveSession();
});

// Evento de conexão bem-sucedida
client.on('ready', async () => {
  console.log('CLIENT IS READY');

  const chats = await client.getChats();

for (let chat of chats) {
  // Obter todas as mensagens na conversa
  const messages = await chat.fetchMessages({fromMe: true});

  // Verificar se todas as mensagens não foram entregues
  let allMessagesNotDelivered = true;
  for (let message of messages) {
    if (message.ack !== 0) {
      allMessagesNotDelivered = false;
      break;
    }
  }

  // Se todas as mensagens não foram entregues, apagar a conversa
  if (allMessagesNotDelivered) {
    await chat.delete();
  }
}

  // Iterar sobre cada lead e enviar uma mensagem
  let leads = await LeadModel.find({ $or: [{ coldMessaged: false }, { coldMessaged: { $exists: false } }] }).lean();

  for (let lead of leads) {
    const leadID = lead._id;
    const phone = lead.data.number.replace(/[^0-9]/g, "");;
    const message = `Olá ${lead.data.name},

Espero que esteja bem. Há alguns meses, tivemos uma conversa sobre os óleos essenciais doTerra. Notei que naquela época você mostrou um interesse genuíno, mas por algum motivo, não avançamos na discussão.

Pensando nisso, gostaria de retomar o assunto e entender melhor as suas necessidades atuais. Tenho certeza de que posso ajudá-lo a encontrar o produto certo para você.

Podemos agendar um novo bate-papo para detalhar mais sobre os benefícios dos nossos óleos? Por favor, me informe um momento que seja conveniente para você.

Aguardo seu retorno,

Bárbara Verani`;

    // Verifique se o número de telefone é válido
    if (phone && isValidPhoneNumber(phone) && message) {
      const chatId = `55${phone.trim()}@c.us`;
	  try {
		sendMessage(chatId, message);
		await sleep(1500);
		await LeadModel.updateOne({ _id: leadID }, { coldMessaged: true });
	  } catch (error) {
		console.log(error)
	  }
    

    }

    // Pausa de 1,5 segundos entre cada mensagem
  }

  // Encerre a conexão do cliente após enviar todas as mensagens
  //client.destroy();
});

const isValidPhoneNumber = (phoneNumber) => {
	// Número de telefone brasileiro padrão tem 11 dígitos
	const brazilianPhoneNumberPattern = /^\d{11}$/;
	return brazilianPhoneNumberPattern.test(phoneNumber);
  };
  

// Inicie a conexão do cliente
client.initialize();

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
