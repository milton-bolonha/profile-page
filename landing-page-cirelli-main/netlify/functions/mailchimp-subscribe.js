const mailchimp = require('@mailchimp/mailchimp_marketing');

exports.handler = async (event, context) => {
  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Parse dos dados
  const { name, email, message } = JSON.parse(event.body);

  // Validar email
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email é obrigatório.' }),
    };
  }

  // Configurar Mailchimp
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX || 'us2',
  });

  try {
    // Separar primeiro nome e sobrenome
    const nameParts = name ? name.trim().split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Adicionar contato ao Audience
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: 'subscribed', // 'subscribed' = sem confirmação, 'pending' = com double opt-in
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        tags: ['contato-site'], // Tag para organizar contatos vindos do site
      }
    );

    console.log('✅ Contato adicionado ao Mailchimp:', response.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Inscrito com sucesso no Mailchimp!',
        id: response.id,
        status: 'success'
      }),
    };
  } catch (error) {
    console.error('❌ Erro ao adicionar ao Mailchimp:', error);
    
    // Se o email já existe na lista, considerar como sucesso
    if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
      console.log('ℹ️ Email já existe na lista:', email);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Email já cadastrado.',
          status: 'already_subscribed'
        }),
      };
    }

    // Outros erros
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Erro ao adicionar ao Mailchimp.',
        error: error.response?.body?.detail || error.message,
        status: 'error'
      }),
    };
  }
};

