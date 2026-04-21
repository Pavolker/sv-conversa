require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const prisma = require('./db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_session', async (sessionId) => {
    socket.join(`session_${sessionId}`);
    console.log(`Socket ${socket.id} joined session_${sessionId}`);
  });

  socket.on('new_message', async (data) => {
    io.to(`session_${data.sessionId}`).emit('message_added', data);
  });

  socket.on('new_comment', async (data) => {
    io.to(`session_${data.sessionId}`).emit('comment_added', data);
  });

  socket.on('new_reaction', async (data) => {
    io.to(`session_${data.sessionId}`).emit('reaction_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        authors: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions/:id', async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: parseInt(req.params.id) },
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
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const { title, number, date, runtime, authorIds } = req.body;
    const session = await prisma.session.create({
      data: {
        title,
        number,
        date: new Date(date),
        runtime,
        authors: {
          create: authorIds.map((userId, index) => ({
            userId,
            side: index === 0 ? 'left' : 'right',
            order: index
          }))
        }
      },
      include: { authors: { include: { user: true } } }
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/:sessionId', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { sessionId: parseInt(req.params.sessionId) },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { sessionId, userId, side, body, quote, time } = req.body;
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

    io.to(`session_${sessionId}`).emit('message_added', message);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/comments/:sessionId', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { sessionId: parseInt(req.params.sessionId) },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { sessionId, userId, body, ref, refId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        sessionId,
        userId,
        body,
        ref,
        refId
      },
      include: { user: true }
    });

    io.to(`session_${sessionId}`).emit('comment_added', comment);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reactions', async (req, res) => {
  try {
    const { messageId, userId, type } = req.body;

    const existing = await prisma.reaction.findUnique({
      where: {
        messageId_userId_type: {
          messageId,
          userId,
          type
        }
      }
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id }
      });
      await prisma.message.update({
        where: { id: messageId },
        data: {
          likes: type === 'LIKED' ? { decrement: 1 } : undefined,
          echoes: type === 'ECHOED' ? { decrement: 1 } : undefined
        }
      });
    } else {
      await prisma.reaction.create({
        data: { messageId, userId, type }
      });
      await prisma.message.update({
        where: { id: messageId },
        data: {
          likes: type === 'LIKED' ? { increment: 1 } : undefined,
          echoes: type === 'ECHOED' ? { increment: 1 } : undefined
        }
      });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { likes: true, echoes: true }
    });

    io.to(`session_${req.body.sessionId}`).emit('reaction_updated', {
      messageId,
      likes: message.likes,
      echoes: message.echoes
    });

    res.json({ likes: message.likes, echoes: message.echoes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };