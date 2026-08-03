const crypto = require('crypto');
const prisma = require('../prisma');

function generateInviteCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars code
}

async function createHousehold(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'El nombre del hogar es requerido' });
    }

    let inviteCode = generateInviteCode();
    // Ensure uniqueness
    let exists = await prisma.household.findUnique({ where: { inviteCode } });
    while (exists) {
      inviteCode = generateInviteCode();
      exists = await prisma.household.findUnique({ where: { inviteCode } });
    }

    const household = await prisma.household.create({
      data: {
        name,
        inviteCode,
        users: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: true,
        categories: true
      }
    });

    res.status(201).json(household);
  } catch (error) {
    console.error('Error al crear hogar:', error);
    res.status(500).json({ error: 'Error al crear hogar' });
  }
}

async function joinHousehold(req, res) {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) {
      return res.status(400).json({ error: 'El código de invitación es requerido' });
    }

    const household = await prisma.household.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() }
    });

    if (!household) {
      return res.status(404).json({ error: 'Código de invitación inválido o no encontrado' });
    }

    // Check if already a member
    const existingRelation = await prisma.householdMemberUser.findUnique({
      where: {
        userId_householdId: {
          userId,
          householdId: household.id
        }
      }
    });

    if (!existingRelation) {
      await prisma.householdMemberUser.create({
        data: {
          userId,
          householdId: household.id,
          role: 'MEMBER'
        }
      });
    }

    const updatedHousehold = await prisma.household.findUnique({
      where: { id: household.id },
      include: {
        members: true,
        categories: true
      }
    });

    res.json(updatedHousehold);
  } catch (error) {
    console.error('Error al unirse al hogar:', error);
    res.status(500).json({ error: 'Error al unirse al hogar' });
  }
}

async function getHouseholdSummary(req, res) {
  try {
    const { id } = req.params;

    const household = await prisma.household.findUnique({
      where: { id },
      include: {
        members: { where: { isDeleted: false } },
        categories: { where: { isDeleted: false } },
        transactions: { where: { isDeleted: false } }
      }
    });

    if (!household) {
      return res.status(404).json({ error: 'Hogar no encontrado' });
    }

    const totalIncome = household.transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = household.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      id: household.id,
      name: household.name,
      inviteCode: household.inviteCode,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      memberCount: household.members.length,
      categoryCount: household.categories.length,
      transactionCount: household.transactions.length
    });
  } catch (error) {
    console.error('Error en resumen de hogar:', error);
    res.status(500).json({ error: 'Error al obtener resumen del hogar' });
  }
}

module.exports = { createHousehold, joinHousehold, getHouseholdSummary };
