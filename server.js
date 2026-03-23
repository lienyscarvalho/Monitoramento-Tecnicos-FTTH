const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_super_seguro_aqui';

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

// Rota raiz redireciona para login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Inicializar banco de dados
const db = new sqlite3.Database('./ftth_monitoring.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✓ Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

// Criar tabelas
function initializeDatabase() {
  db.serialize(() => {
    // Tabela de usuários/administradores
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de técnicos
    db.run(`
      CREATE TABLE IF NOT EXISTS technicians (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'available',
        location_lat REAL,
        location_lng REAL,
        location_name TEXT,
        current_os_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de ordens de serviço
    db.run(`
      CREATE TABLE IF NOT EXISTS service_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'normal',
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        customer_email TEXT,
        address TEXT NOT NULL,
        address_lat REAL,
        address_lng REAL,
        description TEXT,
        technician_id INTEGER,
        assigned_at DATETIME,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (technician_id) REFERENCES technicians(id)
      )
    `);

    // Tabela de histórico de atividades
    db.run(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        technician_id INTEGER NOT NULL,
        service_order_id INTEGER,
        action_type TEXT NOT NULL,
        description TEXT,
        location_lat REAL,
        location_lng REAL,
        photos TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (technician_id) REFERENCES technicians(id),
        FOREIGN KEY (service_order_id) REFERENCES service_orders(id)
      )
    `);

    // Tabela de check-ins
    db.run(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        technician_id INTEGER NOT NULL,
        service_order_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        location_lat REAL NOT NULL,
        location_lng REAL NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (technician_id) REFERENCES technicians(id),
        FOREIGN KEY (service_order_id) REFERENCES service_orders(id)
      )
    `);

    console.log('✓ Tabelas criadas/verificadas com sucesso');
    seedDatabase();
  });
}

// Popular banco com dados de exemplo
function seedDatabase() {
  // Verificar se já existem dados
  db.get('SELECT COUNT(*) as count FROM technicians', [], (err, row) => {
    if (err) {
      console.error('Erro ao verificar dados:', err);
      return;
    }

    if (row.count === 0) {
      console.log('Populando banco de dados com dados de exemplo...');

      // Inserir usuário admin
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(`
        INSERT INTO users (username, password, email, role)
        VALUES (?, ?, ?, ?)
      `, ['admin', hashedPassword, 'admin@ftth.com', 'admin']);

      // Inserir técnicos
      const technicians = [
        ['Carlos Silva', 'carlos@ftth.com', '(11) 98888-1111', 'CS', 'busy', -23.5505, -46.6333, 'Zona Norte'],
        ['Maria Santos', 'maria@ftth.com', '(11) 98888-2222', 'MS', 'available', -23.5629, -46.6544, 'Centro'],
        ['João Pedro', 'joao@ftth.com', '(11) 98888-3333', 'JP', 'busy', -23.5489, -46.6388, 'Zona Sul'],
        ['Ana Costa', 'ana@ftth.com', '(11) 98888-4444', 'AC', 'available', -23.5475, -46.6361, 'Zona Oeste'],
        ['Roberto Lima', 'roberto@ftth.com', '(11) 98888-5555', 'RL', 'busy', -23.5558, -46.6396, 'Zona Leste'],
        ['Paula Mendes', 'paula@ftth.com', '(11) 98888-6666', 'PM', 'offline', -23.5505, -46.6333, 'Base']
      ];

      technicians.forEach(tech => {
        db.run(`
          INSERT INTO technicians (name, email, phone, avatar, status, location_lat, location_lng, location_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, tech);
      });

      // Inserir ordens de serviço
      const orders = [
        ['OS-2451', 'installation', 'in_progress', 'high', 'Cliente A', '(11) 99999-1111', 'cliente.a@email.com', 'Rua das Flores, 123', -23.5505, -46.6333, 'Instalação de fibra óptica residencial', 1],
        ['OS-2452', 'maintenance', 'pending', 'normal', 'Cliente B', '(11) 99999-2222', 'cliente.b@email.com', 'Av. Principal, 456', -23.5629, -46.6544, 'Verificação de sinal', null],
        ['OS-2453', 'installation', 'in_progress', 'high', 'Cliente C', '(11) 99999-3333', 'cliente.c@email.com', 'Rua do Sol, 789', -23.5489, -46.6388, 'Instalação empresarial', 3],
        ['OS-2454', 'repair', 'pending', 'urgent', 'Cliente D', '(11) 99999-4444', 'cliente.d@email.com', 'Praça Central, 321', -23.5475, -46.6361, 'Reparo de cabo rompido', null],
        ['OS-2455', 'installation', 'in_progress', 'normal', 'Cliente E', '(11) 99999-5555', 'cliente.e@email.com', 'Rua Nova, 654', -23.5558, -46.6396, 'Instalação residencial', 5]
      ];

      orders.forEach(order => {
        db.run(`
          INSERT INTO service_orders (order_number, type, status, priority, customer_name, customer_phone, customer_email, address, address_lat, address_lng, description, technician_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, order);
      });

      console.log('✓ Dados de exemplo inseridos com sucesso');
      console.log('✓ Usuário admin criado: admin / admin123');
    }
  });
}

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Registrar novo usuário
app.post('/api/auth/register', authenticateToken, (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, email, role || 'admin'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Usuário ou email já existe' });
        }
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        userId: this.lastID
      });
    }
  );
});

// ==================== ROTAS DE TÉCNICOS ====================

// Listar todos os técnicos
app.get('/api/technicians', authenticateToken, (req, res) => {
  const { status } = req.query;
  
  let query = 'SELECT * FROM technicians';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar técnicos' });
    }
    res.json(rows);
  });
});

// Buscar técnico por ID
app.get('/api/technicians/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM technicians WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar técnico' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }
    res.json(row);
  });
});

// Criar novo técnico
app.post('/api/technicians', authenticateToken, (req, res) => {
  const { name, email, phone, avatar, status, location_lat, location_lng, location_name } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  db.run(
    `INSERT INTO technicians (name, email, phone, avatar, status, location_lat, location_lng, location_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, avatar, status || 'available', location_lat, location_lng, location_name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar técnico' });
      }
      res.status(201).json({
        message: 'Técnico criado com sucesso',
        technicianId: this.lastID
      });
    }
  );
});

// Atualizar técnico
app.put('/api/technicians/:id', authenticateToken, (req, res) => {
  const { name, email, phone, avatar, status, location_lat, location_lng, location_name } = req.body;

  db.run(
    `UPDATE technicians 
     SET name = COALESCE(?, name),
         email = COALESCE(?, email),
         phone = COALESCE(?, phone),
         avatar = COALESCE(?, avatar),
         status = COALESCE(?, status),
         location_lat = COALESCE(?, location_lat),
         location_lng = COALESCE(?, location_lng),
         location_name = COALESCE(?, location_name),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, email, phone, avatar, status, location_lat, location_lng, location_name, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar técnico' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Técnico não encontrado' });
      }
      res.json({ message: 'Técnico atualizado com sucesso' });
    }
  );
});

// Atualizar localização do técnico
app.patch('/api/technicians/:id/location', authenticateToken, (req, res) => {
  const { location_lat, location_lng, location_name } = req.body;

  if (!location_lat || !location_lng) {
    return res.status(400).json({ error: 'Coordenadas são obrigatórias' });
  }

  db.run(
    `UPDATE technicians 
     SET location_lat = ?,
         location_lng = ?,
         location_name = COALESCE(?, location_name),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [location_lat, location_lng, location_name, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar localização' });
      }
      res.json({ message: 'Localização atualizada com sucesso' });
    }
  );
});

// Deletar técnico
app.delete('/api/technicians/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM technicians WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar técnico' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }
    res.json({ message: 'Técnico deletado com sucesso' });
  });
});

// ==================== ROTAS DE ORDENS DE SERVIÇO ====================

// Listar todas as ordens de serviço
app.get('/api/service-orders', authenticateToken, (req, res) => {
  const { status, technician_id, type } = req.query;
  
  let query = `
    SELECT so.*, t.name as technician_name 
    FROM service_orders so
    LEFT JOIN technicians t ON so.technician_id = t.id
    WHERE 1=1
  `;
  let params = [];

  if (status) {
    query += ' AND so.status = ?';
    params.push(status);
  }
  if (technician_id) {
    query += ' AND so.technician_id = ?';
    params.push(technician_id);
  }
  if (type) {
    query += ' AND so.type = ?';
    params.push(type);
  }

  query += ' ORDER BY so.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
    }
    res.json(rows);
  });
});

// Buscar ordem de serviço por ID
app.get('/api/service-orders/:id', authenticateToken, (req, res) => {
  db.get(
    `SELECT so.*, t.name as technician_name 
     FROM service_orders so
     LEFT JOIN technicians t ON so.technician_id = t.id
     WHERE so.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
      }
      res.json(row);
    }
  );
});

// Criar nova ordem de serviço
app.post('/api/service-orders', authenticateToken, (req, res) => {
  const {
    order_number,
    type,
    priority,
    customer_name,
    customer_phone,
    customer_email,
    address,
    address_lat,
    address_lng,
    description,
    technician_id
  } = req.body;

  if (!type || !customer_name || !address) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const finalOrderNumber = order_number || `OS-${Date.now()}`;

  db.run(
    `INSERT INTO service_orders (
      order_number, type, priority, customer_name, customer_phone, 
      customer_email, address, address_lat, address_lng, description, technician_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      finalOrderNumber, type, priority || 'normal', customer_name,
      customer_phone, customer_email, address, address_lat, address_lng,
      description, technician_id
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
      }
      res.status(201).json({
        message: 'Ordem de serviço criada com sucesso',
        orderId: this.lastID,
        orderNumber: finalOrderNumber
      });
    }
  );
});

// Atualizar ordem de serviço
app.put('/api/service-orders/:id', authenticateToken, (req, res) => {
  const {
    type, status, priority, customer_name, customer_phone,
    customer_email, address, description, technician_id
  } = req.body;

  db.run(
    `UPDATE service_orders 
     SET type = COALESCE(?, type),
         status = COALESCE(?, status),
         priority = COALESCE(?, priority),
         customer_name = COALESCE(?, customer_name),
         customer_phone = COALESCE(?, customer_phone),
         customer_email = COALESCE(?, customer_email),
         address = COALESCE(?, address),
         description = COALESCE(?, description),
         technician_id = COALESCE(?, technician_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [type, status, priority, customer_name, customer_phone, customer_email, address, description, technician_id, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
      }
      res.json({ message: 'Ordem de serviço atualizada com sucesso' });
    }
  );
});

// Atribuir técnico a uma OS
app.patch('/api/service-orders/:id/assign', authenticateToken, (req, res) => {
  const { technician_id } = req.body;

  if (!technician_id) {
    return res.status(400).json({ error: 'ID do técnico é obrigatório' });
  }

  db.run(
    `UPDATE service_orders 
     SET technician_id = ?,
         assigned_at = CURRENT_TIMESTAMP,
         status = 'assigned',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [technician_id, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atribuir técnico' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
      }

      // Atualizar status do técnico
      db.run('UPDATE technicians SET status = ?, current_os_id = ? WHERE id = ?', 
        ['busy', req.params.id, technician_id]);

      res.json({ message: 'Técnico atribuído com sucesso' });
    }
  );
});

// Iniciar atendimento de uma OS
app.patch('/api/service-orders/:id/start', authenticateToken, (req, res) => {
  db.run(
    `UPDATE service_orders 
     SET status = 'in_progress',
         started_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao iniciar atendimento' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
      }
      res.json({ message: 'Atendimento iniciado com sucesso' });
    }
  );
});

// Finalizar atendimento de uma OS
app.patch('/api/service-orders/:id/complete', authenticateToken, (req, res) => {
  const { notes } = req.body;

  db.get('SELECT technician_id FROM service_orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err || !order) {
      return res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
    }

    db.run(
      `UPDATE service_orders 
       SET status = 'completed',
           completed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao finalizar atendimento' });
        }

        // Atualizar status do técnico para disponível
        if (order.technician_id) {
          db.run('UPDATE technicians SET status = ?, current_os_id = NULL WHERE id = ?', 
            ['available', order.technician_id]);
        }

        res.json({ message: 'Atendimento finalizado com sucesso' });
      }
    );
  });
});

// Deletar ordem de serviço
app.delete('/api/service-orders/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM service_orders WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar ordem de serviço' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json({ message: 'Ordem de serviço deletada com sucesso' });
  });
});

// ==================== ROTAS DE CHECK-IN ====================

// Criar check-in
app.post('/api/checkins', authenticateToken, (req, res) => {
  const { technician_id, service_order_id, type, location_lat, location_lng, notes } = req.body;

  if (!technician_id || !service_order_id || !type || !location_lat || !location_lng) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  db.run(
    `INSERT INTO checkins (technician_id, service_order_id, type, location_lat, location_lng, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [technician_id, service_order_id, type, location_lat, location_lng, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar check-in' });
      }
      res.status(201).json({
        message: 'Check-in registrado com sucesso',
        checkinId: this.lastID
      });
    }
  );
});

// Listar check-ins
app.get('/api/checkins', authenticateToken, (req, res) => {
  const { technician_id, service_order_id } = req.query;
  
  let query = `
    SELECT c.*, t.name as technician_name, so.order_number
    FROM checkins c
    LEFT JOIN technicians t ON c.technician_id = t.id
    LEFT JOIN service_orders so ON c.service_order_id = so.id
    WHERE 1=1
  `;
  let params = [];

  if (technician_id) {
    query += ' AND c.technician_id = ?';
    params.push(technician_id);
  }
  if (service_order_id) {
    query += ' AND c.service_order_id = ?';
    params.push(service_order_id);
  }

  query += ' ORDER BY c.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar check-ins' });
    }
    res.json(rows);
  });
});

// ==================== ROTAS DE LOG DE ATIVIDADES ====================

// Criar log de atividade
app.post('/api/activity-logs', authenticateToken, (req, res) => {
  const { technician_id, service_order_id, action_type, description, location_lat, location_lng, photos, notes } = req.body;

  if (!technician_id || !action_type) {
    return res.status(400).json({ error: 'Técnico e tipo de ação são obrigatórios' });
  }

  db.run(
    `INSERT INTO activity_logs (technician_id, service_order_id, action_type, description, location_lat, location_lng, photos, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [technician_id, service_order_id, action_type, description, location_lat, location_lng, JSON.stringify(photos || []), notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar log de atividade' });
      }
      res.status(201).json({
        message: 'Log de atividade criado com sucesso',
        logId: this.lastID
      });
    }
  );
});

// Listar logs de atividade
app.get('/api/activity-logs', authenticateToken, (req, res) => {
  const { technician_id, service_order_id, limit } = req.query;
  
  let query = `
    SELECT al.*, t.name as technician_name, so.order_number
    FROM activity_logs al
    LEFT JOIN technicians t ON al.technician_id = t.id
    LEFT JOIN service_orders so ON al.service_order_id = so.id
    WHERE 1=1
  `;
  let params = [];

  if (technician_id) {
    query += ' AND al.technician_id = ?';
    params.push(technician_id);
  }
  if (service_order_id) {
    query += ' AND al.service_order_id = ?';
    params.push(service_order_id);
  }

  query += ' ORDER BY al.created_at DESC';

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar logs de atividade' });
    }
    res.json(rows);
  });
});

// ==================== ROTAS DE DASHBOARD/ESTATÍSTICAS ====================

// Estatísticas gerais
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};

  // Contar técnicos por status
  db.all('SELECT status, COUNT(*) as count FROM technicians GROUP BY status', [], (err, techStats) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
    
    stats.technicians = {
      total: techStats.reduce((sum, s) => sum + s.count, 0),
      byStatus: techStats
    };

    // Contar ordens de serviço por status
    db.all('SELECT status, COUNT(*) as count FROM service_orders GROUP BY status', [], (err, osStats) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
      }
      
      stats.serviceOrders = {
        total: osStats.reduce((sum, s) => sum + s.count, 0),
        byStatus: osStats
      };

      // Ordens por tipo
      db.all('SELECT type, COUNT(*) as count FROM service_orders GROUP BY type', [], (err, typeStats) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
        
        stats.serviceOrders.byType = typeStats;

        res.json(stats);
      });
    });
  });
});

// ==================== ROTA DE HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FTTH Monitoring API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     FTTH Field Monitoring API                        ║
║     Servidor rodando em http://localhost:${PORT}       ║
╚═══════════════════════════════════════════════════════╝

✓ Banco de dados: SQLite
✓ Autenticação: JWT
✓ CORS habilitado

📋 Credenciais padrão:
   Usuário: admin
   Senha: admin123

📚 Documentação da API: http://localhost:${PORT}/api/health
  `);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
});
