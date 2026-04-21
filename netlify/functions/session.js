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

  try {
    const session = await prisma.session.findUnique({
      where: { id: 1 },
      include: {
        authors: {
          include: { user: true }
        },
        messages: {
          include: { user: true },
          orderBy: { createdAt: 'asc' }
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(session)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};