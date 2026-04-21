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
    const { sessionId, userId, side, body, quote, time } = JSON.parse(event.body);

    const message = await prisma.message.create({
      data: {
        sessionId,
        userId,
        side,
        body,
        quote,
        time
      },
      include: { user: true }
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(message)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};