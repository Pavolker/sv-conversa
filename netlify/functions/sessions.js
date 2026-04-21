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
    const sessions = await prisma.session.findMany({
      include: {
        authors: {
          include: { user: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    const formatted = sessions.map(s => ({
      id: s.id,
      title: s.title,
      number: s.number,
      date: s.date,
      runtime: s.runtime,
      isLive: s.isLive,
      authors: s.authors.map(a => ({
        name: a.user.name,
        initials: a.user.initials
      }))
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formatted)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};