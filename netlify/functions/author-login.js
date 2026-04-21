const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Email ou senha inválidos' })
      };
    }

    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Acesso não autorizado' })
      };
    }

    const sessionAuthor = await prisma.sessionAuthor.findFirst({
      where: { userId: user.id }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        side: sessionAuthor?.side || 'left'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};